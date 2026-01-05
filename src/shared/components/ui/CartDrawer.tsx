'use client';

import React from 'react';
import { useCart } from '../../../contexts/CartContext';
import { cn } from '@/lib/utils';
import { CartDrawerHeader } from './cart-drawer/CartDrawerHeader';
import { CartDrawerEmpty } from './cart-drawer/CartDrawerEmpty';
import { CartDrawerItem } from './cart-drawer/CartDrawerItem';
import { CartDrawerFooter } from './cart-drawer/CartDrawerFooter';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount, total, updateQuantity, removeFromCart, isLoading } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md shadow-2xl z-50 transform transition-all duration-300 ease-out border-l flex flex-col",
          "bg-card",
          "border-l-border",
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <CartDrawerHeader itemCount={itemCount} onClose={onClose} />

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-[55vh] bg-muted">
          <div
            className="flex-1 overflow-y-auto min-h-100"
            style={{ scrollbarWidth: 'thin' }}
          >
            {items.length === 0 ? (
              <CartDrawerEmpty onClose={onClose} />
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <CartDrawerItem
                    key={item.id}
                    item={item}
                    isLoading={isLoading}
                    onUpdateQuantity={handleQuantityChange}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <CartDrawerFooter
            items={items}
            itemCount={itemCount}
            total={total}
            onClose={onClose}
          />
        )}
      </div>
    </>
  );
}
