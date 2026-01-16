import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { FinanceRecord } from '../types';

export const SyncService = {
  /**
   * Performs a robust sync between local records and cloud storage.
   * Strategy: Fetch Cloud -> Merge (Last Write Wins) -> Upload Merged -> Return Merged
   */
  async syncFinanceData(
    localRecords: FinanceRecord[], 
    backupFileName: string
  ): Promise<FinanceRecord[]> {
    if (!storage) throw new Error('Firebase Storage not initialized');

    const storageRef = ref(storage, `finances/${backupFileName}`);
    let cloudRecords: FinanceRecord[] = [];

    // 1. Fetch Cloud Data
    try {
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      if (response.ok) {
        cloudRecords = await response.json();
      }
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.log('No cloud backup found. Creating new one.');
        cloudRecords = [];
      } else {
        console.error('Error fetching cloud backup:', error);
        throw error;
      }
    }

    // 2. Merge Logic (Atomic-like in memory)
    const mergedRecords = this.mergeRecords(localRecords, cloudRecords);

    // 3. Upload Merged Data
    try {
      const jsonString = JSON.stringify(mergedRecords);
      await uploadString(storageRef, jsonString, 'raw', {
        contentType: 'application/json',
        customMetadata: {
          lastSync: new Date().toISOString(),
          recordCount: mergedRecords.length.toString()
        }
      });
    } catch (error) {
      console.error('Error uploading merged backup:', error);
      throw error;
    }

    return mergedRecords;
  },

  /**
   * Merges two arrays of records based on ID and updatedAt timestamp.
   * Latest version always wins.
   */
  mergeRecords(local: FinanceRecord[], cloud: FinanceRecord[]): FinanceRecord[] {
    const map = new Map<string, FinanceRecord>();

    // 1. Load Cloud Records first (Baseline)
    cloud.forEach(record => {
      map.set(record.id, record);
    });

    // 2. Merge Local Records
    local.forEach(localRecord => {
      const cloudRecord = map.get(localRecord.id);

      if (!cloudRecord) {
        // New record created locally
        map.set(localRecord.id, localRecord);
      } else {
        // Conflict: Compare timestamps
        if (localRecord.updatedAt > cloudRecord.updatedAt) {
          // Local is newer (edited or deleted locally)
          map.set(localRecord.id, localRecord);
        } else {
          // Cloud is newer (edited or deleted on another device)
          // Keep cloudRecord (already in map)
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
  }
};
