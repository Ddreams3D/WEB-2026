'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function usePageTransition() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Precargar rutas críticas
    const criticalRoutes = ['/', '/about', '/contact', '/process'];
    criticalRoutes.forEach(route => {
      if (route !== pathname) {
        router.prefetch(route);
      }
    });
  }, [pathname, router]);

  const navigateWithTransition = (href: string) => {
    if (href === pathname) return;
    
    setIsLoading(true);
    setIsTransitioning(true);
    
    router.push(href);
    
    // Limpiar estados después de la transición
    setTimeout(() => {
      setIsLoading(false);
      setIsTransitioning(false);
    }, 150);
  };

  return {
    isLoading,
    isTransitioning,
    navigateWithTransition,
    currentPath: pathname
  };
}

export default usePageTransition;