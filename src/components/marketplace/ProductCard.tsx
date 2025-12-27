'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/shared/types';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/ToastManager';
import { ProductImage } from '@/shared/components/ui/DefaultImage';

interface ProductCardProps {
  product: Product;
  className?: string;
  showAddToCart?: boolean;
  onViewDetails?: (product: Product) => void;
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
  const { showToast } = useToast();

  const productUrl = `/marketplace/product/${product.slug || product.id}${source ? `?from=${source}` : ''}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
    showToast('success', 'Producto agregado', `${product.name} agregado al carrito`);
  };

  const primaryImage = product.images.find((img: any) => img.isPrimary) || product.images[0];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className={cn(
      "group relative border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-700 ease-out overflow-hidden transform hover:-translate-y-1 flex flex-col h-full",
      colors.backgrounds.card,
      className
    )}>
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-20 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
          -{discountPercentage}%
        </div>
      )}

      {/* Featured Badge - Only show if not in featured view (optional, but good for "All" view) */}
      {product.isFeatured && source !== 'services' && (
        <div className={`absolute top-3 ${hasDiscount ? 'left-16' : 'left-3'} z-20 bg-amber-400 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1`}>
          <Star className="w-3 h-3 fill-current" />
          <span>Destacado</span>
        </div>
      )}

      <div className="flex-1 flex flex-col relative group">
        {/* Product Image */}
        <div className={cn(
          "relative aspect-[4/3] overflow-hidden",
          colors.backgrounds.neutral
        )}>
          <ProductImage
            src={primaryImage?.url}
            alt={primaryImage?.alt || `Imagen del producto ${product.name}`}
            fill
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-1000 ease-out z-10 relative"
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
          <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1 uppercase tracking-wide">
            {product.categoryName}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3 line-clamp-2 flex-1 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-between mb-3 mt-auto">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {product.rating?.toFixed(1) || '0.0'}
              </span>
            </div>
            
            {/* Download count removed */}
          </div>

          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              {product.customPriceDisplay ? (
                <span className="text-sm font-bold text-neutral-900 dark:text-white whitespace-pre-line">
                  {product.customPriceDisplay}
                </span>
              ) : (
                <>
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">
                    S/ {product.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                    IGV incluido
                  </span>
                </>
              )}
            </div>
            {hasDiscount && !product.customPriceDisplay && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 line-through mb-1">
                S/ {product.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
            Fabricación bajo pedido
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-4 pt-0 space-y-2 mt-auto">
        {onViewDetails ? (
          <Button
            onClick={() => onViewDetails(product)}
            variant="outline"
            className="w-full"
          >
            Ver detalles
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <Link 
              href={productUrl}
            >
              Ver detalles
            </Link>
          </Button>
        )}
        
        {customAction ? (
          <Button
            asChild
            variant="gradient"
            className="w-full group/btn"
          >
            <Link
              href={customAction.href}
              className="flex items-center justify-center space-x-2"
            >
              {customAction.icon}
              <span>{customAction.label}</span>
            </Link>
          </Button>
        ) : showAddToCart && (
          <Button
            onClick={handleAddToCart}
            variant="gradient"
            className="w-full group/btn flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
            <span>Agregar al Carrito</span>
          </Button>
        )}
      </div>
    </div>
  );
}

// Skeleton component for loading states
export function ProductCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden animate-pulse flex flex-col h-full",
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