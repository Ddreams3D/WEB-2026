'use client';

import { useCallback, useRef, useEffect, useState } from 'react';

// Hook para debounce optimizado
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para throttle optimizado
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());
  
  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

// Hook para memoización profunda
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ deps: React.DependencyList; value: T } | undefined>(undefined);
  
  if (!ref.current || !areEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      value: factory()
    };
  }
  
  return ref.current.value;
}

// Función auxiliar para comparación profunda
function areEqual(a: React.DependencyList, b: React.DependencyList): boolean {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  
  return true;
}

// Hook para lazy loading con intersection observer
export function useLazyLoading(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasLoaded, options]);

  return { elementRef, isVisible, hasLoaded };
}

// Hook para optimización de scroll
export function useScrollOptimization() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleScroll = useThrottle(() => {
    setScrollY(window.scrollY);
    setIsScrolling(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, 16); // ~60fps

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleScroll]);

  return { scrollY, isScrolling };
}

// Hook para detectar conexión lenta
export function useNetworkStatus() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as { connection?: { effectiveType?: string; addEventListener?: (event: string, handler: () => void) => void; removeEventListener?: (event: string, handler: () => void) => void } }).connection;
      
      const updateConnectionInfo = () => {
        if (connection) {
          const effectiveType = connection.effectiveType || 'unknown';
          setConnectionType(effectiveType);
          setIsSlowConnection(
            effectiveType === 'slow-2g' || effectiveType === '2g'
          );
        }
      };

      updateConnectionInfo();
      if (connection && connection.addEventListener) {
        connection.addEventListener('change', updateConnectionInfo);
      }

      return () => {
        if (connection && connection.removeEventListener) {
          connection.removeEventListener('change', updateConnectionInfo);
        }
      };
    }
  }, []);

  return { isSlowConnection, connectionType };
}

// Hook para preload de recursos
export function useResourcePreload() {
  const preloadedResources = useRef(new Set<string>());

  const preloadImage = useCallback((src: string) => {
    if (preloadedResources.current.has(src)) return;
    
    const img = new Image();
    img.src = src;
    preloadedResources.current.add(src);
  }, []);

  const preloadFont = useCallback((href: string, type = 'font/woff2') => {
    if (preloadedResources.current.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'font';
    link.type = type;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    preloadedResources.current.add(href);
  }, []);

  const preloadScript = useCallback((src: string) => {
    if (preloadedResources.current.has(src)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'script';
    document.head.appendChild(link);
    preloadedResources.current.add(src);
  }, []);

  return { preloadImage, preloadFont, preloadScript };
}

// Hook para optimización de renders
export function useRenderOptimization<T>(value: T, isEqual?: (a: T, b: T) => boolean) {
  const ref = useRef<T>(value);
  
  const areValuesEqual = isEqual || ((a: T, b: T) => a === b);
  
  if (!areValuesEqual(ref.current, value)) {
    ref.current = value;
  }
  
  return ref.current;
}

// Hook para batch de actualizaciones de estado
export function useBatchedUpdates() {
  const [, forceUpdate] = useState({});
  const updatesRef = useRef<(() => void)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const batchUpdate = useCallback((updateFn: () => void) => {
    updatesRef.current.push(updateFn);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const updates = updatesRef.current;
      updatesRef.current = [];
      
      updates.forEach(update => update());
      forceUpdate({});
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return batchUpdate;
}