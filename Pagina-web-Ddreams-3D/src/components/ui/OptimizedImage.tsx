'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';
import { useLazyLoading, useNetworkStatus } from '@/hooks/usePerformanceOptimization';
import { ImageIcon } from '@/lib/icons';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

// Componente de placeholder mientras carga la imagen
const ImagePlaceholder = ({ 
  width, 
  height, 
  className 
}: { 
  width?: number; 
  height?: number; 
  className?: string; 
}) => (
  <div 
    className={`bg-gray-200 animate-pulse flex items-center justify-center ${className || ''}`}
    style={{ width, height }}
  >
    <ImageIcon className="w-8 h-8 text-gray-400" />
  </div>
);

// Función para generar URLs optimizadas
function generateOptimizedSrc(src: string, width?: number, quality = 85) {
  // Si es una URL externa, devolverla tal como está
  if (src.startsWith('http')) {
    return src;
  }
  
  // Para imágenes locales, podríamos implementar optimización aquí
  // Por ahora, devolvemos la URL original
  return src;
}

// Función para detectar soporte de formatos modernos
function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch {
    return false;
  }
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    className,
    priority = false,
    quality = 85,
    placeholder = 'empty',
    blurDataURL,
    sizes,
    onLoad,
    onError,
    style,
    ...props
  }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState<string>('');
    const imgRef = useRef<HTMLImageElement>(null);
    const { elementRef, isVisible } = useLazyLoading({
      threshold: 0.1,
      rootMargin: '50px'
    });
    const { isSlowConnection } = useNetworkStatus();

    // Determinar si debe cargar la imagen
    const shouldLoad = priority || isVisible;

    useEffect(() => {
      if (!shouldLoad || hasError) return;

      // Generar la mejor URL basada en el soporte del navegador y conexión
      let optimizedSrc = generateOptimizedSrc(src, width, quality);
      
      // Ajustar calidad para conexiones lentas
      if (isSlowConnection) {
        optimizedSrc = generateOptimizedSrc(src, width, Math.max(quality - 25, 50));
      }

      setCurrentSrc(optimizedSrc);
    }, [shouldLoad, src, width, quality, isSlowConnection, hasError]);

    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    // Si no debe cargar aún, mostrar placeholder
    if (!shouldLoad) {
      return (
        <div ref={elementRef as React.RefObject<HTMLDivElement>}>
          <ImagePlaceholder 
            width={width} 
            height={height} 
            className={className} 
          />
        </div>
      );
    }

    // Si hay error, mostrar placeholder de error
    if (hasError) {
      return (
        <div 
          className={`bg-gray-100 flex items-center justify-center ${className || ''}`}
          style={{ width, height, ...style }}
        >
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">Error al cargar imagen</span>
        </div>
      );
    }

    return (
      <div ref={elementRef as React.RefObject<HTMLDivElement>} className="relative">
        {/* Placeholder mientras carga */}
        {!isLoaded && placeholder !== 'empty' && (
          <div className="absolute inset-0">
            {placeholder === 'blur' && blurDataURL ? (
              <img
                src={blurDataURL}
                alt=""
                className={`${className || ''} filter blur-sm`}
                style={{ width, height, ...style }}
              />
            ) : (
              <ImagePlaceholder 
                width={width} 
                height={height} 
                className={className} 
              />
            )}
          </div>
        )}
        
        {/* Imagen principal */}
        <img
          ref={(node) => {
            imgRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className || ''} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={style}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;