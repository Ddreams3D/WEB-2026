'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn, formatImagePosition } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, FileText } from 'lucide-react';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/ToastManager';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { ScrollManager } from '@/hooks/useScrollRestoration';
import { usePathname } from 'next/navigation';

interface ProductCardProps {
  product: Product | Service;
  className?: string;
  showAddToCart?: boolean;
  onViewDetails?: (product: Product | Service) => void;
  customAction?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  source?: string;
}

export function ProductCard({ 
  product, 
  className = '', 
  showAddToCart = true, 
  onViewDetails,
  customAction,
  source
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const pathname = usePathname();

  const handleScrollSave = () => {
    if (typeof window !== 'undefined') {
      ScrollManager.save(pathname, window.scrollY);
    }
  };

  const isService = product.kind === 'service';
  
  const productUrl = isService 
    ? `/services/${product.slug || product.id}${source ? `?from=${source}` : ''}`
    : `/marketplace/${product.categoryId || 'general'}/${product.slug || product.id || ''}${source ? `?from=${source}` : ''}`;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.kind !== 'product') return;

    try {
      await addToCart(product as Product, 1);
      showSuccess('Producto agregado', `${product.name} agregado al carrito`);
    } catch (error) {
      showError('Error', 'No se pudo agregar al carrito');
    }
  };

  const images = product.images || [];
  const primaryImage = images.find((img) => img.isPrimary) || images[0];
  const hasDiscount = product.kind === 'product' && product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount && product.kind === 'product' && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  const imagePosition = primaryImage?.imagePosition || 'object-center';

  const CardContent = () => (
    <>
      {/* Product Image */}
      <div className={cn(
        "relative aspect-[4/3] overflow-hidden",
        colors.backgrounds.neutral
      )}>
        <ProductImage
          src={primaryImage?.url}
          alt={primaryImage?.alt || `Imagen del producto ${product.name}`}
          fill
          className={cn(
            "w-full h-full group-hover:scale-105 transition-transform duration-1000 ease-out z-10 relative",
            imagePosition
          )}
          style={{ 
            objectFit: 'cover', 
            objectPosition: formatImagePosition(imagePosition)
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Soft Overlay on Hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-0",
          colors.gradients.overlaySubtle
        )} />
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 uppercase tracking-wide">
            {product.categoryName}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors duration-300 text-lg leading-tight">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-2 flex-1 leading-relaxed">
          {product.shortDescription || product.description}
        </p>

        {/* Rating & Feature Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md border border-amber-100 dark:border-amber-800/30">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current mr-1" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              {product.rating?.toFixed(1) || '5.0'}
            </span>
          </div>
          
          <div className="flex items-center px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 shadow-[0_0_4px_rgba(34,197,94,0.6)] animate-pulse"></span>
             <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
               Bajo Pedido
             </span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="flex flex-col">
            {product.customPriceDisplay ? (
              <span className="text-base font-bold text-neutral-700 dark:text-neutral-200 whitespace-pre-line">
                {product.customPriceDisplay}
              </span>
            ) : (
              <>
                <span className="text-lg font-bold text-neutral-700 dark:text-neutral-200 tracking-tight">
                  S/ {product.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider opacity-80">
                  Precio final
                </span>
              </>
            )}
          </div>
          {hasDiscount && !product.customPriceDisplay && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                -{discountPercentage}%
              </span>
              <span className="text-sm text-neutral-400 line-through font-medium mt-0.5">
                S/ {product.originalPrice!.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={cn(
      "group relative border border-gray-100 dark:border-white/10 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out overflow-hidden flex flex-col h-full",
      colors.backgrounds.card,
      className
    )}>
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-20 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md pointer-events-none">
          -{discountPercentage}%
        </div>
      )}

      {onViewDetails ? (
        <button 
          onClick={() => onViewDetails(product)}
          className="flex-1 flex flex-col relative cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-t-xl"
          type="button"
          aria-label={`Ver detalles de ${product.name}`}
        >
          <CardContent />
        </button>
      ) : (
        <Link 
          href={productUrl}
          className="flex-1 flex flex-col relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-t-xl"
          onClick={handleScrollSave}
          aria-label={`Ir a detalles de ${product.name}`}
        >
          <CardContent />
        </Link>
      )}

      {/* Price & Action Container - Separated to avoid nesting interactive elements if card was a button */}
      <div className="p-4 pt-0 mt-auto">
        <div className="pt-2">
          {customAction ? (
            <Button
              asChild
              variant="gradient"
              className="w-full"
            >
              <Link 
                href={customAction.href} 
                className="flex items-center justify-center space-x-2" 
                aria-label={customAction.label}
                onClick={handleScrollSave}
              >
                {customAction.icon}
                <span>{customAction.label}</span>
              </Link>
            </Button>
          ) : (isService || product.price === 0) ? (
            <Button
              asChild
              variant="outline"
              className="w-full group/btn border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Link
                href="/contact"
                className="flex items-center justify-center space-x-2"
                aria-label="Solicitar cotización"
                onClick={handleScrollSave}
              >
                <FileText className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" aria-hidden="true" />
                <span>Cotizar</span>
              </Link>
            </Button>
          ) : showAddToCart && (
            <Button
              onClick={handleAddToCart}
              variant="gradient"
              className="w-full group/btn flex items-center justify-center space-x-2"
              aria-label={`Agregar ${product.name} al carrito`}
            >
              <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" aria-hidden="true" />
              <span>Agregar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton component for loading states
export function ProductCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn(
      "rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden animate-pulse flex flex-col h-full",
      colors.backgrounds.card,
      className
    )}>
      {/* Image Skeleton */}
      <div className={cn("aspect-[4/3]", colors.backgrounds.neutral)} />
      
      {/* Content Skeleton */}
      <div className="p-4 flex-1">
        <div className={cn("h-3 rounded mb-2 w-20", colors.backgrounds.neutral)} />
        <div className={cn("h-5 rounded mb-2", colors.backgrounds.neutral)} />
        <div className={cn("h-4 rounded mb-3 w-3/4", colors.backgrounds.neutral)} />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <div className={cn("h-4 w-4 rounded", colors.backgrounds.neutral)} />
            <div className={cn("h-4 rounded w-8", colors.backgrounds.neutral)} />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col space-y-1">
            <div className={cn("h-6 rounded w-24", colors.backgrounds.neutral)} />
            <div className={cn("h-3 rounded w-16", colors.backgrounds.neutral)} />
          </div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="p-4 pt-0 mt-auto">
        <div className={cn("h-10 rounded-lg w-full", colors.backgrounds.neutral)} />
      </div>
    </div>
  );
}