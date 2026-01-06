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
        const all = await ProductService.getAllProducts();
        
        // Filter by the featured tag if present
        const tag = config.featuredTag?.toLowerCase();
        if (tag) {
            const filtered = all.filter(p => 
              p.tags.some(t => t.toLowerCase().includes(tag))
            );
            setFeaturedProducts(filtered);
        } else {
            // Fallback: Show recent products or empty
            setFeaturedProducts(all.slice(0, 4));
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [config.featuredTag, isPreview]);

  // Determine theme class override
  const themeClass = config.themeMode === 'dark' ? 'dark' : config.themeMode === 'light' ? 'light' : '';

  // Get Primary Color from config or default
  const primaryColor = config.primaryColor || '#e11d48';

  // Extract sections
  const heroSection = config.sections.find(s => s.type === 'hero');
  const featuresSection = config.sections.find(s => s.type === 'features');
  const focusSection = config.sections.find(s => s.type === 'focus');
  const processSection = config.sections.find(s => s.type === 'process');

  return {
    featuredProducts,
    isLoading,
    mounted,
    themeClass,
    primaryColor,
    heroSection,
    featuresSection,
    focusSection,
    processSection
  };
}
