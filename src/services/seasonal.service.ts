import { 
  collection, 
  getDocs, 
  getDoc,
  setDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SeasonalThemeConfig, SeasonalSystemConfig } from '@/shared/types/seasonal';
import { seasonalThemes } from '@/data/seasonal-themes';

const COLLECTION_NAME = 'seasonal_themes';
const CONFIG_DOC_ID = '_config';
const FIRESTORE_TIMEOUT = 2000; // 2s timeout
const ENABLE_FIRESTORE_FOR_PUBLIC = true; // Enabled to allow public/admin read/write

// Fallback data from JSON
const FALLBACK_THEMES = seasonalThemes;

/**
 * Fetches seasonal themes from Firestore.
 * Falls back to local JSON if Firestore is empty or fails (and we are in a safe mode).
 */
export async function fetchThemesFromFirestore(): Promise<SeasonalThemeConfig[]> {
  // If we are public/build, skip Firestore to avoid permission errors
  // But allow if explicitly enabled or if we are in admin context (not easily detected here without param)
  // For now, let's use the same conservative approach: 
  // ONLY fetch if we are sure db is ready AND we want to use it.
  
  const dbInstance = db;
  const shouldFetch = dbInstance && ENABLE_FIRESTORE_FOR_PUBLIC;

  if (!shouldFetch) {
    // Return fallback silently without error logs
    console.log('[SeasonalService] Firestore disabled or not ready. Using fallback.');
    return FALLBACK_THEMES;
  }

  try {
    const q = query(collection(dbInstance, COLLECTION_NAME), orderBy('id'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('No themes found in Firestore. Returning local fallback.');
      // Optional: Auto-seed Firestore with local data if empty?
      // For now, just return fallback to be safe.
      return FALLBACK_THEMES;
    }

    const themes: SeasonalThemeConfig[] = [];
    snapshot.forEach((doc) => {
      if (doc.id === CONFIG_DOC_ID) return; // Skip config document
      themes.push(doc.data() as SeasonalThemeConfig);
    });

    // Check if "Standard" exists in fetched themes, if not, inject it from fallback or default?
    // Actually, fallback JSON doesn't have it either. 
    // If Admin saved it, it should be in Firestore.

    return themes;
  } catch (error) {
    console.error('Error fetching themes from Firestore:', error);
    // On error (e.g., offline, permission), fallback to local JSON
    return FALLBACK_THEMES;
  }
}

/**
 * Fetches the system configuration for seasonal themes (e.g., automation toggle).
 */
export async function fetchSeasonalConfig(): Promise<SeasonalSystemConfig> {
  const dbInstance = db;
  // If db is not ready, default to true (Auto ON)
  if (!dbInstance) return { automationEnabled: true };

  try {
    const docRef = doc(dbInstance, COLLECTION_NAME, CONFIG_DOC_ID);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return snapshot.data() as SeasonalSystemConfig;
    }
    // Default config if not exists
    return { automationEnabled: true };
  } catch (error) {
    console.error('Error fetching seasonal config:', error);
    return { automationEnabled: true };
  }
}

/**
 * Saves the system configuration for seasonal themes.
 */
export async function saveSeasonalConfig(config: SeasonalSystemConfig): Promise<void> {
  const dbInstance = db;
  if (!dbInstance) throw new Error('Firestore is not configured.');
  
  try {
    const docRef = doc(dbInstance, COLLECTION_NAME, CONFIG_DOC_ID);
    await setDoc(docRef, config, { merge: true });
  } catch (error) {
    console.error('Error saving seasonal config:', error);
    throw error;
  }
}

export async function bulkUpdateImageReferences(replacements: Map<string, string>): Promise<number> {
  const dbInstance = db;
  if (!dbInstance || replacements.size === 0) return 0;

  try {
    const themes = await fetchThemesFromFirestore();
    const batch = writeBatch(dbInstance);
    let batchCount = 0;
    let updatedCount = 0;

    for (const theme of themes) {
      if (!theme.landing) continue;
      let changed = false;
      const l = theme.landing;

      // Helper
      const replace = (url: string | undefined) => {
        if (url && replacements.has(url)) {
            changed = true;
            return replacements.get(url)!;
        }
        return url;
      };

      l.heroImage = replace(l.heroImage);
      l.heroVideo = replace(l.heroVideo); // Video is a file too
      
      if (l.heroImages) {
          l.heroImages = l.heroImages.map(url => {
              if (url && replacements.has(url)) {
                  changed = true;
                  return replacements.get(url)!;
              }
              return url;
          });
      }

      if (changed) {
        // Need doc ref. If theme has ID, we can assume it's the doc ID.
        // The fetchThemesFromFirestore uses orderBy('id'), and pushes doc.data().
        // It doesn't explicitly attach doc.id to the object if it's not in data.
        // But usually id is in data. Let's verify type.
        // SeasonalThemeConfig usually has 'id'.
        const ref = doc(dbInstance, COLLECTION_NAME, theme.id);
        const cleanLanding = JSON.parse(JSON.stringify(l));
        batch.update(ref, { landing: cleanLanding });
        updatedCount++;
        batchCount++;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }
    return updatedCount;
  } catch (error) {
    console.error('Error updating seasonal image references:', error);
    return 0;
  }
}

/**
 * Updates a single image reference in all seasonal themes.
 * Wrapper around bulkUpdateImageReferences for compatibility with other services.
 */
export async function updateImageReference(oldUrl: string, newUrl: string): Promise<number> {
    const map = new Map<string, string>();
    map.set(oldUrl, newUrl);
    return bulkUpdateImageReferences(map);
}



/**
 * Saves all themes to Firestore.
 * Uses a batch operation to ensure atomicity for the list (overwrite strategy).
 */
export async function saveThemesToFirestore(themes: SeasonalThemeConfig[]): Promise<void> {
  const dbInstance = db;
  if (!dbInstance) {
    throw new Error('Firestore is not configured.');
  }

  try {
    const batch = writeBatch(dbInstance);
    
    // Strategy: We want to sync the provided list to Firestore.
    // Simplest way for a config list is to overwrite documents by ID.
    // Note: This doesn't delete removed themes automatically if we just setDoc.
    // To strictly mirror the list, we might want to delete all first or handle deletions.
    // For safety/simplicity in this iteration, we'll upsert.
    
    themes.forEach((theme) => {
      const docRef = doc(dbInstance, COLLECTION_NAME, theme.id);
      // Firestore does not accept 'undefined' values. We must sanitize the object.
      // JSON stringify/parse is a quick way to strip undefined fields.
      const sanitizedTheme = JSON.parse(JSON.stringify(theme));
      batch.set(docRef, sanitizedTheme);
    });

    await batch.commit();
  } catch (error) {
    console.error('Error saving themes to Firestore:', error);
    throw error;
  }
}

/**
 * Seeds Firestore with the initial JSON data if the collection is empty.
 * Useful for migration.
 */
export async function seedThemesToFirestore(): Promise<void> {
  const current = await fetchThemesFromFirestore();
  // If fetch returns fallback (JSON) effectively because DB is empty/error, 
  // we might want to force push JSON to DB.
  
  // Let's check specifically if DB is empty without the fallback logic
  if (!db) return;
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  
  if (snapshot.empty) {
    console.log('Seeding Firestore with initial seasonal themes...');
    await saveThemesToFirestore(FALLBACK_THEMES);
  }
}
