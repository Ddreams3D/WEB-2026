import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  OrganicFormCopy,
  DEFAULT_ORGANIC_FORM_COPY,
} from '@/shared/types/organic-form';

const COLLECTION = 'organic_forms';
const DOC_ID = 'modelado-3d-personalizado';

export async function fetchOrganicFormCopy(): Promise<OrganicFormCopy> {
  if (!db) return DEFAULT_ORGANIC_FORM_COPY;

  try {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) return DEFAULT_ORGANIC_FORM_COPY;

    const data = snap.data() as Partial<OrganicFormCopy>;
    return {
      ...DEFAULT_ORGANIC_FORM_COPY,
      ...data,
    };
  } catch (error) {
    console.warn(
      '[organic-form.service] Error fetching organic form copy, using defaults',
      error
    );
    return DEFAULT_ORGANIC_FORM_COPY;
  }
}

export async function saveOrganicFormCopy(
  copy: OrganicFormCopy
): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');

  const ref = doc(db, COLLECTION, DOC_ID);
  const sanitized = JSON.parse(JSON.stringify(copy));
  await setDoc(ref, sanitized, { merge: true });
}

