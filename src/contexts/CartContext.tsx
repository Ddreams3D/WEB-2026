'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Cart, Product, CartItemCustomization } from '../shared/types';
import { ProductService } from '@/services/product.service';
import { cartSchema, type CartStorage } from '@/lib/validators/cart.schema';

interface SerializedCartItem extends Omit<CartItem, 'addedAt'> {
  addedAt: string;
}

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
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Valores calculados
  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  
  const subtotal = useMemo(() => items.reduce((total, item) => {
    const price = item.product.price || 0;
    return total + (price * item.quantity);
  }, 0), [items]);

  const total = useMemo(() => subtotal, [subtotal]); // Por ahora sin impuestos ni envío

  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  // Funciones para localStorage
  const loadCartFromLocalStorage = () => {
    try {
      setIsLoading(true);
      const savedCart = localStorage.getItem('ddreams-cart');
      if (savedCart) {
        const rawData = JSON.parse(savedCart);
        
        // Zod validation for integrity
        const validation = cartSchema.safeParse(rawData);
        
        if (!validation.success) {
           console.error("[CartContext] Corrupt cart data found, resetting.", validation.error);
           localStorage.removeItem('ddreams-cart');
           throw new Error("Corrupt cart data");
        }

        const cartData: CartStorage = validation.data;
        
        // Restaurar fechas que vienen como string del JSON
        const parsedItems: CartItem[] = cartData.items.map((item) => ({
          ...item,
          product: item.product as unknown as Product, // Cast safe due to passthrough schema
          addedAt: new Date(item.addedAt),
          customizations: item.customizations as CartItemCustomization[] | undefined
        }));
        
        setItems(parsedItems);
        
        const restoredCart: Cart = {
          ...cartData,
          items: parsedItems,
          createdAt: new Date(cartData.createdAt),
          updatedAt: new Date(cartData.updatedAt),
          // Ensure mandatory fields exist (schema passthrough might have them, otherwise defaults)
          tax: cartData.tax || 0,
          shipping: cartData.shipping || 0,
          discount: cartData.discount || 0,
          currency: cartData.currency || 'PEN'
        };

        setCart(restoredCart);
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
      console.warn('Error loading/validating cart, resetting to empty:', err);
      // Fallback to empty cart on error
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
        localStorage.removeItem('ddreams-cart');
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

  const addToCart = async (product: Product, quantity: number = 1, customizations?: CartItemCustomization[]) => {
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
      const errorMessage = err instanceof Error ? err.message : 'Error adding to cart';
      setError(errorMessage);
      throw err; // Re-throw para que el componente pueda manejar la UI (Toast)
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

  const refreshPrices = async () => {
    try {
      // Don't set global loading to avoid flickering entire UI, or handle gracefully
      // But user requested validation, so maybe we should block.
      // Let's set loading but maybe the UI handles it well.
      setIsLoading(true);
      setError(null);
      
      if (items.length === 0) {
        setIsLoading(false);
        return;
      }

      let hasChanges = false;

      const updatedItemsPromises = items.map(async (item) => {
        try {
          // Re-fetch product data
          const freshProduct = await ProductService.getProductById(item.productId);
          
          if (!freshProduct) {
             // Product might be deleted. 
             // Ideally we should mark it as unavailable or remove it.
             // For now, let's keep it but maybe flag it? 
             // Or just return as is to avoid data loss until user decides.
             return item; 
          }
          
          // Check if price changed
          if (freshProduct.price !== item.product.price) {
             hasChanges = true;
             return {
                ...item,
                product: {
                  ...item.product,
                  price: freshProduct.price,
                  name: freshProduct.name,
                  images: freshProduct.images
                }
             };
          }
          
          return item;
        } catch (e) {
            console.error(`Failed to refresh price for ${item.productId}`, e);
            return item;
        }
      });

      const updatedItems = await Promise.all(updatedItemsPromises);
      
      if (hasChanges) {
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
      }

    } catch (err) {
      console.error("Error refreshing prices", err);
      // Don't show error to user for background refresh unless critical
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
      refreshPrices,
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
