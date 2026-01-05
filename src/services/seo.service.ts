import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { SeoConfig } from '@/features/admin/settings/components/pages-manager/types';
import { Metadata } from 'next';

const COLLECTION = 'seo_routes';

// Helper to sanitize path for use as document ID
// e.g. "/" -> "home"
// "/about" -> "about"
// "/catalogo/producto" -> "catalogo_producto"
export function getDocIdFromPath(path: string): string {
  // 1. Remove query params and hash
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // 2. Handle root path
  if (cleanPath === '/' || cleanPath === '') return 'home';
  
  // 3. Normalize: remove leading slashes, replace remaining slashes with underscores
  // e.g. "///catalogo//slug" -> "catalogo_slug"
  return cleanPath
    .replace(/^\/+/, '')     // Remove leading slashes
    .replace(/\/+/g, '_');   // Replace internal slashes with single underscore
}

export async function fetchSeoConfig(path: string): Promise<SeoConfig | null> {
  if (!db) return null;
  try {
    const docId = getDocIdFromPath(path);
    const ref = doc(db, COLLECTION, docId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as SeoConfig) : null;
  } catch (error) {
    console.error(`[SeoService] Error fetching config for ${path}:`, error);
    return null;
  }
}

export async function saveSeoConfig(path: string, config: SeoConfig): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  
  // Debug: Check auth state before write
  if (auth?.currentUser) {
    console.log(`[SeoService] Saving config for ${path}. User: ${auth.currentUser.email} (${auth.currentUser.uid})`);
  } else {
    console.warn('[SeoService] WARNING: No user logged in. Write may fail if rules require auth.');
  }

  const docId = getDocIdFromPath(path);
  const ref = doc(db, COLLECTION, docId);
  
  // Remove undefined values
  const cleanConfig = Object.entries(config).reduce((acc, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {} as any);

  // Add metadata about the path for easier debugging in DB
  cleanConfig.path = path;
  cleanConfig.updatedAt = new Date().toISOString();

  await setDoc(ref, cleanConfig, { merge: true });
}

export async function fetchAllSeoConfigs(): Promise<Record<string, SeoConfig>> {
  if (!db) return {};
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    const configs: Record<string, SeoConfig> = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data() as SeoConfig;
      configs[doc.id] = data;
    });
    return configs;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.error('[SeoService] Permission denied. Please check that your Firestore Security Rules allow reading "seo_routes".');
    } else {
      console.error('[SeoService] Error fetching all configs:', error);
    }
    return {};
  }
}

// --- NEXT.JS METADATA HELPER ---

// Helper to parse robots string safely
function parseRobotsDirectives(robotsStr: string) {
  const directives = robotsStr.toLowerCase().split(',').map(s => s.trim());
  
  // "noindex" overrides everything else regarding indexing
  const isNoIndex = directives.includes('noindex');
  // "nofollow" overrides everything else regarding following
  const isNoFollow = directives.includes('nofollow');

  return {
    index: !isNoIndex, // If noindex is present, index is false. If absent, default is true (usually).
    follow: !isNoFollow,
  };
}

export async function generateSeoMetadata(path: string, defaultMeta: Metadata): Promise<Metadata> {
  const config = await fetchSeoConfig(path);
  
  if (!config) return defaultMeta;

  const robots = config.robots ? parseRobotsDirectives(config.robots) : null;

  return {
    ...defaultMeta,
    title: config.metaTitle || defaultMeta.title,
    description: config.metaDescription || defaultMeta.description,
    keywords: config.keywords || defaultMeta.keywords,
    alternates: {
      canonical: config.canonicalUrl || (defaultMeta.alternates as any)?.canonical,
    },
    robots: robots ? {
      index: robots.index,
      follow: robots.follow,
      googleBot: {
        index: robots.index,
        follow: robots.follow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    } : defaultMeta.robots,
    openGraph: {
      ...defaultMeta.openGraph,
      title: config.metaTitle || defaultMeta.openGraph?.title,
      description: config.metaDescription || defaultMeta.openGraph?.description,
      images: config.ogImage ? [{ url: config.ogImage }] : defaultMeta.openGraph?.images,
    }
  };
}
