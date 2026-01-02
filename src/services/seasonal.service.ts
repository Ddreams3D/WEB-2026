import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import seasonalThemesData from '@/data/seasonal-themes.json';

const COLLECTION_NAME = 'seasonal_themes';

// Fallback data from JSON
const FALLBACK_THEMES = seasonalThemesData as SeasonalThemeConfig[];

/**
 * Fetches seasonal themes from Firestore.
 * Falls back to local JSON if Firestore is empty or fails (and we are in a safe mode).
 */
export async function fetchThemesFromFirestore(): Promise<SeasonalThemeConfig[]> {
  if (!db) {
    console.warn('Firestore is not initialized. Using local JSON fallback.');
    return FALLBACK_THEMES;
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('id'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('No themes found in Firestore. Returning local fallback.');
      // Optional: Auto-seed Firestore with local data if empty?
      // For now, just return fallback to be safe.
      return FALLBACK_THEMES;
    }

    const themes: SeasonalThemeConfig[] = [];
    snapshot.forEach((doc) => {
      themes.push(doc.data() as SeasonalThemeConfig);
    });

    return themes;
  } catch (error) {
    console.error('Error fetching themes from Firestore:', error);
    // On error (e.g., offline, permission), fallback to local JSON
    return FALLBACK_THEMES;
  }
}

/**
 * Saves all themes to Firestore.
 * Uses a batch operation to ensure atomicity for the list (overwrite strategy).
 */
export async function saveThemesToFirestore(themes: SeasonalThemeConfig[]): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not configured.');
  }

  try {
    const batch = writeBatch(db);
    
    // Strategy: We want to sync the provided list to Firestore.
    // Simplest way for a config list is to overwrite documents by ID.
    // Note: This doesn't delete removed themes automatically if we just setDoc.
    // To strictly mirror the list, we might want to delete all first or handle deletions.
    // For safety/simplicity in this iteration, we'll upsert.
    
    themes.forEach((theme) => {
      const docRef = doc(db, COLLECTION_NAME, theme.id);
      batch.set(docRef, theme);
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
