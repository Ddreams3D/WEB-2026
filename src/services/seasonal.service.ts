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
import seasonalThemesData from '@/data/seasonal-themes.json';

const COLLECTION_NAME = 'seasonal_themes';
const CONFIG_DOC_ID = '_config';
const FIRESTORE_TIMEOUT = 2000; // 2s timeout
const ENABLE_FIRESTORE_FOR_PUBLIC = true; // Enabled to allow public/admin read/write

// Fallback data from JSON
const FALLBACK_THEMES = seasonalThemesData as SeasonalThemeConfig[];

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
    await setDoc(docRef, config);
  } catch (error) {
    console.error('Error saving seasonal config:', error);
    throw error;
  }
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
