'use client';

import React, { createContext, useContext } from 'react';
import { CartItem, Cart, Product, CartItemCustomization } from '../shared/types';
import { useCartManager } from '@/features/cart/hooks/useCartManager';

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  addToCart: (product: Product, quantity?: number, customizations?: CartItemCustomization[]) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshPrices: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartManager = useCartManager();

  return (
    <CartContext.Provider value={cartManager}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
