'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../shared/lib/supabase';
import { CartItem, Cart, Product } from '../shared/types';

// Interfaz para compatibilidad con base de datos existente
interface CartItemFromDB {
  id: string;
  product_id: string;
  quantity: number;
  products: {
    name: string;
    price: number;
    image_url: string;
  }[];
}

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
  // Funciones para desarrollo local
  loadMockData: () => void;
  toggleMockMode: () => void;
  isMockMode: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Datos mock para desarrollo
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Miniatura Personalizada',
    description: 'Miniatura 3D personalizada de alta calidad',
    price: 25.99,
    currency: 'USD',
    sku: 'MIN-001',
    categoryId: 'cat-1',
    categoryName: 'Miniaturas',
    sellerId: 'seller-1',
    images: [{
      id: 'img-1',
      productId: '1',
      url: '/images/products/miniatura-1.jpg',
      alt: 'Miniatura personalizada',
      isPrimary: true,
      sortOrder: 1
    }],
    specifications: [],
    tags: ['personalizado', 'miniatura'],
    stock: 10,
    minQuantity: 1,
    materials: ['PLA', 'PETG'],
    complexity: 'medium',
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(true); // Iniciar en modo mock para desarrollo

  // Valores calculados
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => {
    const price = item.product.price || 0;
    return total + (price * item.quantity);
  }, 0);
  const total = subtotal; // Por ahora sin impuestos ni envío

  useEffect(() => {
    if (isMockMode) {
      loadCartFromLocalStorage();
    } else {
      loadCart();
    }
  }, [isMockMode]);

  // Funciones para localStorage (modo mock)
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('ddreams-cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        setItems(cartData.items || []);
        setCart(cartData);
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
    }
  };

  const saveCartToLocalStorage = (cartData: Cart) => {
    try {
      localStorage.setItem('ddreams-cart', JSON.stringify(cartData));
    } catch (err) {
      setError('Error saving cart to localStorage');
    }
  };

  const loadCart = async () => {
    try {
      setIsLoading(true);
      
      if (!supabase) {
        throw new Error('Supabase no está configurado');
      }

      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          products (
            name,
            price,
            image_url
          )
        `);

      if (error) throw error;

      const formattedItems: CartItem[] = (cartItems || []).map((item: CartItemFromDB) => ({
        id: item.id,
        productId: item.product_id,
        product: {
          id: item.product_id,
          name: item.products[0]?.name || 'Producto sin nombre',
          price: item.products[0]?.price || 0,
          currency: 'PEN',
          description: '',
          sku: '',
          categoryId: '',
          categoryName: 'General',
          sellerId: 'default-seller',
          images: item.products[0]?.image_url ? [{
            id: 'img-1',
            productId: item.product_id,
            url: item.products[0].image_url,
            alt: item.products[0].name,
            isPrimary: true,
            sortOrder: 1
          }] : [],
          specifications: [],
          tags: [],
          stock: 0,
          minQuantity: 1,
          materials: [],
          complexity: 'medium' as const,
          isActive: true,
          isFeatured: false,
          rating: 0,
          reviewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        quantity: item.quantity,
        addedAt: new Date()
      }));

      setItems(formattedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading cart');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1, customizations?: any[]) => {
    try {
      setIsLoading(true);
      setError(null);

      if (isMockMode) {
        // Modo mock - usar localStorage
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
      } else {
        // Modo Supabase
        if (!supabase) throw new Error('Supabase no está configurado');

        const { data: existingItem } = await supabase
          .from('cart_items')
          .select()
          .eq('product_id', product.id)
          .single();

        if (existingItem) {
          await updateQuantity(product.id, existingItem.quantity + quantity);
        } else {
          const { error } = await supabase
            .from('cart_items')
            .insert({ product_id: product.id, quantity });

          if (error) throw error;
        }
        await loadCart();
      }
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

      if (isMockMode) {
        // Modo mock - usar localStorage
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
      } else {
        // Modo Supabase
        if (!supabase) throw new Error('Supabase no está configurado');

        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('product_id', productId);

        if (error) throw error;
        await loadCart();
      }
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

      if (isMockMode) {
        // Modo mock - usar localStorage
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
      } else {
        // Modo Supabase
        if (!supabase) throw new Error('Supabase no está configurado');
        
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('product_id', productId);

        if (error) throw error;
        await loadCart();
      }
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

      if (isMockMode) {
        // Modo mock - usar localStorage
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
      } else {
        // Modo Supabase
        if (!supabase) throw new Error('Supabase no está configurado');

        const { error } = await supabase
          .from('cart_items')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) throw error;
        setItems([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error clearing cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones auxiliares para desarrollo
  const loadMockData = () => {
    const mockItem: CartItem = {
      id: 'mock-item-1',
      productId: '1',
      product: mockProducts[0],
      quantity: 2,
      addedAt: new Date()
    };
    
    const mockCart: Cart = {
      id: 'mock-cart',
      items: [mockItem],
      subtotal: mockProducts[0].price * 2,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: mockProducts[0].price * 2,
      currency: 'PEN',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setItems([mockItem]);
    setCart(mockCart);
    saveCartToLocalStorage(mockCart);
  };

  const toggleMockMode = () => {
    setIsMockMode(!isMockMode);
    setItems([]);
    setCart(null);
    setError(null);
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
      error,
      loadMockData,
      toggleMockMode,
      isMockMode
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
