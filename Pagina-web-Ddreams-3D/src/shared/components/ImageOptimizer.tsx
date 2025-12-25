'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useIntersectionAnimation, getAnimationClasses } from '../hooks/useIntersectionAnimation';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
}

const ImageOptimizer = React.memo(({
  src,
  alt,
  className = '',
  width = 800,
  height = 600,
  priority = false,
  fill = false
}: ImageOptimizerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { ref, isVisible } = useIntersectionAnimation();

  if (fill) {
    return (
      <div ref={ref} className={`relative overflow-hidden ${className} ${getAnimationClasses(isVisible)}`}>
        {!isLoaded && !error && (
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        )}
        
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } object-cover`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
        />
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <span className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
              Error al cargar la imagen
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className} ${getAnimationClasses(isVisible)}`}>
      {!isLoaded && !error && (
        <div 
          className="bg-neutral-200 dark:bg-neutral-700 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        } ${!isLoaded ? 'absolute' : ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
      />
      
      {error && (
        <div 
          className={`flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 ${getAnimationClasses(true)}`}
          style={{ width, height }}
        >
          <span className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
            Error al cargar la imagen
          </span>
        </div>
      )}
    </div>
  );
});

ImageOptimizer.displayName = 'ImageOptimizer';

export default ImageOptimizer;