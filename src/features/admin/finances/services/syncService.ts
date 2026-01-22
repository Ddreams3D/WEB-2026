import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { FinanceRecord, MonthlyBudgets, MonthlyBudgetItem, FinanceSettings } from '../types';

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

  async syncMonthlyBudgets(
    localBudgets: MonthlyBudgets,
    backupFileName: string
  ): Promise<MonthlyBudgets> {
    if (!storage) throw new Error('Firebase Storage not initialized');

    const storageRef = ref(storage, `finances/${backupFileName}`);
    let cloudBudgets: MonthlyBudgets = {};

    try {
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        if (json && typeof json === 'object') {
          cloudBudgets = json as MonthlyBudgets;
        }
      }
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.log('No cloud budget backup found. Creating new one.');
        cloudBudgets = {};
      } else {
        console.error('Error fetching cloud budget backup:', error);
        throw error;
      }
    }

    const mergedBudgets = this.mergeBudgets(localBudgets, cloudBudgets);

    try {
      const jsonString = JSON.stringify(mergedBudgets);
      await uploadString(storageRef, jsonString, 'raw', {
        contentType: 'application/json',
        customMetadata: {
          lastSync: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error uploading merged budget backup:', error);
      throw error;
    }

    return mergedBudgets;
  },

  async syncFinanceSettings(
    localSettings: FinanceSettings,
    backupFileName: string
  ): Promise<FinanceSettings> {
    if (!storage) throw new Error('Firebase Storage not initialized');

    const storageRef = ref(storage, `finances/${backupFileName}`);
    let cloudSettings: FinanceSettings | null = null;

    try {
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      if (response.ok) {
        cloudSettings = await response.json();
      }
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.log('No cloud settings backup found. Using local.');
        cloudSettings = null;
      } else {
        console.error('Error fetching cloud settings backup:', error);
        // Don't throw here, just return local if cloud fails? 
        // Better to throw to alert user of sync failure
        throw error;
      }
    }

    // Merge Logic: Last Write Wins based on updatedAt
    let mergedSettings = localSettings;
    
    if (cloudSettings) {
      const localTime = localSettings.updatedAt || 0;
      const cloudTime = cloudSettings.updatedAt || 0;

      if (cloudTime > localTime) {
        mergedSettings = cloudSettings;
      }
    }

    // Upload Merged (or Local if newer)
    try {
      const jsonString = JSON.stringify(mergedSettings);
      await uploadString(storageRef, jsonString, 'raw', {
        contentType: 'application/json',
        customMetadata: {
          lastSync: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error uploading settings backup:', error);
      throw error;
    }

    return mergedSettings;
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
  },

  mergeBudgets(local: MonthlyBudgets, cloud: MonthlyBudgets): MonthlyBudgets {
    const result: MonthlyBudgets = { ...cloud };

    Object.entries(local).forEach(([key, localItems]) => {
      const cloudItems = cloud[key] ?? [];
      const byId = new Map<string, MonthlyBudgetItem>();

      cloudItems.forEach((item) => {
        byId.set(item.id, item);
      });

      localItems.forEach((item) => {
        byId.set(item.id, item);
      });

      result[key] = Array.from(byId.values());
    });

    return result;
  }
};
