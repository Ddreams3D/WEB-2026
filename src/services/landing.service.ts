import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LandingMainConfig } from '@/shared/types/landing';

const COLLECTION = 'landing_main';
const DOC_ID = 'main';

export async function fetchLandingMain(): Promise<LandingMainConfig | null> {
  if (!db) return null;
  try {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as LandingMainConfig) : null;
  } catch (error) {
    console.warn('[LandingService] Error fetching landing config (using defaults):', error);
    return null;
  }
}

export async function saveLandingMain(config: LandingMainConfig): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  const ref = doc(db, COLLECTION, DOC_ID);
  const sanitized = JSON.parse(JSON.stringify(config));
  await setDoc(ref, sanitized, { merge: true });
}

export async function bulkUpdateImageReferences(replacements: Map<string, string>): Promise<number> {
  if (!db || replacements.size === 0) return 0;
  try {
    const config = await fetchLandingMain();
    if (!config) return 0;

    let changed = false;
    
    // Helper
    const replace = (url: string | undefined) => {
      if (url && replacements.has(url)) {
        changed = true;
        return replacements.get(url)!;
      }
      return url;
    };

    // 1. Hero
    config.heroImage = replace(config.heroImage);

    // 2. Bubbles
    if (config.bubbleImages) {
        config.bubbleImages = config.bubbleImages.map(url => {
            if (url && replacements.has(url)) {
                changed = true;
                return replacements.get(url)!;
            }
            return url;
        });
    }

    if (changed) {
      await saveLandingMain(config);
      return 1;
    }
    return 0;
  } catch (error) {
    console.error('Error updating landing main image references:', error);
    return 0;
  }
}
