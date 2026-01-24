'use client';

import React from 'react';
import { useCart } from '../../../contexts/CartContext';
import { Sheet, SheetContent } from '@/components/ui/sheet';
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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="flex flex-col w-full sm:max-w-md p-0 gap-0 border-l border-border bg-card [&>button]:hidden"
      >
        {/* Header */}
        <CartDrawerHeader itemCount={itemCount} onClose={onClose} />

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0 bg-muted/30">
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {items.length === 0 ? (
              <CartDrawerEmpty onClose={onClose} />
            ) : (
              <div className="p-4 space-y-4">
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
          <div className="border-t border-border bg-card">
             <CartDrawerFooter
               items={items}
               itemCount={itemCount}
               total={total}
               onClose={onClose}
             />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
