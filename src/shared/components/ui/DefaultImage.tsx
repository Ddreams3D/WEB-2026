'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from '@/lib/icons';
import { colors } from '@/shared/styles/colors';

interface DefaultImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  showPlaceholder?: boolean;
  placeholderText?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  onError?: () => void;
  style?: React.CSSProperties;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=400';

export default function DefaultImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
  showPlaceholder = true,
  placeholderText = 'Sin imagen',
  fill = false,
  sizes,
  priority = false,
  quality = 75,
  onError,
  style
}: DefaultImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Si no hay src y no se debe mostrar placeholder, mostrar placeholder
  if (!src && !showPlaceholder) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${className}`}>
        <div className="text-center text-gray-400 dark:text-gray-500">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">{placeholderText}</p>
        </div>
      </div>
    );
  }

  // Si hay error y no hay fallback, mostrar placeholder
  if (hasError && !fallbackSrc) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${className}`}>
        <div className="text-center text-gray-400 dark:text-gray-500">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">{placeholderText}</p>
        </div>
      </div>
    );
  }

  const imageProps = {
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    onError: handleError,
    onLoad: handleLoad,
    priority,
    quality,
    style,
    ...(fill ? { fill: true, sizes } : { width, height })
  };

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className={`absolute inset-0 animate-pulse ${colors.gradients.skeleton} ${className}`} />
      )}
      
      <Image
        src={hasError ? fallbackSrc : (src || fallbackSrc)}
        {...imageProps}
        alt={alt}
      />
    </div>
  );
}


// Componente específico para productos
export function ProductImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<DefaultImageProps, 'fallbackSrc' | 'placeholderText'>) {
  return (
    <DefaultImage
      src={src}
      alt={alt}
      className={className}
      fallbackSrc="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=400"
      placeholderText="Producto sin imagen"
      {...props}
    />
  );
}

// Componente específico para avatares de usuario
export function UserAvatar({
  src,
  alt,
  className = '',
  ...props
}: Omit<DefaultImageProps, 'fallbackSrc' | 'placeholderText'>) {
  return (
    <DefaultImage
      src={src}
      alt={alt}
      className={`rounded-full ${className}`}
      fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
      placeholderText="Usuario"
      {...props}
    />
  );
}

// Componente específico para logos de empresa
export function CompanyLogo({
  src,
  alt,
  className = '',
  ...props
}: Omit<DefaultImageProps, 'fallbackSrc' | 'placeholderText'>) {
  return (
    <DefaultImage
      src={src}
      alt={alt}
      className={className}
      fallbackSrc="/logo-ddreams-3d.jpg"
      placeholderText="Logo"
      {...props}
    />
  );
}