'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Category, ProductFilters, SearchResult, SearchResultItem } from '../shared/types';
import {
  mockProducts,
  mockCategories,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  getProductsByPriceRange,
  getCategoryById
} from '../shared/data/mockData';

interface MarketplaceContextType {
  // Products
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  
  // Categories
  categories: Category[];
  currentCategory: Category | null;
  
  // Search and Filters
  searchQuery: string;
  searchResults: SearchResultItem[];
  filters: ProductFilters;
  isLoading: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  searchProductsAction: (query: string) => void;
  setCurrentProduct: (productId: string | null) => void;
  setCurrentCategory: (categoryId: string | null) => void;
  applyFilters: (filters: ProductFilters) => void;
  clearFilters: () => void;
  getProductsByFilters: () => Product[];
  loadFeaturedProducts: () => void;
  loadProductsByCategory: (categoryId: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

interface MarketplaceProviderProps {
  children: ReactNode;
}

const initialFilters: ProductFilters = {
  categoryIds: [],
  minPrice: 0,
  maxPrice: 1000,
  tags: [],
  sortBy: 'createdAt',
  sortOrder: 'desc',
  isActive: true
};

export function MarketplaceProvider({ children }: MarketplaceProviderProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProductState] = useState<Product | null>(null);
  const [categories] = useState<Category[]>(mockCategories);
  const [currentCategory, setCurrentCategoryState] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load featured products on mount
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchProductsAction(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadFeaturedProducts = useCallback(() => {
    setIsLoading(true);
    try {
      const featured = getFeaturedProducts();
      setFeaturedProducts(featured);
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProductsByCategory = (categoryId: string) => {
    setIsLoading(true);
    try {
      const categoryProducts = getProductsByCategory(categoryId);
      setProducts(categoryProducts);
    } catch (error) {
      console.error('Error loading products by category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentProduct = (productId: string | null) => {
    if (productId) {
      const product = getProductById(productId);
      setCurrentProductState(product || null);
    } else {
      setCurrentProductState(null);
    }
  };

  const setCurrentCategory = (categoryId: string | null) => {
    if (categoryId) {
      const category = getCategoryById(categoryId);
      setCurrentCategoryState(category || null);
      if (category) {
        loadProductsByCategory(categoryId);
      }
    } else {
      setCurrentCategoryState(null);
      setProducts(mockProducts);
    }
  };

  const searchProductsAction = (query: string) => {
    setIsLoading(true);
    try {
      const results = searchProducts(query);
      const searchResultsFormatted: SearchResultItem[] = results.map(product => ({
        id: product.id,
        title: product.name,
        description: product.shortDescription || product.description,
        type: 'product',
        url: `/marketplace/product/${product.id}`,
        imageUrl: product.images[0]?.url,
        price: product.price,
        currency: product.currency,
        rating: product.rating,
        category: product.categoryName
      }));
      setSearchResults(searchResultsFormatted);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setIsLoading(true);
    
    try {
      let filteredProducts = [...mockProducts];

      // Filter by categories
      if (newFilters.categoryIds && newFilters.categoryIds.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          newFilters.categoryIds!.includes(product.categoryId)
        );
      }

      // Filter by price range
      if (newFilters.minPrice !== undefined && newFilters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= newFilters.minPrice! && product.price <= newFilters.maxPrice!
        );
      }

      // Filter by tags
      if (newFilters.tags && newFilters.tags.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          newFilters.tags!.some(tag => product.tags.includes(tag))
        );
      }

      // Filter by active status
      if (newFilters.isActive !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.isActive === newFilters.isActive
        );
      }

      // Sort products
      if (newFilters.sortBy) {
        filteredProducts.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (newFilters.sortBy) {
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'rating':
              aValue = a.rating || 0;
              bValue = b.rating || 0;
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
              break;
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'downloadCount':
              aValue = a.downloadCount || 0;
              bValue = b.downloadCount || 0;
              break;
            default:
              return 0;
          }

          if (newFilters.sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setProducts(mockProducts);
  };

  const getProductsByFilters = (): Product[] => {
    return products;
  };

  return (
    <MarketplaceContext.Provider value={{
      products,
      featuredProducts,
      currentProduct,
      categories,
      currentCategory,
      searchQuery,
      searchResults,
      filters,
      isLoading,
      setSearchQuery,
      searchProductsAction,
      setCurrentProduct,
      setCurrentCategory,
      applyFilters,
      clearFilters,
      getProductsByFilters,
      loadFeaturedProducts,
      loadProductsByCategory
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}