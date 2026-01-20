import { useState, useEffect, useRef } from 'react';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { THEME_CONFIG } from '@/config/themes';
import { ProductService } from '@/services/product.service';
import { CatalogItem } from '@/shared/types/catalog';

export function useSeasonalLanding(config: SeasonalThemeConfig) {
  const [featuredProducts, setFeaturedProducts] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [textEffectTriggered, setTextEffectTriggered] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Get theme colors from existing config
  const themeStyles = THEME_CONFIG[config.themeId] || THEME_CONFIG.standard;

  // Specific check for Valentine's to enable special features
  const isValentines = config.id === 'san-valentin' || config.id === 'valentines';
  const isMothersDay = config.id === 'dia-de-la-madre' || config.id === 'mothers-day';
  const isHalloween = config.id === 'halloween';
  const isChristmas = config.id === 'christmas' || config.id === 'navidad';
  
  // Define logo color based on theme
  const logoColor = isHalloween ? '#f97316' : 
                    isValentines ? '#ef4444' : 
                    isMothersDay ? '#f472b6' : 
                    isChristmas ? '#f59e0b' :
                    '#e11d48';

  const handleExorcise = () => {
    if (hasTriggeredRef.current) return;
    
    hasTriggeredRef.current = true;
    setTextEffectTriggered(true);
    
    setTimeout(() => {
        setTextEffectTriggered(false);
    }, 500);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set deadline based on theme
  const getDeadline = () => {
    const now = new Date();
    let year = now.getFullYear();
    
    if (isValentines) {
      const deadline = new Date(year, 1, 14); // Feb 14
      if (now > deadline) deadline.setFullYear(year + 1);
      return deadline;
    }
    
    if (isMothersDay) {
      // Mother's Day: 2nd Sunday of May
      const getMothersDay = (y: number) => {
        const d = new Date(y, 4, 1);
        while (d.getDay() !== 0) {
          d.setDate(d.getDate() + 1);
        }
        d.setDate(d.getDate() + 7);
        d.setHours(23, 59, 59, 999);
        return d;
      };

      let deadline = getMothersDay(year);
      if (now > deadline) {
        deadline = getMothersDay(year + 1);
      }
      return deadline;
    }

    if (isHalloween) {
      const deadline = new Date(year, 9, 1); // Oct 1st
      if (now > deadline) deadline.setFullYear(year + 1);
      return deadline;
    }

    if (config.dateRanges && config.dateRanges.length > 0) {
      const range = config.dateRanges[0];
      const deadline = new Date(year, range.end.month - 1, range.end.day);
      if (now > deadline) deadline.setFullYear(year + 1);
      return deadline;
    }
    
    return new Date(year, 11, 31);
  };

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const all = await ProductService.getAllProducts();
        
        const tag = config.landing.featuredTag?.toLowerCase() || `scope:landing-${config.id}`.toLowerCase();
        
        if (!tag) {
             setFeaturedProducts([]);
             return;
        }

        const filtered = all.filter(p => {
            if (!p.isActive) return false;
            const pTags = (p.tags || []).map(t => t.toLowerCase());
            // Strict exclusion of hidden products
            if (pTags.includes('scope:hidden') || pTags.includes('oculto')) return false;

            return pTags.includes(tag);
        });

        setFeaturedProducts(filtered);
      } catch (error) {
        console.error('Error loading seasonal products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [config.landing.featuredTag]);

  return {
    featuredProducts,
    isLoading,
    mounted,
    textEffectTriggered,
    themeStyles,
    isValentines,
    isMothersDay,
    isHalloween,
    isChristmas,
    logoColor,
    handleExorcise,
    getDeadline
  };
}
