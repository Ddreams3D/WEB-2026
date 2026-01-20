import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, query, where, getDoc, writeBatch } from 'firebase/firestore';
import { ServiceLandingConfig, ServiceLandingSection } from '@/shared/types/service-landing';
import { SERVICE_LANDINGS_DATA } from '@/shared/data/service-landings-data';

const COLLECTION = 'service_landings';

function mergeSections(localSections: ServiceLandingSection[] = [], dbSections: ServiceLandingSection[] = []): ServiceLandingSection[] {
  const result: ServiceLandingSection[] = [...dbSections];

  localSections.forEach(localSection => {
    const exists = dbSections.some(dbSection => dbSection.id === localSection.id);
    if (!exists) {
      result.push(localSection);
    }
  });

  return result;
}

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
          const localData = mergedLandings[index];
          mergedLandings[index] = {
            ...dbLanding,
            primaryColor: localData.primaryColor ?? dbLanding.primaryColor,
            sections: mergeSections(localData.sections, dbLanding.sections || []),
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
          
          // Apply local overrides (like color/sections) to ensure code updates are reflected
          const localData = SERVICE_LANDINGS_DATA.find(l => l.id === data.id);
          const finalData = localData ? {
             ...data,
             primaryColor: localData.primaryColor ?? data.primaryColor,
             sections: mergeSections(localData.sections, data.sections || [])
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
    if (staticLanding && !staticLanding.isDeleted && staticLanding.isActive !== false) {
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
  },

  async updateImageReference(oldUrl: string, newUrl: string): Promise<number> {
    const map = new Map<string, string>();
    map.set(oldUrl, newUrl);
    return this.bulkUpdateImageReferences(map);
  },

  async bulkUpdateImageReferences(replacements: Map<string, string>): Promise<number> {
    if (!db || replacements.size === 0) return 0;
    let updatedCount = 0;

    try {
      // 1. Get all landings (1 fetch)
      // Note: We need the actual DOC IDs to update efficiently.
      // getAll() returns the data objects.
      // We'll query everything from the collection to get refs.
      const snapshot = await getDocs(collection(db, COLLECTION));
      if (snapshot.empty) return 0;

      const batch = writeBatch(db);
      let batchCount = 0;

      snapshot.docs.forEach(docSnap => {
        const landing = docSnap.data() as ServiceLandingConfig;
        let changed = false;

        // Helper to replace
        const replace = (url: string | undefined) => {
          if (url && replacements.has(url)) {
            changed = true;
            return replacements.get(url)!;
          }
          return url;
        };

        // 1. Hero
        landing.heroImage = replace(landing.heroImage);
        landing.heroImageComparison = replace(landing.heroImageComparison);

        // 2. Sections
        landing.sections?.forEach(section => {
          section.image = replace(section.image);
          section.items?.forEach(item => {
            item.image = replace(item.image);
          });
        });

        if (changed) {
          // Ensure no undefined values are passed to Firestore
          const cleanLanding = JSON.parse(JSON.stringify(landing));
          batch.set(docSnap.ref, cleanLanding, { merge: true });
          updatedCount++;
          batchCount++;
        }
      });

      if (batchCount > 0) {
        await batch.commit();
      }
    } catch (error) {
      console.error('Error updating image references:', error);
    }

    return updatedCount;
  }
};
