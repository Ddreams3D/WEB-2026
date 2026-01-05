'use client';

import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { CartEmptyState } from './components/CartEmptyState';
import { CartHeader } from './components/CartHeader';
import { CartItemCard } from './components/CartItemCard';
import { CartSummary } from './components/CartSummary';

export default function CartPageClient() {
  const {
    items,
    itemCount,
    subtotal,
    total,
    updateQuantity,
    removeFromCart,
    isLoading,
  } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 pt-20 lg:pt-24">
      {/* Header */}
      <CartHeader itemCount={itemCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          /* Carrito vacío */
          <CartEmptyState />
        ) : (
          /* Carrito con productos */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-surface dark:bg-neutral-800 rounded-lg shadow-soft border border-gray-100 dark:border-neutral-700">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Productos en tu carrito
                  </h2>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        isLoading={isLoading}
                        onUpdateQuantity={handleQuantityChange}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <CartSummary 
                items={items}
                itemCount={itemCount}
                subtotal={subtotal}
                total={total}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
