'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { ProductService } from '@/services/product.service';
import { StoreProduct } from '@/shared/types/domain';
import { useToast } from '@/components/ui/ToastManager';

interface FavoritesContextType {
  favorites: StoreProduct[];
  isLoading: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [favorites, setFavorites] = useState<StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites when user changes
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user || !user.favorites || user.favorites.length === 0) {
        setFavorites([]);
        return;
      }

      setIsLoading(true);
      try {
        // Optimization: Fetch all products once and filter
        // In a larger app, we would fetch only specific IDs
        const allProducts = await ProductService.getAllProducts();
        const userFavorites = allProducts.filter(p => user.favorites?.includes(p.id));
        setFavorites(userFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user?.favorites]); // Depend on the array of IDs

  const isFavorite = (productId: string) => {
    return user?.favorites?.includes(productId) || false;
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      showError('Acceso Requerido', 'Debes iniciar sesión para guardar favoritos');
      return;
    }

    const currentFavorites = user.favorites || [];
    const isAlreadyFavorite = currentFavorites.includes(productId);
    
    let newFavoritesIds: string[];
    
    if (isAlreadyFavorite) {
      newFavoritesIds = currentFavorites.filter(id => id !== productId);
    } else {
      newFavoritesIds = [...currentFavorites, productId];
    }

    // Optimistic update for UI responsiveness
    // Note: We don't update the full 'favorites' object array here immediately 
    // because we rely on the useEffect to sync with the 'user' object change.
    // However, we can optimistically update the user context via updateUser
    
    try {
      const success = await updateUser({ favorites: newFavoritesIds });
      
      if (success) {
        if (isAlreadyFavorite) {
          showSuccess('Eliminado de favoritos', 'El producto ha sido removido de tu lista.');
        } else {
          showSuccess('Añadido a favoritos', 'El producto se guardó en tu lista.');
        }
      }
    } catch (error) {
      showError('Error', 'No se pudo actualizar favoritos');
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isLoading, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
