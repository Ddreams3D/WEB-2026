import React from 'react';
import { Product, Service } from '@/shared/types/domain';

interface ProductPriceProps {
  product: Product | Service;
  currentPrice: number;
}

export function ProductPrice({ product, currentPrice }: ProductPriceProps) {
  if ((product.price <= 0 || product.kind === 'service') && !product.customPriceDisplay) {
    return null;
  }

  return (
    <div className="flex items-center justify-between py-6 border-y border-border">
      <div>
        <p className="text-sm text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">
          {product.price > 0 && product.kind !== 'service' ? 'Precio Total' : 'Precio'}
        </p>
        <div className="text-3xl lg:text-4xl font-bold text-foreground flex items-baseline gap-1">
          {product.price > 0 && product.kind !== 'service' ? (
            <>
              <span className="text-lg text-muted-foreground font-normal self-start mt-1">S/</span>
              {currentPrice.toFixed(2)}
            </>
          ) : (
            <span className="text-2xl lg:text-3xl">{product.customPriceDisplay || 'Cotización'}</span>
          )}
        </div>
        {product.price > 0 && product.kind !== 'service' && (
          <p className="text-xs text-muted-foreground mt-2 font-medium bg-muted inline-block px-2 py-0.5 rounded">IGV incluido</p>
        )}
      </div>
    </div>
  );
}
