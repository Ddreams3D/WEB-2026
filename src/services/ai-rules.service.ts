import { 
  doc, 
  getDoc, 
  setDoc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AIRulesConfig, DEFAULT_AI_RULES } from '@/shared/types/ai-rules';

const COLLECTION_NAME = 'system_settings';
const DOC_ID = 'ai_rules';

export async function fetchAIRules(): Promise<AIRulesConfig> {
  if (!db) {
    console.warn('Firestore not initialized, returning default AI rules');
    return DEFAULT_AI_RULES;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as AIRulesConfig;
    } else {
      // Initialize if not exists
      console.log('AI Rules not found, initializing with defaults...');
      await saveAIRules(DEFAULT_AI_RULES);
      return DEFAULT_AI_RULES;
    }
  } catch (error) {
    console.error('Error fetching AI rules:', error);
    return DEFAULT_AI_RULES;
  }
}

export async function saveAIRules(config: AIRulesConfig): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    await setDoc(docRef, {
      ...config,
      lastUpdated: Date.now()
    });
  } catch (error) {
    console.error('Error saving AI rules:', error);
    throw error;
  }
}
