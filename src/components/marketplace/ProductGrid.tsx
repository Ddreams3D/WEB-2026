'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '../../shared/types';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { ProductDetailsModal } from './ProductDetailsModal';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  className?: string;
  showAddToCart?: boolean;
  emptyMessage?: string;
  skeletonCount?: number;
  customAction?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export function ProductGrid({
  products,
  isLoading = false,
  className = '',
  showAddToCart = true,
  emptyMessage = 'No se encontraron productos',
  skeletonCount = 8,
  customAction
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Loading state
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Intenta ajustar tus filtros de búsqueda o explora otras categorías para encontrar lo que buscas.
          </p>
        </div>
      </div>
    );
  }

  // Products grid
  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showAddToCart={showAddToCart}
            // onViewDetails removed to enforce navigation to product page
            customAction={customAction}
          />
        ))}
      </div>

      {/* Modal removed/disabled as per user request to always navigate to product page */}
      {/* <ProductDetailsModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      /> */}
    </>
  );
}

// Compact version for smaller spaces
interface CompactProductGridProps {
  products: Product[];
  maxItems?: number;
  isLoading?: boolean;
  className?: string;
}

export function CompactProductGrid({
  products,
  maxItems = 4,
  isLoading = false,
  className = ''
}: CompactProductGridProps) {
  const displayProducts = products.slice(0, maxItems);

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {Array.from({ length: maxItems }).map((_, index) => (
          <ProductCardSkeleton key={`compact-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!displayProducts || displayProducts.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">
          No hay productos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {displayProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showAddToCart={true}
        />
      ))}
    </div>
  );
}

// List version for different layouts
interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  className?: string;
  showAddToCart?: boolean;
}

export function ProductList({
  products,
  isLoading = false,
  className = '',
  showAddToCart = true
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`list-skeleton-${index}`} className="flex space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">
          No se encontraron productos
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {products.map((product) => (
        <div key={product.id} className="flex space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="relative w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
            {product.images[0] && (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">
              {product.categoryName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
              {product.shortDescription || product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                S/ {product.price.toFixed(2)}
              </span>
              {showAddToCart && (
                <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Agregar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}