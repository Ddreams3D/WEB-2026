'use client';

import { Suspense, lazy, ComponentType, ReactNode } from 'react';
import Image from 'next/image';
import { Loader2 } from '@/lib/icons';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

// Componente de carga por defecto
const DefaultLoader = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center p-8 ${className || ''}`}>
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-sm text-muted-foreground">Cargando...</span>
  </div>
);

// Wrapper para componentes lazy
export function LazyWrapper({ children, fallback, className }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <DefaultLoader className={className} />}>
      {children}
    </Suspense>
  );
}

// HOC para crear componentes lazy con configuración optimizada
export function withLazyLoading<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return function WrappedComponent(props: T) {
    return (
      <LazyWrapper fallback={fallback}>
        <LazyComponent {...props} />
      </LazyWrapper>
    );
  };
}

// Función para precargar componentes lazy
export function preloadComponent<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>
) {
  // Precargar el componente en el siguiente tick
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      importFn().catch(() => {
        // Silenciar errores de precarga
      });
    }, 0);
  }
}

// Hook para lazy loading con intersection observer
export function useLazyLoad(threshold = 0.1, rootMargin = '50px') {
  return {
    threshold,
    rootMargin,
    triggerOnce: true,
  };
}

// Componente para lazy loading de imágenes
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcmdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg=='
}: LazyImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width || 200}
      height={height || 200}
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = placeholder;
      }}
    />
  );
}

export default LazyWrapper;