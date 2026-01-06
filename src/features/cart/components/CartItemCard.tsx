import React from 'react';
import { Button } from '@/components/ui';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { Minus, Plus, Trash2 } from '@/lib/icons';
import { CartItem } from '@/shared/types';

interface CartItemCardProps {
  item: CartItem;
  isLoading: boolean;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemCard({ item, isLoading, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const handleQuantityChange = (newQuantity: number) => {
    onUpdateQuantity(item.productId, newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800/50">
      {/* Grupo Superior Móvil: Imagen + Info */}
      <div className="flex items-start space-x-4 w-full sm:w-auto flex-1">
        {/* Imagen del producto */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-200 dark:bg-neutral-700 rounded-lg overflow-hidden relative">
            <ProductImage
              src={item.product.images?.[0]?.url}
              alt={item.product.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
            {item.product.name}
          </h3>
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2 sm:hidden">
            S/{' '}
            {item.product.price
              ? item.product.price.toFixed(2)
              : '0.00'}
          </p>
          <p className="hidden sm:block text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2">
            S/{' '}
            {item.product.price
              ? item.product.price.toFixed(2)
              : '0.00'}
          </p>
        </div>
      </div>

      {/* Grupo Inferior Móvil: Controles + Subtotal + Eliminar */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 mt-2 sm:mt-0">
        {/* Controles de cantidad */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
            disabled={isLoading}
          >
            <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Button>
          <span className="w-8 sm:w-12 text-center font-medium text-gray-900 dark:text-white">
            {item.quantity}
          </span>
          <Button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>

        {/* Subtotal del producto */}
        <div className="text-right flex-1 sm:flex-none">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.product.price > 0 
              ? `S/ ${(item.product.price * item.quantity).toFixed(2)}` 
              : 'A cotizar'}
          </p>
        </div>

        {/* Botón eliminar */}
        <Button
          onClick={() => onRemove(item.productId)}
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          disabled={isLoading}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
