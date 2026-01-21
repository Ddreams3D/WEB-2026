import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MainLogo } from '@/components/ui';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { SUPPORT_CATEGORIES, type SupportCategory, type SupportItem, DEFAULT_HERO } from './data';
import { ServiceLandingsService } from '@/services/service-landings.service';
import { getCachedProducts } from '@/services/data-access.server';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

export const metadata: Metadata = {
  title: 'Soportes Personalizados | Ddreams 3D',
  description: 'Colección exclusiva de soportes personalizados para Alexa, Nintendo Switch, celulares y más.',
  robots: {
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
  const landing = allLandings.find(l => l.slug === 'soportes-personalizados-dispositivos' || l.slug === 'soportes-personalizados');
  
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
    // This ensures that if a product is explicitly categorized as "Nintendo Switch", it goes there
    // even if the description mentions "Amazon" (e.g. "Available on Amazon").
    const explicitId = checkKeywords(catName);
    if (explicitId) {
      const cat = displayCategories.find(c => c.id === explicitId);
      if (cat) { 
        cat.items.push(item); 
        return; // Done!
      }
    }

    // 2. Fallback: Fuzzy Text Search (Description, Tags, Title)
    // Only if explicit category didn't match a known group
    const fuzzyId = checkKeywords(text);
    if (fuzzyId) {
      const cat = displayCategories.find(c => c.id === fuzzyId);
      if (cat) { 
        cat.items.push(item); 
        placed = true; 
      }
    }

    if (placed) return;

    // 2. Dynamic Category Creation based on product.categoryName
    // If the product has a specific category name, try to use it
    if (product.categoryName) {
      const normCatName = product.categoryName.trim();
      const normId = normCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      // MERGE GENERIC CATEGORIES INTO 'OTROS'
      if (['soportes', 'otros-soportes', 'general', 'otros'].includes(normId)) {
        if (othersCategory) {
          othersCategory.items.push(item);
          placed = true;
        }
      } else {
        // Check if it matches an existing category in displayCategories (by Title or ID)
        const existingCat = displayCategories.find(c => 
          c.title.toLowerCase() === normCatName.toLowerCase() || 
          c.id === normId
        );

        if (existingCat) {
          existingCat.items.push(item);
          placed = true;
        } else {
          // Create a new category dynamically
          const newCat: SupportCategory = {
            id: normId,
            title: normCatName,
            description: `Explora nuestra colección de ${normCatName}.`,
            items: [item]
          };
          displayCategories.push(newCat);
          placed = true;
        }
      }
    }

    // 3. Fallback to Others
    if (!placed && othersCategory) {
      othersCategory.items.push(item);
    }
  });

  // Re-append "Otros" at the end if it has items or just to keep structure
  if (othersCategory) {
    displayCategories.push(othersCategory);
  }

  // Use DB data if available, otherwise fallback to local defaults
  // IMPORTANT: Only fallback if landing.heroImage is undefined or null
  const heroImage = landing?.heroImage || DEFAULT_HERO.imageUrl;
  
  // Find hero section explicitly instead of assuming index 0
  const heroSection = landing?.sections?.find(s => s.type === 'hero');
  const heroTitle = heroSection?.title || DEFAULT_HERO.title;
  const heroSubtitle = heroSection?.subtitle || DEFAULT_HERO.subtitle;

  return (
    <div className="relative">
      <section className="relative h-screen w-full overflow-hidden flex flex-col">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Soportes personalizados para tu setup y dispositivos"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90" />
        </div>
        <div className="relative z-10 container mx-auto px-4 max-w-6xl flex-1 flex flex-col">
          <div className="flex justify-between items-center pt-4 md:pt-6">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <MainLogo 
                className="w-32 h-8 md:w-48 md:h-12" 
                variant="white" 
                gradientStart="#818CF8" 
                gradientEnd="#38BDF8" 
              />
            </Link>
            <ThemeToggle />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 pb-10 md:pb-16">
            <span className="inline-flex items-center rounded-full border border-indigo-400/40 bg-indigo-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100 backdrop-blur-sm">
              Soportes a medida para tu setup
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-indigo-200 to-violet-200 tracking-tight drop-shadow-[0_10px_40px_rgba(15,23,42,0.9)] max-w-4xl leading-tight">
              {heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed font-light">
              {heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-fade-in-up">
              <Link
                href="#coleccion"
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-8 font-medium text-white transition-all duration-300 hover:bg-indigo-700 hover:scale-105 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <span className="mr-2">Ver Colección</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-600 bg-slate-950/40 px-8 font-medium text-slate-200 backdrop-blur-sm transition-all hover:bg-slate-800/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Solicitar Diseño
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div id="coleccion" className="relative py-12 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.14),_transparent_55%)] opacity-80" />
        <div className="relative container mx-auto px-4 max-w-6xl">

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {displayCategories.map((category: SupportCategory) => (
            <Link
              key={category.id}
              href={`#${category.id}`}
              className="px-4 py-2 rounded-full border border-slate-200 bg-slate-100 text-xs md:text-sm font-medium text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors dark:border-indigo-500/30 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-indigo-300 dark:hover:bg-slate-900/90"
            >
              {category.title.replace('Soportes para ', '')}
            </Link>
          ))}
        </div>

        <div className="space-y-20">
          {displayCategories.map((category: SupportCategory) => (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              <div className="flex flex-col md:flex-row items-baseline gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {category.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {category.description}
                </p>
              </div>

              {category.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item: SupportItem) => (
                    <div 
                      key={item.id}
                      className="group relative bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
                    >
                      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={item.imageUrl || `/${StoragePathBuilder.ui.placeholders()}/placeholder.svg`}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {item.price ? `S/ ${item.price.toFixed(2)}` : 'Consultar'}
                          </span>
                          {item.slug ? (
                            <Link 
                                href={`/catalogo-impresion-3d/${item.categorySlug || 'general'}/${item.slug}`}
                                className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                                Ver Detalles
                            </Link>
                          ) : (
                            <button className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                                Ver Detalles
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400">
                    Próximamente agregaremos modelos a esta categoría.
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        </div>
      </div>
    </div>
  );
}
