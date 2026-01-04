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

