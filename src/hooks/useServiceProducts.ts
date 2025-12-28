import { useState, useEffect } from 'react';
import { Product } from '@/shared/types';
import { ProductService } from '@/services/product.service';

interface ServiceProductsOptions {
  ids?: string[];
  tag?: string;
}

export function useServiceProducts(options: string[] | ServiceProductsOptions) {
  const [services, setServices] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Normalize options
  const ids = Array.isArray(options) ? options : options.ids;
  const tag = !Array.isArray(options) ? options.tag : undefined;

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        setIsLoading(true);
        const allProducts = await ProductService.getAllProducts();
        
        if (!isMounted) return;

        if (!allProducts) {
          setServices([]);
          return;
        }

        const filteredServices = allProducts
          .filter(product => {
            if (ids && ids.length > 0) {
              return ids.includes(product.id);
            }
            if (tag) {
              return product.tags.includes(tag);
            }
            return false;
          })
          .sort((a, b) => {
            if (ids && ids.length > 0) {
              return ids.indexOf(a.id) - ids.indexOf(b.id);
            }
            // Sort by displayOrder if available
            if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
              return a.displayOrder - b.displayOrder;
            }
            // Fallback: maintain original order or sort by date?
            return 0;
          });
          
        setServices(filteredServices);
      } catch (err) {
        if (isMounted) {
          console.error('Error loading services:', err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(ids), tag]); 

  return { services, isLoading, error };
}
