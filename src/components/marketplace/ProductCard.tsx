'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Download, Heart, ImageIcon } from '@/lib/icons';
import { Product } from '../../shared/types';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../ui/ToastManager';
import { ProductImage } from '../../shared/components/ui/DefaultImage';

interface ProductCardProps {
  product: Product;
  className?: string;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ 
  product, 
  className = '', 
  showAddToCart = true, 
  showWishlist = true,
  onViewDetails
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
    showToast('success', 'Producto agregado', `${product.name} agregado al carrito`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // TODO: Implement wishlist functionality
    showToast('info', 'Wishlist', 'Funcionalidad de wishlist próximamente');
  };

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700/50 hover:border-primary-100 dark:hover:border-primary-900/50 flex flex-col h-full ${className}`}>
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
          -{discountPercentage}%
        </div>
      )}

      {/* Featured Badge - Only show if not in featured view (optional, but good for "All" view) */}
      {product.isFeatured && (
        <div className={`absolute top-3 ${hasDiscount ? 'left-16' : 'left-3'} z-10 bg-amber-400 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1`}>
          <Star className="w-3 h-3 fill-current" />
          <span>Destacado</span>
        </div>
      )}

      {/* Wishlist Button */}
      {showWishlist && (
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-gray-700"
          aria-label="Agregar a wishlist"
        >
          <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-500" />
        </button>
      )}

      <Link href={`/marketplace/product/${product.id}`} className="flex-1 flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
          <ProductImage
            src={primaryImage?.url}
            alt={primaryImage?.alt || `Imagen del producto ${product.name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category */}
          <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1 uppercase tracking-wide">
            {product.categoryName}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-1">
            {product.shortDescription || product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-between mb-3 mt-auto">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {product.rating?.toFixed(1) || '0.0'}
              </span>
            </div>
            
            {/* Download count removed */}
          </div>

          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              {product.customPriceDisplay ? (
                <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-pre-line">
                  {product.customPriceDisplay}
                </span>
              ) : (
                <>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    S/ {product.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    IGV incluido
                  </span>
                </>
              )}
            </div>
            {hasDiscount && !product.customPriceDisplay && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through mb-1">
                S/ {product.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
            Fabricación bajo pedido
          </div>
        </div>
      </Link>

      {/* Buttons */}
      <div className="p-4 pt-0 space-y-2">
        {onViewDetails ? (
          <button
            onClick={() => onViewDetails(product)}
            className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm"
          >
            Ver detalles
          </button>
        ) : (
          <Link 
            href={`/marketplace/product/${product.id}`}
            className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm"
          >
            Ver detalles
          </Link>
        )}
        
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 group/btn text-sm"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>Agregar al Carrito</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Skeleton component for loading states
export function ProductCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse flex flex-col h-full ${className}`}>
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
      
      {/* Content Skeleton */}
      <div className="p-4 flex-1">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-20" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8" />
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8" />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
        </div>
        
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
      </div>
      
      {/* Button Skeleton */}
      <div className="p-4 pt-0 mt-auto">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}