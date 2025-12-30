'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn, formatImagePosition } from '@/lib/utils';
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
  
  const categorySegment = product.categoryId || 'general';
  const slugSegment = product.slug || product.id;

  const productUrl = isService 
    ? `/services/${slugSegment}${source ? `?from=${source}` : ''}`
    : `/catalogo-impresion-3d/${categorySegment}/${slugSegment}${source ? `?from=${source}` : ''}`;

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

  const imageStyle = React.useMemo(() => ({ 
    objectFit: 'cover' as const, 
    objectPosition: formatImagePosition(imagePosition)
  }), [imagePosition]);

  const renderContent = () => (
    <>
      {/* Product Image */}
      <div className={cn(
        "relative aspect-[4/3] overflow-hidden",
        "bg-muted/50"
      )}>
        <ProductImage
          src={primaryImage?.url}
          alt={primaryImage?.alt || `Imagen del producto ${product.name}`}
          fill
          className={cn(
            "w-full h-full group-hover:scale-105 transition-transform duration-1000 ease-out z-10 relative",
            imagePosition
          )}
          style={imageStyle}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Soft Overlay on Hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-0",
          "bg-gradient-to-t from-black/10 via-transparent to-transparent"
        )} />
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary uppercase tracking-wide">
            {product.categoryName}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 text-lg leading-tight">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1 leading-relaxed">
          {product.shortDescription || product.description}
        </p>

        {/* Rating & Feature Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center bg-warning-50 dark:bg-warning-900/20 px-2 py-1 rounded-md border border-warning-100 dark:border-warning-800/30">
            <Star className="w-3.5 h-3.5 text-warning-500 fill-current mr-1" />
            <span className="text-xs font-bold text-warning-700 dark:text-warning-400">
              {product.rating?.toFixed(1) || '5.0'}
            </span>
          </div>
          
          <div className="flex items-center px-2 py-1 rounded-md bg-muted border border-border">
             <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5 shadow-[0_0_4px_rgba(16,185,129,0.6)] animate-pulse">
             </span>
             <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
               Bajo Pedido
             </span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2 border-t border-border">
          <div className="flex flex-col">
            {product.customPriceDisplay ? (
              <span className="text-base font-bold text-foreground whitespace-pre-line">
                {product.customPriceDisplay}
              </span>
            ) : (
              <>
                <span className="text-lg font-bold text-foreground tracking-tight">
                  S/ {(product.price || 0).toFixed(2)}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider opacity-80">
                  Precio final
                </span>
              </>
            )}
          </div>
          {hasDiscount && !product.customPriceDisplay && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-destructive font-bold bg-destructive/10 px-1.5 py-0.5 rounded">
                -{discountPercentage}%
              </span>
              <span className="text-sm text-muted-foreground line-through font-medium mt-0.5">
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
      "group relative border border-border rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out overflow-hidden flex flex-col h-full",
      "bg-card text-card-foreground",
      className
    )}>
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-20 bg-destructive text-destructive-foreground px-2.5 py-1 rounded-full text-xs font-bold shadow-md pointer-events-none">
          -{discountPercentage}%
        </div>
      )}

      {onViewDetails ? (
        <button 
          onClick={() => onViewDetails(product)}
          className="flex-1 flex flex-col relative cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-primary rounded-t-xl active:scale-[0.98] transition-transform duration-100"
          type="button"
          aria-label={`Ver detalles de ${product.name}`}
        >
          {renderContent()}
        </button>
      ) : (
        <Link 
          href={productUrl}
          className="flex-1 flex flex-col relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-t-xl active:scale-[0.98] transition-transform duration-100"
          onClick={handleScrollSave}
          aria-label={`Ir a detalles de ${product.name}`}
        >
          {renderContent()}
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
              className="w-full group/btn border-border hover:bg-muted"
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
      "rounded-xl shadow-sm border border-border overflow-hidden animate-pulse flex flex-col h-full",
      "bg-card",
      className
    )}>
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-muted" />
      
      {/* Content Skeleton */}
      <div className="p-4 flex-1">
        <div className="h-3 rounded mb-2 w-20 bg-muted" />
        <div className="h-5 rounded mb-2 bg-muted" />
        <div className="h-4 rounded mb-3 w-3/4 bg-muted" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="h-4 rounded w-8 bg-muted" />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col space-y-1">
            <div className="h-6 rounded w-24 bg-muted" />
            <div className="h-3 rounded w-16 bg-muted" />
          </div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="p-4 pt-0 mt-auto">
        <div className="h-10 rounded-lg w-full bg-muted" />
      </div>
    </div>
  );
}