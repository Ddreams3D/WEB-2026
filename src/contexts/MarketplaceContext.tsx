'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Category, ProductFilters, SearchResultItem } from '@/shared/types';
import { CatalogItem, StoreProduct, Service, getCatalogSortDate } from '@/shared/types/catalog';
import { ProductService } from '@/services/product.service';
import { ServiceService } from '@/services/service.service';
import { isFirebaseConfigured } from '@/lib/firebase';

interface MarketplaceContextType {
  // Products & Services (Catalog)
  products: CatalogItem[];
  allProducts: CatalogItem[];
  featuredProducts: CatalogItem[];
  currentProduct: CatalogItem | null;
  
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
  getProductsByFilters: () => CatalogItem[];
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
  type: 'product',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  isActive: true
};

export function MarketplaceProvider({ children }: MarketplaceProviderProps) {
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [allProducts, setAllProducts] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<CatalogItem[]>([]);
  const [currentProduct, setCurrentProductState] = useState<CatalogItem | null>(null);
  const [currentCategory, setCurrentCategoryState] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize data from Firestore
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      
      if (!isFirebaseConfigured) {
        console.info('Firebase is not configured. Using mock data for Marketplace.');
      }

      try {
        const [fetchedProducts, fetchedCategories, fetchedServices] = await Promise.all([
          ProductService.getAllProducts(),
          ProductService.getCategories(),
          ServiceService.getAllServices()
        ]);
        
        // Ensure Products have kind: 'product'
        const normalizedProducts: StoreProduct[] = fetchedProducts.map(p => ({
          ...p,
          kind: 'product'
        } as StoreProduct));

        // Ensure Services have kind: 'service' (should be already)
        const normalizedServices: Service[] = fetchedServices.map(s => ({
          ...s,
          kind: 'service'
        } as Service));
        
        // Combine products and services (CatalogItem[])
        const marketplaceItems: CatalogItem[] = [...normalizedProducts, ...normalizedServices].sort((a, b) => 
          getCatalogSortDate(b) - getCatalogSortDate(a)
        );
        
        setAllProducts(marketplaceItems);
        
        // Apply initial type filter
        let initialVisibleItems = marketplaceItems;
        
        if (initialFilters.type === 'product') {
          initialVisibleItems = marketplaceItems.filter(p => p.kind === 'product');
        } else if (initialFilters.type === 'service') {
          initialVisibleItems = marketplaceItems.filter(p => p.kind === 'service');
        }
        
        setProducts(initialVisibleItems);
        
        // Calculate product counts for categories (only products count usually?)
        // Or should we count services too? Let's count both if they match category.
        const categoriesWithCounts = fetchedCategories.map(cat => {
          const count = marketplaceItems.filter(p => p.categoryId === cat.id).length;
          return { ...cat, productCount: count };
        });
        
        setCategories(categoriesWithCounts);
        
        // Set featured
        const featured = marketplaceItems.filter(p => p.isFeatured);
        setFeaturedProducts(featured);
        
      } catch (error) {
        console.error('Error loading marketplace data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  const searchProductsAction = useCallback((query: string) => {
    setIsLoading(true);
    try {
      const term = query.toLowerCase();
      const results = allProducts.filter(p => 
        (p.name.toLowerCase().includes(term) || 
         p.description.toLowerCase().includes(term))
      );
      
      const searchResultsFormatted: SearchResultItem[] = results.map(item => ({
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
      setSearchResults(searchResultsFormatted);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [allProducts, searchQuery]);

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchProductsAction(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts, searchProductsAction]);

  const loadFeaturedProducts = useCallback(() => {
    const marketplaceItems = allProducts;
    const featured = marketplaceItems.filter(p => p.isFeatured);
    setFeaturedProducts(featured);
  }, [allProducts]);

  const loadProductsByCategory = (categoryId: string) => {
    setIsLoading(true);
    try {
      const marketplaceItems = allProducts;
      const categoryItems = marketplaceItems.filter(p => p.categoryId === categoryId);
      setProducts(categoryItems);
    } catch (error) {
      console.error('Error loading products by category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentProduct = (productId: string | null) => {
    if (productId) {
      const item = allProducts.find(p => p.id === productId || p.slug === productId);
      setCurrentProductState(item || null);
    } else {
      setCurrentProductState(null);
    }
  };

  const setCurrentCategory = (categoryId: string | null) => {
    if (categoryId) {
      const category = categories.find(c => c.id === categoryId);
      setCurrentCategoryState(category || null);
      if (category) {
        loadProductsByCategory(categoryId);
      }
    } else {
      setCurrentCategoryState(null);
      setProducts(allProducts);
    }
  };

  const getProductsByFilters = () => products;

  const applyFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    
    try {
      let filteredItems = allProducts;

      // Filter by categories
      if (newFilters.categoryIds && newFilters.categoryIds.length > 0) {
        filteredItems = filteredItems.filter(item => 
          newFilters.categoryIds!.includes(item.categoryId)
        );
      }

      // Filter by price range (Only for Products, unless Service has price)
      // If filtering services, ignore price filter? Or strictly apply?
      // User requirement: "filtros de precio/stock se oculten o deshabiliten al ver Servicios"
      // So if type is 'service', we might ignore price filter.
      // But if type is 'all', how do we behave?
      // Let's keep logic simple: If item is service, it passes price check (since usually quotes).
      // Or if filter is explicitly 'service', we skip price check.
      
      const isServiceView = newFilters.type === 'service';
      
      if (!isServiceView && newFilters.minPrice !== undefined && newFilters.maxPrice !== undefined) {
         filteredItems = filteredItems.filter(item => {
           if (item.kind === 'service') return true; // Services pass price filter always in mixed view
           return (item.price >= newFilters.minPrice! && item.price <= newFilters.maxPrice!);
         });
      }

      // Filter by tags
      if (newFilters.tags && newFilters.tags.length > 0) {
        filteredItems = filteredItems.filter(item => 
          newFilters.tags!.some(tag => item.tags.includes(tag))
        );
      }

      // Filter by type
      if (newFilters.type && newFilters.type !== 'all') {
        filteredItems = filteredItems.filter(item => {
          return item.kind === newFilters.type;
        });
      }

      // Filter by active status
      if (newFilters.isActive !== undefined) {
        filteredItems = filteredItems.filter(item => 
          item.isActive === newFilters.isActive
        );
      }

      // Sort items
      if (newFilters.sortBy) {
        filteredItems.sort((a, b) => {
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
              aValue = getCatalogSortDate(a);
              bValue = getCatalogSortDate(b);
              break;
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'downloadCount':
              // downloadCount exists on StoreProduct but not Service
              aValue = (a.kind === 'product' && a.downloadCount) || 0;
              bValue = (b.kind === 'product' && b.downloadCount) || 0;
              break;
            default:
              aValue = getCatalogSortDate(a);
              bValue = getCatalogSortDate(b);
          }

          if (newFilters.sortOrder === 'asc') {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          }
        });
      }

      setProducts(filteredItems);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  }, [allProducts]);
  
  // URL Synchronization Logic
  // This logic is centralized here to avoid duplication and inconsistencies
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;
  const pathname = typeof window !== 'undefined' ? require('next/navigation').usePathname() : '';
  const searchParams = typeof window !== 'undefined' ? require('next/navigation').useSearchParams() : null;

  // Initialize state from URL on mount (only client-side)
  useEffect(() => {
    if (!searchParams) return;
    
    // Parse filters from URL
    const params = new URLSearchParams(searchParams.toString());
    const type = (params.get('type') as ProductFilters['type']) || 'product';
    const sortBy = (params.get('sort') as ProductFilters['sortBy']) || 'createdAt';
    const sortOrder = (params.get('order') as 'asc' | 'desc') || 'desc';
    const minPrice = params.has('minPrice') ? Number(params.get('minPrice')) : undefined;
    const maxPrice = params.has('maxPrice') ? Number(params.get('maxPrice')) : undefined;
    const q = params.get('q') || '';
    const categoryIds = params.getAll('category');

    // Only update if different from initial to avoid double-render loops
    // But we need to ensure we respect the URL source of truth on load
    const urlFilters: ProductFilters = {
      ...initialFilters,
      type,
      sortBy,
      sortOrder,
      minPrice: minPrice ?? initialFilters.minPrice,
      maxPrice: maxPrice ?? initialFilters.maxPrice,
      categoryIds: categoryIds.length > 0 ? categoryIds : initialFilters.categoryIds,
      isActive: true
    };
    
    // We call setFilters directly to avoid triggering the URL update effect immediately
    setFilters(urlFilters);
    if (q) setSearchQuery(q);
    
    // Then apply the logic to filter products
    // We can't call applyFilters here easily without triggering effects if we added it to deps
    // So we'll rely on the fact that allProducts change or filters change will trigger re-filtering?
    // Actually, applyFilters updates 'products' state.
    // Let's manually trigger the filtering logic or reuse applyFilters but be careful with loops.
    // For now, let's just set the state and let a separate effect handle the actual filtering if needed,
    // OR just call applyFilters which updates 'products'.
    
    // Ideally, we want to run this ONCE on mount.
    // We will use a flag to prevent the URL-updater effect from running on this initial sync.
  }, []); // Run once on mount

  // Watch for State changes -> Update URL
  useEffect(() => {
    if (!router || !pathname || !searchParams) return;
    
    // We need to debounce or ensure we don't create loops
    // But simply mapping State -> URL is safe if State update comes from URL (it will match)
    
    const params = new URLSearchParams(searchParams.toString());
    
    // Handle Search Query
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }

    // Handle Type - Default is 'product'
    if (filters.type && filters.type !== 'product') {
      params.set('type', filters.type);
    } else {
      params.delete('type');
    }

    // Handle Sort - Defaults are createdAt/desc
    if (filters.sortBy && filters.sortBy !== 'createdAt') {
      params.set('sort', filters.sortBy);
    } else {
      params.delete('sort');
    }

    if (filters.sortOrder && filters.sortOrder !== 'desc') {
      params.set('order', filters.sortOrder);
    } else {
      params.delete('order');
    }

    // Handle Price
    if (filters.minPrice !== undefined && filters.minPrice !== 0) {
      params.set('minPrice', filters.minPrice.toString());
    } else {
      params.delete('minPrice');
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== 1000) {
      params.set('maxPrice', filters.maxPrice.toString());
    } else {
      params.delete('maxPrice');
    }

    // Handle Categories
    params.delete('category');
    filters.categoryIds?.forEach(id => params.append('category', id));

    // Update URL
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    
    // Only push if changed
    if (newPath !== `${pathname}?${searchParams.toString()}`) {
      router.push(newPath, { scroll: false });
    }
    
  }, [filters, searchQuery, pathname, router, searchParams]);
  
  // Re-apply filters when allProducts changes (initial load)
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters(filters);
    }
  }, [allProducts, applyFilters]); // filters is in dependency to re-apply if filters change? No, applyFilters updates filters state.
  // Wait, applyFilters SETS filters. So if we call applyFilters(filters), it's a loop?
  // No, applyFilters sets filters state, then does filtering.
  // We need an effect that says: When `filters` state changes, OR `allProducts` changes -> Update `products` (visible).
  // Currently `applyFilters` does both: sets state AND updates products.
  // This is slightly anti-pattern for React. Better:
  // 1. setFilters updates state.
  // 2. useEffect([filters, allProducts]) updates `products`.
  // But refactoring that now might be risky.
  // Let's stick to the current imperative `applyFilters` but ensure we call it when data loads.

  const clearFilters = () => applyFilters(initialFilters);

  const value = {
    products,
    allProducts,
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
    clearFilters: () => applyFilters(initialFilters),
    getProductsByFilters,
    loadFeaturedProducts,
    loadProductsByCategory
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
