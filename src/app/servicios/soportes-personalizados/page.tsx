import { Metadata } from 'next';
import { SUPPORT_CATEGORIES, type SupportCategory, type SupportItem, DEFAULT_HERO } from '@/app/soportes-personalizados/data';
import { ServiceLandingsService } from '@/services/service-landings.service';
import { getCachedProducts } from '@/services/data-access.server';
import SupportsLandingRenderer from '@/app/soportes-personalizados/SupportsLandingRenderer';
import { ServiceLandingConfig } from '@/shared/types/service-landing';

export const metadata: Metadata = {
  title: 'Soportes Personalizados | Ddreams 3D',
  description: 'Colección exclusiva de soportes personalizados para Alexa, Nintendo Switch, celulares y más.',
  robots: {
    // HIDDEN due to copyright content (e.g. Nintendo/Alexa trademarks)
    // DO NOT CHANGE to index: true without resolving copyright issues first.
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    }
  },
};

export default async function SupportsPage() {
  // 1. Fetch Landing Configuration
  const allLandings = await ServiceLandingsService.getAll();
  // Try finding by explicit slug, or fallback to the one user likely created
  let landing = allLandings.find(l => l.slug === 'soportes-personalizados-dispositivos' || l.slug === 'soportes-personalizados');
  
  // AUTO-FIX: Restore original hero content if generic title is detected (reverts accidental overrides)
  if (landing && landing.sections?.some(s => s.type === 'hero' && s.title === 'Soportes Personalizados')) {
    landing = {
      ...landing,
      heroImage: DEFAULT_HERO.imageUrl,
      sections: landing.sections.map(s => {
        if (s.type === 'hero') {
          return {
            ...s,
            title: DEFAULT_HERO.title,
            subtitle: DEFAULT_HERO.subtitle
          };
        }
        return s;
      })
    };
  }
  
  // 2. Fetch Dynamic Products
  const allProducts = await getCachedProducts();
  const dynamicProducts = allProducts.filter(p => {
    const tags = (p.tags || []).map(t => t.toLowerCase());
    const isScoped = tags.some(t => t.includes('scope:landing-soportes-personalizados'));
    const isHidden = tags.includes('scope:hidden') || tags.includes('oculto');
    return p.isActive && isScoped && !isHidden;
  });

  // 3. Merge Products into Categories
  // Clone categories to avoid mutating the constant
  const displayCategories: SupportCategory[] = JSON.parse(JSON.stringify(SUPPORT_CATEGORIES));
  
  // Extract "Otros" to ensure it stays at the end
  const othersIndex = displayCategories.findIndex(c => c.id === 'otros');
  let othersCategory: SupportCategory | undefined;
  if (othersIndex !== -1) {
    othersCategory = displayCategories.splice(othersIndex, 1)[0];
  }

  dynamicProducts.forEach(product => {
    // Basic slugify for category if needed, or default to 'general'
    const catSlug = product.categoryName 
      ? product.categoryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      : 'general';

    const item: SupportItem = {
      id: product.id,
      title: product.name,
      description: product.shortDescription || product.description.substring(0, 100),
      imageUrl: product.images?.[0]?.url,
      price: product.price,
      slug: product.slug,
      categorySlug: catSlug
    };

    // Smart Categorization
    const catName = (product.categoryName || '').toLowerCase();
    const tags = (product.tags || []).join(' ').toLowerCase();
    const text = `${catName} ${tags} ${item.title.toLowerCase()}`;

    let placed = false;
    
    // Helper for keyword checking
    const checkKeywords = (sourceText: string) => {
      if (/\b(alexa|echo|amazon)\b/i.test(sourceText)) return 'alexa';
      // Added plural support (joycons)
      if (/\b(switch|nintendo|joycon(s)?)\b/i.test(sourceText)) return 'nintendo-switch';
      // Added plural support (celulares, smartphones, moviles)
      if (/\b(celular(es)?|iphone|samsung|smartphone(s)?|móvil(es)?|movil(es)?)\b/i.test(sourceText)) return 'celulares';
      // Added plural support (mandos, controles)
      if (/\b(mando(s)?|control(es)?|ps5|xbox|playstation)\b/i.test(sourceText)) return 'mandos';
      // Added plural support (auriculares, headsets, audifonos)
      if (/\b(auricular(es)?|headset(s)?|aud[íi]fono(s)?)\b/i.test(sourceText)) return 'audifonos';
      return null;
    };

    // 1. PRIORITY: Check explicit Category Name first
    const explicitId = checkKeywords(catName);
    if (explicitId) {
      const cat = displayCategories.find(c => c.id === explicitId);
      if (cat) { 
        cat.items.push(item); 
        return; // Done!
      }
    }

    // 2. Fallback: Fuzzy Text Search (Description, Tags, Title)
    const fuzzyId = checkKeywords(text);
    if (fuzzyId) {
      const cat = displayCategories.find(c => c.id === fuzzyId);
      if (cat) { 
        cat.items.push(item); 
        placed = true; 
      }
    }

    if (placed) return;

    // 3. Fallback to Others
    if (!placed && othersCategory) {
      othersCategory.items.push(item);
    }
  });

  // Re-append "Otros" at the end if it has items or just to keep structure
  if (othersCategory) {
    displayCategories.push(othersCategory);
  }

  // Fallback config if not found
  const defaultConfig: ServiceLandingConfig = {
    id: 'soportes-personalizados-landing',
    slug: 'soportes-personalizados',
    name: 'Soportes Personalizados',
    isActive: true,
    themeMode: 'system' as const,
    category: 'special',
    metaTitle: 'Soportes Personalizados | Ddreams 3D',
    metaDescription: 'Colección exclusiva de soportes personalizados para Alexa, Nintendo Switch, celulares y más.',
    primaryColor: '#0ea5e9', // Sky-500
    heroImage: DEFAULT_HERO.imageUrl,
    sections: [
        {
            id: 'hero-main',
            type: 'hero' as const,
            title: DEFAULT_HERO.title,
            subtitle: DEFAULT_HERO.subtitle,
            content: 'Diseños únicos para Alexa, Nintendo Switch y más.'
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <SupportsLandingRenderer 
      config={landing || defaultConfig} 
      categories={displayCategories} 
    />
  );
}
