'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Grid } from 'lucide-react';
import { Product } from '@/shared/types';
import { CatalogItem, Service, StoreProduct, isService } from '@/shared/types/catalog';
import { ProductCard, ProductCardSkeleton } from '@/components/marketplace/ProductCard';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Button } from '@/components/ui/button';

interface ProductGridProps {
  products: CatalogItem[];
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
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);

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
        {products.map((item) => (
          <ProductItem key={item.id} item={item} showAddToCart={showAddToCart} customAction={customAction} />
        ))}
      </div>
    </>
  );
}

export function ProductList({
  products,
  isLoading = false,
  className = '',
  showAddToCart = true,
  emptyMessage = 'No se encontraron productos',
  skeletonCount = 8,
  customAction
}: ProductGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className={`flex flex-col gap-6 ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} className="w-full" />
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

  // Products list
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {products.map((item) => (
        <ProductItem key={item.id} item={item} showAddToCart={showAddToCart} customAction={customAction} />
      ))}
    </div>
  );
}

function ProductItem({ 
  item, 
  showAddToCart, 
  customAction 
}: { 
  item: CatalogItem, 
  showAddToCart: boolean, 
  customAction?: ProductGridProps['customAction'] 
}) {
  // Discriminated Union Check
  if (isService(item)) {
     // It's a Service
     return (
       <ServiceCard
         service={item}
         customAction={customAction}
       />
     );
  } else {
     // It's a StoreProduct (compatible with Product)
     return (
       <ProductCard
         product={item as unknown as Product} // Casting to legacy Product type for compatibility
         showAddToCart={showAddToCart}
         customAction={customAction}
       />
     );
  }
}
