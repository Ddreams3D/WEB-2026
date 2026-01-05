'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from '@/lib/icons';
import { ProductImage } from '../DefaultImage';
import { cn } from '@/lib/utils';
import { CartItem } from '@/shared/types';

interface CartDrawerItemProps {
  item: CartItem;
  isLoading: boolean;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartDrawerItem({ item, isLoading, onUpdateQuantity, onRemove }: CartDrawerItemProps) {
  return (
    <div
      className={cn(
        "group rounded-xl p-4 shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-md transition-all duration-200 bg-card"
      )}
    >
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden shadow-sm bg-muted">
          <ProductImage
            src={item.product.images?.[0]?.url}
            alt={item.product.name}
            width={80}
            height={80}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate mb-1">
            {item.product.name}
          </h4>
          <div className="flex items-center justify-between mb-3">
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
              S/.{' '}
              {item.product.price
                ? item.product.price.toFixed(2)
                : '0.00'}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Total: S/.{' '}
              {item.product.price
                ? (item.product.price * item.quantity).toFixed(2)
                : '0.00'}
            </p>
          </div>

          {/* Quantity and Actions */}
          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600">
              <Button
                onClick={() =>
                  onUpdateQuantity(
                    item.productId,
                    item.quantity - 1
                  )
                }
                disabled={isLoading}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none rounded-l-lg hover:bg-neutral-100 dark:hover:bg-neutral-600"
              >
                <Minus className="h-3 w-3 text-neutral-600 dark:text-neutral-300" />
              </Button>
              <span className="px-4 py-2 font-semibold text-sm min-w-[3rem] text-center text-neutral-900 dark:text-white">
                {item.quantity}
              </span>
              <Button
                onClick={() =>
                  onUpdateQuantity(
                    item.productId,
                    item.quantity + 1
                  )
                }
                disabled={isLoading}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none rounded-r-lg hover:bg-neutral-100 dark:hover:bg-neutral-600"
              >
                <Plus className="h-3 w-3 text-neutral-600 dark:text-neutral-300" />
              </Button>
            </div>

            <Button
              onClick={() => onRemove(item.productId)}
              disabled={isLoading}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              title="Eliminar producto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
