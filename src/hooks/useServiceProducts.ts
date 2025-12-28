import { useState, useEffect } from 'react';
import { Product } from '@/shared/types';
import { ProductService } from '@/services/product.service';

export function useServiceProducts(serviceIds: string[]) {
  const [services, setServices] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
          .filter(product => serviceIds.includes(product.id))
          .sort((a, b) => {
            return serviceIds.indexOf(a.id) - serviceIds.indexOf(b.id);
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
  }, [JSON.stringify(serviceIds)]); // Use JSON.stringify to avoid infinite loop with array dependency

  return { services, isLoading, error };
}
