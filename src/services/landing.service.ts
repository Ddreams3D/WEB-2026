import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LandingMainConfig } from '@/shared/types/landing';

const COLLECTION = 'landing_main';
const DOC_ID = 'main'; // Legacy ID, now treated as Arequipa

export async function fetchLandingMain(): Promise<LandingMainConfig | null> {
  return fetchCityLanding('main');
}

export async function fetchCityLanding(cityId: string = 'main'): Promise<LandingMainConfig | null> {
    if (!db) return null;
    try {
      const ref = doc(db, COLLECTION, cityId);
      const snap = await getDoc(ref);
      
      if (snap.exists()) {
        return snap.data() as LandingMainConfig;
      }
      
      // Default configurations for new cities if they don't exist
      if (cityId === 'lima') {
        return {
            heroTitle: 'Impresión 3D en Lima',
            heroSubtitle: 'Prototipos y producción a escala en Lima',
            heroDescription: 'Servicio de impresión 3D industrial y artístico con envíos rápidos a todo Lima Metropolitana.',
            heroImage: '',
            ctaText: 'Cotizar en Lima',
            ctaLink: '/contact',
            primaryColor: '#4f46e5', // Indigo: Tecnológico, Corporativo y Moderno (Ideal para Capital)
            bubbleImages: [],
            announcement: {
                enabled: false,
                content: '¡Nuevo centro de distribución en Lima!',
                closable: true,
                bgColor: '#312e81', // Indigo oscuro
                textColor: '#ffffff'
            }
        };
      }
      
      return null;
    } catch (error) {
      console.warn(`[LandingService] Error fetching landing config for ${cityId} (using defaults):`, error);
      return null;
    }
}

export async function saveLandingMain(config: LandingMainConfig): Promise<void> {
  return saveCityLanding('main', config);
}

export async function saveCityLanding(cityId: string, config: LandingMainConfig): Promise<void> {
    if (!db) throw new Error('Firestore is not configured.');
    const ref = doc(db, COLLECTION, cityId);
    const sanitized = JSON.parse(JSON.stringify(config));
    await setDoc(ref, sanitized, { merge: true });
}

export async function bulkUpdateImageReferences(replacements: Map<string, string>): Promise<number> {
  if (!db || replacements.size === 0) return 0;
  try {
    const cities = ['main', 'lima'];
    let totalChanged = 0;

    for (const city of cities) {
        const config = await fetchCityLanding(city);
        if (!config) continue;

        let changed = false;
        
        // Helper
        const replace = (url: string | undefined) => {
          if (url && replacements.has(url)) {
            changed = true;
            return replacements.get(url)!;
          }
          return url;
        };

        // 1. Hero
        config.heroImage = replace(config.heroImage);

        // 2. Bubbles
        if (config.bubbleImages) {
            config.bubbleImages = config.bubbleImages.map(url => {
                if (url && replacements.has(url)) {
                    changed = true;
                    return replacements.get(url)!;
                }
                return url;
            });
        }

        if (changed) {
          await saveCityLanding(city, config);
          totalChanged++;
        }
    }
    
    return totalChanged;
  } catch (error) {
    console.error('Error updating landing image references:', error);
    return 0;
  }
}
