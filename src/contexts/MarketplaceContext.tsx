'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Category, ProductFilters, SearchResultItem } from '@/shared/types';
import { CatalogItem, getCatalogSortDate } from '@/shared/types/catalog';

interface MarketplaceContextType {
  // Data
  products: CatalogItem[];
  allProducts: CatalogItem[];
  featuredProducts: CatalogItem[];
  categories: Category[];
  
  // State (Derived from URL)
  searchQuery: string;
  filters: ProductFilters;
  isLoading: boolean; // Ahora solo indica transiciones de navegación si se desea
  
  // Actions
  setSearchQuery: (query: string) => void;
  applyFilters: (newFilters: Partial<ProductFilters>) => void; // Partial para flexibilidad
  clearFilters: () => void;
  toggleCategory: (categoryId: string) => void;
  
  // Legacy/Helper stubs (mantener compatibilidad si es necesario o eliminar)
  searchResults: SearchResultItem[];
  searchProductsAction: (query: string) => void; 
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

interface MarketplaceProviderProps {
  children: ReactNode;
  initialItems?: CatalogItem[];
  initialCategories?: Category[];
}

const initialFiltersState: ProductFilters = {
  categoryIds: [],
  minPrice: 0,
  maxPrice: 1000,
  tags: [],
  type: 'product',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  isActive: true
};

export function MarketplaceProvider({ 
  children, 
  initialItems = [], 
  initialCategories = [] 
}: MarketplaceProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Static Data (Server Provided)
  const [allProducts] = useState<CatalogItem[]>(initialItems);
  const [categories] = useState<Category[]>(initialCategories);
  
  // 2. Derived State from URL
  const filters = useMemo((): ProductFilters => {
    if (!searchParams) return initialFiltersState;

    const params = new URLSearchParams(searchParams.toString());
    const type = (params.get('type') as ProductFilters['type']) || 'product';
    const sortBy = (params.get('sort') as ProductFilters['sortBy']) || 'createdAt';
    const sortOrder = (params.get('order') as 'asc' | 'desc') || 'desc';
    const minPrice = params.has('minPrice') ? Number(params.get('minPrice')) : undefined;
    const maxPrice = params.has('maxPrice') ? Number(params.get('maxPrice')) : undefined;
    const categoryIds = params.getAll('category');
    
    return {
      ...initialFiltersState,
      type,
      sortBy,
      sortOrder,
      minPrice: minPrice ?? initialFiltersState.minPrice,
      maxPrice: maxPrice ?? initialFiltersState.maxPrice,
      categoryIds: categoryIds.length > 0 ? categoryIds : initialFiltersState.categoryIds,
      isActive: true
    };
  }, [searchParams]);

  const searchQuery = searchParams?.get('q') || '';

  // 3. Filtering Logic (Pure derivation)
  const products = useMemo(() => {
    let filteredItems = allProducts;

    // Search Query
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      filteredItems = filteredItems.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }

    // Categories
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filteredItems = filteredItems.filter(item => 
        filters.categoryIds!.includes(item.categoryId)
      );
    }

    // Type
    if (filters.type && filters.type !== 'all') {
      filteredItems = filteredItems.filter(item => item.kind === filters.type);
    }

    // Price
    const isServiceView = filters.type === 'service';
    if (!isServiceView && filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      filteredItems = filteredItems.filter(item => {
        if (item.kind === 'service') return true;
        return (item.price >= filters.minPrice! && item.price <= filters.maxPrice!);
      });
    }

    // Sort
    if (filters.sortBy) {
      filteredItems = [...filteredItems].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (filters.sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'downloadCount':
             aValue = (a.kind === 'product' && a.downloadCount) || 0;
             bValue = (b.kind === 'product' && b.downloadCount) || 0;
            break;
          default: // createdAt
            aValue = getCatalogSortDate(a);
            bValue = getCatalogSortDate(b);
        }

        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    return filteredItems;
  }, [allProducts, filters, searchQuery]);

  // 4. Featured Products (Static derivation)
  const featuredProducts = useMemo(() => 
    allProducts.filter(p => p.isFeatured), 
  [allProducts]);

  // 5. URL Updaters
  const updateUrl = useCallback((newParams: URLSearchParams) => {
    const currentString = searchParams?.toString() || '';
    const newString = newParams.toString();
    
    if (currentString === newString) return;

    const newPath = newString ? `${pathname}?${newString}` : pathname;
    router.replace(newPath || '/marketplace', { scroll: false });
  }, [pathname, router, searchParams]);

  const applyFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    const params = new URLSearchParams(searchParams?.toString());

    // Update params based on newFilters
    // Type
    if (newFilters.type) {
        if (newFilters.type !== 'product') params.set('type', newFilters.type);
        else params.delete('type');
    }

    // Sort
    if (newFilters.sortBy) {
        if (newFilters.sortBy !== 'createdAt') params.set('sort', newFilters.sortBy);
        else params.delete('sort');
    }

    if (newFilters.sortOrder) {
        if (newFilters.sortOrder !== 'desc') params.set('order', newFilters.sortOrder);
        else params.delete('order');
    }

    // Categories
    if (newFilters.categoryIds !== undefined) {
        params.delete('category');
        newFilters.categoryIds.forEach(id => params.append('category', id));
    }

    // Price
    if (newFilters.minPrice !== undefined) {
        if (newFilters.minPrice !== 0) params.set('minPrice', newFilters.minPrice.toString());
        else params.delete('minPrice');
    }
    if (newFilters.maxPrice !== undefined) {
        if (newFilters.maxPrice !== 1000) params.set('maxPrice', newFilters.maxPrice.toString());
        else params.delete('maxPrice');
    }
    
    // Preserve Search Query if not explicitly cleared?
    // Usually applyFilters comes from filter panel, preserving search is good.

    updateUrl(params);
  }, [searchParams, updateUrl]);

  const setSearchQuery = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    updateUrl(params);
  }, [searchParams, updateUrl]);

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(); 
    // Clear everything? Or keep search? usually "Clear Filters" clears everything including search if it's a global reset.
    // Let's reset to initial state (product, createdAt, desc) which are defaults (empty params).
    updateUrl(params);
  }, [updateUrl]);

  const toggleCategory = useCallback((categoryId: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    const currentCategories = params.getAll('category');
    
    // Check if category is already selected
    if (currentCategories.includes(categoryId)) {
      // Remove it: delete all and re-add others
      params.delete('category');
      currentCategories.forEach(id => {
        if (id !== categoryId) params.append('category', id);
      });
    } else {
      // Add it
      params.append('category', categoryId);
    }
    
    updateUrl(params);
  }, [searchParams, updateUrl]);
  
  // Legacy support for search results (can be derived from products if needed, or separate)
  // For now, let's map `products` to `searchResults` format if there is a query
  const searchResults = useMemo(() => {
      if (!searchQuery) return [];
      return products.map(item => ({
        id: item.id,
        title: item.name,
        description: item.shortDescription || item.description,
        type: item.kind,
        url: item.kind === 'service' 
          ? `/services/${item.slug || item.id}`
          : `/marketplace/product/${item.slug || item.id}`,
        imageUrl: item.images[0]?.url,
        price: item.price,
        currency: item.currency,
        rating: item.rating,
        category: item.categoryName
      }));
  }, [products, searchQuery]);

  const searchProductsAction = setSearchQuery; // Alias

  const value = {
    products,
    allProducts,
    featuredProducts,
    categories,
    searchQuery,
    filters,
    isLoading: false, // Client-side filtering is instant
    searchResults,
    setSearchQuery,
    applyFilters,
    clearFilters,
    toggleCategory,
    searchProductsAction
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
