import React from 'react';
import { Product, Service } from '@/shared/types/domain';

interface ProductSpecificationsProps {
  product: Product | Service;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  if (!product.specifications || product.specifications.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {product.specifications.map((spec, idx) => (
        <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-800 col-span-1 md:col-span-2 hover:border-primary/20 transition-colors">
          <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-bold">{spec.name}</p>
          <div className="font-medium text-gray-900 dark:text-white whitespace-pre-line leading-relaxed text-base">
            {spec.value}
          </div>
        </div>
      ))}
    </div>
  );
}
