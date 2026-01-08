import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, query, where, getDoc } from 'firebase/firestore';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { SERVICE_LANDINGS_DATA } from '@/shared/data/service-landings-data';

const COLLECTION = 'service_landings';

export const ServiceLandingsService = {
  async getAll(): Promise<ServiceLandingConfig[]> {
    if (!db) {
      console.warn('Firebase not initialized, falling back to static data');
      return SERVICE_LANDINGS_DATA;
    }

    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION));
      const dbLandings = querySnapshot.docs.map(doc => doc.data() as ServiceLandingConfig);

      // Merge strategy: Start with static data
      const mergedLandings = [...SERVICE_LANDINGS_DATA];

      // Overlay DB data
      dbLandings.forEach(dbLanding => {
        const index = mergedLandings.findIndex(l => l.id === dbLanding.id);
        if (index >= 0) {
          // Merge DB data but keep local styling/config if needed
          const localData = mergedLandings[index];
          mergedLandings[index] = {
            ...dbLanding,
            // Ensure local code config for colors takes precedence if defined
            // This ensures design updates in code are reflected even if DB exists
            primaryColor: localData.primaryColor ?? dbLanding.primaryColor,
          };
        } else {
          mergedLandings.push(dbLanding);
        }
      });

      return mergedLandings;
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        console.warn('Firestore permission denied (getAll). Falling back to static data.');
      } else {
        console.error('Error fetching service landings from Firebase:', error);
      }
      return SERVICE_LANDINGS_DATA;
    }
  },

  async getBySlug(slug: string): Promise<ServiceLandingConfig | undefined> {
    // 1. Try to find in DB first (most up to date)
    if (db) {
      try {
        // Query by slug only (uses default single-field index)
        const q = query(
            collection(db, COLLECTION), 
            where('slug', '==', slug)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as ServiceLandingConfig;
          
          // Apply local overrides (like color) to ensure code updates are reflected
          const localData = SERVICE_LANDINGS_DATA.find(l => l.id === data.id);
          const finalData = localData ? {
             ...data,
             primaryColor: localData.primaryColor ?? data.primaryColor
          } : data;

          // Filter soft-deleted in memory
          if (!finalData.isDeleted) {
            return finalData;
          }
        }
      } catch (error: any) {
        if (error?.code === 'permission-denied') {
           console.warn(`Firestore permission denied (getBySlug: ${slug}). Falling back to static data.`);
        } else {
           console.error('Error fetching landing by slug from Firebase:', error);
           // Fallback to static if DB fails (unless it was a not found)
        }
      }
    }

    // 2. Fallback to static data
    const staticLanding = SERVICE_LANDINGS_DATA.find(l => l.slug === slug);
    if (staticLanding && !staticLanding.isDeleted) {
        return staticLanding;
    }
    return undefined;
  },

  async save(landing: ServiceLandingConfig): Promise<void> {
    if (!db) throw new Error('Firebase is not configured');
    
    try {
      // Ensure we clean undefined values as Firestore doesn't like them
      const cleanData = JSON.parse(JSON.stringify(landing));
      
      await setDoc(doc(db, COLLECTION, landing.id), {
        ...cleanData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Permisos insuficientes para guardar cambios. Verifica las reglas de Firestore.');
      }
      console.error('Error saving service landing to Firebase:', error);
      throw error;
    }
  }
};
