import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Product, Service } from '@/shared/types/domain';

interface ProductTagsProps {
  product: Product | Service;
}

export function ProductTags({ product }: ProductTagsProps) {
  // Logic from original file: hide for specific IDs
  if (product.id === '7' || product.id === '8' || !product.tags || product.tags.length === 0) {
    return null;
  }

  return (
    <div className="pt-8 mt-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Etiquetas Relacionadas</h3>
      <div className="flex flex-wrap gap-2.5">
        {product.tags.map((tag) => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className="px-3.5 py-1.5 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-primary transition-colors text-sm font-medium rounded-full cursor-pointer"
          >
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
