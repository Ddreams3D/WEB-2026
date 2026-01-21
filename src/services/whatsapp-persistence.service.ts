import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WHATSAPP_TEMPLATES, WhatsAppTemplateId, WhatsAppTemplate } from '@/config/whatsapp.templates';

const COLLECTION = 'settings';
const DOC_ID = 'whatsapp_templates';

export class WhatsAppPersistenceService {
  /**
   * Loads templates from Firestore.
   * If document doesn't exist, returns default templates.
   */
  static async loadTemplates(): Promise<Record<WhatsAppTemplateId, WhatsAppTemplate>> {
    if (!db) return WHATSAPP_TEMPLATES;

    try {
      const docRef = doc(db, COLLECTION, DOC_ID);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        // Merge with defaults to ensure all keys exist (in case of new templates in code)
        return {
          ...WHATSAPP_TEMPLATES,
          ...data
        } as Record<WhatsAppTemplateId, WhatsAppTemplate>;
      }
    } catch (error) {
      console.error('Error loading WhatsApp templates:', error);
    }

    return WHATSAPP_TEMPLATES;
  }

  /**
   * Saves all templates to Firestore.
   */
  static async saveTemplates(templates: Record<WhatsAppTemplateId, WhatsAppTemplate>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');

    const docRef = doc(db, COLLECTION, DOC_ID);
    await setDoc(docRef, templates);
  }

  /**
   * Subscribes to real-time updates (Optional, good for Admin UI)
   */
  static subscribe(callback: (templates: Record<WhatsAppTemplateId, WhatsAppTemplate>) => void): () => void {
    if (!db) return () => {};

    const docRef = doc(db, COLLECTION, DOC_ID);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback({
          ...WHATSAPP_TEMPLATES,
          ...data
        } as Record<WhatsAppTemplateId, WhatsAppTemplate>);
      }
    });
  }
}
