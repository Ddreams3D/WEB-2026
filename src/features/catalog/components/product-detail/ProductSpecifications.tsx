import React from 'react';
import { Product, Service } from '@/shared/types/domain';

interface ProductSpecificationsProps {
  product: Product | Service;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const isProduct = product.kind === 'product';
  const hasSpecs = product.specifications && product.specifications.length > 0;
  const materials = isProduct ? (product.materials || []) : [];
  const hasMaterials = isProduct && materials.length > 0;

  if (!hasSpecs && !hasMaterials) {
    return null;
  }

  return (
    <div className="space-y-6">
      {hasMaterials && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-colors">
          <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Materiales Disponibles
          </p>
          <div className="flex flex-wrap gap-2">
            {materials.map((material: string, idx: number) => (
              <span 
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full bg-background border border-border text-sm font-medium text-foreground shadow-sm"
              >
                {material}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasSpecs && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.specifications?.map((spec, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-800 col-span-1 md:col-span-2 hover:border-primary/20 transition-colors">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-bold">{spec.name}</p>
              <div className="font-medium text-gray-900 dark:text-white whitespace-pre-line leading-relaxed text-base">
                {spec.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
