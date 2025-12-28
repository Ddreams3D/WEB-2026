'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Cart, Product } from '../shared/types';

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  addToCart: (product: Product, quantity?: number, customizations?: any[]) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Valores calculados
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => {
    const price = item.product.price || 0;
    return total + (price * item.quantity);
  }, 0);
  const total = subtotal; // Por ahora sin impuestos ni envío

  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  // Funciones para localStorage
  const loadCartFromLocalStorage = () => {
    try {
      setIsLoading(true);
      const savedCart = localStorage.getItem('ddreams-cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        // Restaurar fechas que vienen como string del JSON
        const parsedItems = (cartData.items || []).map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        
        setItems(parsedItems);
        setCart({
          ...cartData,
          items: parsedItems,
          createdAt: new Date(cartData.createdAt),
          updatedAt: new Date(cartData.updatedAt)
        });
      } else {
        // Inicializar carrito vacío
        const newCart: Cart = {
          id: 'local-cart',
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
          currency: 'PEN',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setCart(newCart);
        setItems([]);
      }
    } catch (err) {
      setError('Error loading cart from localStorage');
    } finally {
      setIsLoading(false);
    }
  };

  const saveCartToLocalStorage = (cartData: Cart) => {
    try {
      localStorage.setItem('ddreams-cart', JSON.stringify(cartData));
    } catch (err) {
      setError('Error saving cart to localStorage');
    }
  };

  const addToCart = async (product: Product, quantity: number = 1, customizations?: any[]) => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar item existente considerando personalizaciones
      const existingItemIndex = items.findIndex(item => 
        item.productId === product.id && 
        JSON.stringify(item.customizations || []) === JSON.stringify(customizations || [])
      );
      
      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Actualizar cantidad del item existente
        updatedItems = [...items];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        // Agregar nuevo item
        const newItem: CartItem = {
          id: `item-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          customizations,
          addedAt: new Date()
        };
        updatedItems = [...items, newItem];
      }

      setItems(updatedItems);
      
      // Calcular totales
      const newSubtotal = updatedItems.reduce((total, item) => {
        const price = item.product.price || 0;
        return total + (price * item.quantity);
      }, 0);
      
      // Actualizar carrito completo
      const updatedCart: Cart = {
        ...cart!,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newSubtotal,
        updatedAt: new Date()
      };
      
      setCart(updatedCart);
      saveCartToLocalStorage(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedItems = items.filter(item => item.productId !== productId);
      setItems(updatedItems);
      
      const newSubtotal = updatedItems.reduce((total, item) => {
        const price = item.product.price || 0;
        return total + (price * item.quantity);
      }, 0);
      
      const updatedCart: Cart = {
        ...cart!,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newSubtotal,
        updatedAt: new Date()
      };
      
      setCart(updatedCart);
      saveCartToLocalStorage(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (quantity < 1) {
        await removeFromCart(productId);
        return;
      }

      const updatedItems = items.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      );
      setItems(updatedItems);
      
      const newSubtotal = updatedItems.reduce((total, item) => {
        const price = item.product.price || 0;
        return total + (price * item.quantity);
      }, 0);
      
      const updatedCart: Cart = {
        ...cart!,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newSubtotal,
        updatedAt: new Date()
      };
      
      setCart(updatedCart);
      saveCartToLocalStorage(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const emptyCart: Cart = {
        ...cart!,
        items: [],
        subtotal: 0,
        total: 0,
        updatedAt: new Date()
      };
      
      setItems([]);
      setCart(emptyCart);
      saveCartToLocalStorage(emptyCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error clearing cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      items,
      itemCount,
      subtotal,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isLoading,
      error
    }}>
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
