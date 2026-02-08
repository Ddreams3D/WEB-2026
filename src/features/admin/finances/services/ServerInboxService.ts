import { adminStorage } from '@/lib/admin-sdk';
import { InboxItem } from '../types';

const INBOX_FILENAME = 'bot_inbox.json';
const FILE_PATH = `finances/${INBOX_FILENAME}`;

export const ServerInboxService = {
  /**
   * Appends an item to the inbox using Firebase Admin SDK (Server-side).
   * Safe to use in API Routes.
   */
  async appendItem(newItem: InboxItem): Promise<boolean> {
    if (!adminStorage) {
      console.error('[ServerInboxService] Admin Storage not initialized');
      return false;
    }

    try {
      const bucket = adminStorage.bucket(); // Uses default bucket from config
      const file = bucket.file(FILE_PATH);
      let currentInbox: InboxItem[] = [];

      // 1. Fetch current state
      const [exists] = await file.exists();
      
      if (exists) {
        try {
          const [content] = await file.download();
          const jsonString = content.toString('utf-8');
          if (jsonString.trim()) {
             currentInbox = JSON.parse(jsonString);
          }
        } catch (readError) {
          console.error('[ServerInboxService] Error reading existing inbox:', readError);
          // If file exists but can't be read/parsed, we should probably abort to avoid data loss
          return false;
        }
      }

      // 2. Dedupe
      if (currentInbox.some(item => item.id === newItem.id)) {
        console.log('[ServerInboxService] Duplicate item detected, skipping:', newItem.id);
        return true; 
      }

      // 3. Append
      const updatedInbox = [...currentInbox, newItem];

      // 4. Save
      await file.save(JSON.stringify(updatedInbox), {
        contentType: 'application/json',
        metadata: {
          metadata: {
            lastUpdated: new Date().toISOString()
          }
        }
      });
      
      console.log(`[ServerInboxService] Item ${newItem.id} saved successfully.`);
      return true;

    } catch (error) {
      console.error('[ServerInboxService] Fatal error saving inbox:', error);
      return false;
    }
  }
};
