import { useState, useEffect } from 'react';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { CatalogItem } from '@/shared/types/catalog';
import { ProductService } from '@/services/product.service';

export function useServiceLanding(config: ServiceLandingConfig, isPreview: boolean = false) {
  const [featuredProducts, setFeaturedProducts] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isPreview) return; // Skip fetching in preview mode
    
    async function loadProducts() {
      setIsLoading(true);
      try {
        if (config.id === 'organic-modeling') {
          setFeaturedProducts([]);
          setIsLoading(false);
          return;
        }

        const all = await ProductService.getAllProducts();
        
        // Filter by the featured tag if present, or fallback to scope:landing-{slug}
        const tag = config.featuredTag?.toLowerCase() || `scope:landing-${config.slug}`.toLowerCase();
        
        if (tag) {
            const filtered = all.filter(p => 
              p.isActive && p.tags.some(t => t.toLowerCase().includes(tag))
            );
            // Only use filtered if we actually found matches or if a specific tag was enforced
            // If it's a fallback tag and no matches, we might want to show empty or recent?
            // User requested "solo deberían mostrar los productos que tengan el scope".
            // So if no matches, show empty.
            setFeaturedProducts(filtered);
        } else {
            // Fallback: Show recent products or empty
            // If no tag strategy exists, show recent 4
            setFeaturedProducts(all.filter(p => p.isActive).slice(0, 4));
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [config.id, config.featuredTag, isPreview]);

  // Determine theme class override
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    // Check system preference initially
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const themeClass = config.themeMode === 'system' 
    ? systemTheme 
    : (config.themeMode === 'dark' ? 'dark' : 'light');

  // Get Primary Color from config or default
  const primaryColor = config.primaryColor || '#e11d48';

  // Extract sections
  const heroSection = config.sections.find(s => s.type === 'hero');
  const featuresSection = config.sections.find(s => s.type === 'features');
  const focusSection = config.sections.find(s => s.type === 'focus');
  const processSection = config.sections.find(s => s.type === 'process');
  const gallerySection = config.sections.find(s => s.type === 'gallery');

  return {
    featuredProducts,
    isLoading,
    mounted,
    themeClass,
    primaryColor,
    heroSection,
    featuresSection,
    focusSection,
    processSection,
    gallerySection
  };
}
