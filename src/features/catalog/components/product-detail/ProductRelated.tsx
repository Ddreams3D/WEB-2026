import React from 'react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Product, Service } from '@/shared/types/domain';

interface ProductRelatedProps {
  relatedProducts: (Product | Service)[];
}

export function ProductRelated({ relatedProducts }: ProductRelatedProps) {
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div id="related-products" className="mt-20 pt-10 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-8">
        Productos Relacionados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard 
            key={relatedProduct.id} 
            product={relatedProduct} 
          />
        ))}
      </div>
    </div>
  );
}
