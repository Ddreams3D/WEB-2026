'use client';

import React, { useState } from 'react';
import { PackageOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CatalogItem, isService } from '@/shared/types/catalog';
import { ProductCard, ProductCardSkeleton } from '@/components/catalog/ProductCard';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Product } from '@/shared/types';

interface ProductGridProps {
  products: CatalogItem[];
  className?: string;
  showAddToCart?: boolean;
  emptyMessage?: string;
  customAction?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export function ProductGridSkeleton({ count = 8, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}

export function ProductGrid({
  products,
  className = '',
  showAddToCart = true,
  emptyMessage = 'No se encontraron productos',
  customAction
}: ProductGridProps) {
  
  if (!products || products.length === 0) {
    return (
      <motion.div 
        key="empty"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`flex flex-col items-center justify-center py-16 ${className}`}
      >
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <PackageOpen className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {emptyMessage}
          </h3>
          <p className="text-muted-foreground max-w-md">
            Intenta ajustar tus filtros de búsqueda o explora otras categorías para encontrar lo que buscas.
          </p>
        </div>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      key="grid"
      layout
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      <AnimatePresence mode="popLayout">
        {products.map((item) => (
          <motion.div
            key={item.id}
            layout
            variants={itemAnim}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ProductItem item={item} showAddToCart={showAddToCart} customAction={customAction} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
export function ProductList({
  products,
  className = '',
  showAddToCart = true,
  emptyMessage = 'No se encontraron productos',
  customAction
}: ProductGridProps) {
  
  if (!products || products.length === 0) {
    return (
      <motion.div 
        key="empty"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`flex flex-col items-center justify-center py-16 ${className}`}
      >
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <PackageOpen className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {emptyMessage}
          </h3>
          <p className="text-muted-foreground max-w-md">
            Intenta ajustar tus filtros de búsqueda o explora otras categorías para encontrar lo que buscas.
          </p>
        </div>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      key="list"
      layout
      variants={container}
      initial="hidden"
      animate="show"
      className={`flex flex-col gap-6 ${className}`}
    >
      <AnimatePresence mode="popLayout">
        {products.map((item) => (
          <motion.div
            key={item.id}
            layout
            variants={itemAnim}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ProductItem item={item} showAddToCart={showAddToCart} customAction={customAction} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
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
