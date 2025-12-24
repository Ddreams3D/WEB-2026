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
}

export function ProductCard({ 
  product, 
  className = '', 
  showAddToCart = true, 
  showWishlist = true 
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
    <div className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
          -{discountPercentage}%
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

      <Link href={`/marketplace/product/${product.id}`} className="block">
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
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1 uppercase tracking-wide">
            {product.categoryName}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {product.shortDescription || product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {product.rating?.toFixed(1) || '0.0'}
              </span>
            </div>
            
            {/* Download count removed */}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                S/ {product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  S/ {product.originalPrice!.toFixed(2)}
                </span>
              )}
            </div>
            
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {product.currency}
            </span>
          </div>

          {/* Seller - Removed as per user request */}
          {/*
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Por {product.sellerName}
          </p>
          */}
        </div>
      </Link>

      {/* Add to Cart Button */}
      {showAddToCart && (
        <div className="p-4 pt-0">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 group/btn"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>Agregar al Carrito</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Skeleton component for loading states
export function ProductCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse ${className}`}>
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
      
      {/* Content Skeleton */}
      <div className="p-4">
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
      <div className="p-4 pt-0">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}