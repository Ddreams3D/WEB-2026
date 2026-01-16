import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { InboxItem } from '../types';

const INBOX_FILENAME = 'bot_inbox.json';

export const InboxService = {
  /**
   * Appends an item to the inbox with atomic-like safety.
   * Fetch -> Check Duplicate -> Append -> Upload
   */
  async appendItem(newItem: InboxItem): Promise<boolean> {
    if (!storage) throw new Error('Firebase Storage not initialized');
    
    const storageRef = ref(storage, `finances/${INBOX_FILENAME}`);
    let currentInbox: InboxItem[] = [];

    // 1. Fetch current state
    try {
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      if (response.ok) {
        currentInbox = await response.json();
      }
    } catch (error: any) {
      if (error.code !== 'storage/object-not-found') {
        console.error('Error fetching inbox:', error);
        throw error;
      }
      // If not found, start with empty array
    }

    // 2. Idempotency Check (Dedupe)
    if (currentInbox.some(item => item.id === newItem.id)) {
      console.log('Duplicate item detected, skipping:', newItem.id);
      return true; // Return true as "processed"
    }

    // 3. Append
    const updatedInbox = [...currentInbox, newItem];

    // 4. Upload (Commit)
    try {
      // TODO: In a real high-concurrency scenario, we would check ETag/Generation match here.
      // For single-user, this fetch-modify-write cycle is sufficient.
      await uploadString(storageRef, JSON.stringify(updatedInbox), 'raw', {
        contentType: 'application/json',
        customMetadata: {
          lastUpdated: new Date().toISOString()
        }
      });
      return true;
    } catch (error) {
      console.error('Error uploading inbox:', error);
      // Retry logic could be added here if needed
      return false;
    }
  },

  async getInbox(): Promise<InboxItem[]> {
    if (!storage) return [];
    
    const storageRef = ref(storage, `finances/${INBOX_FILENAME}`);
    try {
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') return [];
      console.error('Error fetching inbox:', error);
    }
    return [];
  },

  async removeFromInbox(itemIdsToRemove: string[]): Promise<void> {
    if (!storage || itemIdsToRemove.length === 0) return;

    const storageRef = ref(storage, `finances/${INBOX_FILENAME}`);
    
    // 1. Fetch
    let currentInbox: InboxItem[] = [];
    try {
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      if (response.ok) currentInbox = await response.json();
    } catch (error) {
      console.error('Error fetching inbox for removal:', error);
      return;
    }

    // 2. Filter out removed items
    const updatedInbox = currentInbox.filter(item => !itemIdsToRemove.includes(item.id));

    // 3. Upload
    await uploadString(storageRef, JSON.stringify(updatedInbox), 'raw', {
      contentType: 'application/json'
    });
  }
};
