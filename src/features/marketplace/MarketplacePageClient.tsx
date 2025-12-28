'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Grid, List, Search, FileText, X } from '@/lib/icons';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProductGrid, ProductList } from '@/components/marketplace/ProductGrid';
import { ProductFilters as ProductFiltersComponent } from '@/components/marketplace/ProductFilters';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ProductFilters as ProductFiltersType, Product } from '@/shared/types';
import PageHeader from '@/shared/components/PageHeader';
import { Button } from '@/components/ui';

type ViewMode = 'grid' | 'list';

export default function MarketplacePageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const {
    products,
    allProducts,
    categories,
    searchQuery,
    searchResults,
    isLoading,
    setSearchQuery,
    filters,
    applyFilters
  } = useMarketplace();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  // Removed section state as Services are moved to /services
  const [showFilters, setShowFilters] = useState(false);

  // Sync URL -> State (Initial Load & Back/Forward)
  useEffect(() => {
    // Only run if we have parameters or if we need to clear state
    const query = searchParams.get('q') || '';
    const categoryIds = searchParams.getAll('category');
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 1000;
    const sortBy = (searchParams.get('sort') as any) || 'createdAt';
    const sortOrder = (searchParams.get('order') as 'asc' | 'desc') || 'desc';

    // Update Search Query
    if (query !== searchQuery) {
      setSearchQuery(query);
    }

    // Update Filters
    // Compare current filters with URL params to avoid unnecessary updates
    const hasCategoryChanges = JSON.stringify(categoryIds.sort()) !== JSON.stringify(filters.categoryIds?.sort() || []);
    const hasPriceChanges = minPrice !== filters.minPrice || maxPrice !== filters.maxPrice;
    const hasSortChanges = sortBy !== filters.sortBy || sortOrder !== filters.sortOrder;

    if (hasCategoryChanges || hasPriceChanges || hasSortChanges) {
      applyFilters({
        ...filters,
        categoryIds: categoryIds.length > 0 ? categoryIds : [],
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        isActive: true
      });
    }
  }, [searchParams]);

  // Sync State -> URL
  useEffect(() => {
    // Create new URLSearchParams
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filters.categoryIds.forEach(id => params.append('category', id));
    }
    
    if (filters.minPrice > 0) {
      params.set('minPrice', filters.minPrice.toString());
    }
    
    if (filters.maxPrice < 1000) {
      params.set('maxPrice', filters.maxPrice.toString());
    }
    
    if (filters.sortBy !== 'createdAt') {
      params.set('sort', filters.sortBy);
    }
    
    if (filters.sortOrder !== 'desc') {
      params.set('order', filters.sortOrder);
    }
    
    // Construct the new URL
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    // Only update if URL actually changed to avoid infinite loops
    // Using replace to avoid polluting history stack with every keystroke
    // This ensures "Memory" when navigating away and back
    if (newUrl !== pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')) {
       router.replace(newUrl, { scroll: false });
    }
    
  }, [searchQuery, filters, pathname, router, searchParams]);

  // Restore scroll position when returning from product page
  useEffect(() => {
    // Only try to restore if we're not loading and have content
    if (!isLoading && products.length > 0) {
      const savedPos = sessionStorage.getItem('marketplace_scroll_pos');
      if (savedPos) {
        // Small timeout to ensure DOM is fully painted
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPos),
            behavior: 'instant'
          });
          // Clear the saved position so it doesn't affect other navigations
          sessionStorage.removeItem('marketplace_scroll_pos');
        }, 50);
      }
    }
  }, [isLoading, products.length]);

  // Removed activeTab state as we only show products here
  
  const handleFiltersChange = (filters: ProductFiltersType) => {
    // Filters are automatically applied through the MarketplaceContext
  };

  const getDisplayProducts = () => {
    // If searching, show search results
    if (searchQuery.trim()) {
       return searchResults
        .map(result => products.find(p => p.id === result.id))
        .filter((product): product is Product => product !== undefined);
    }
    // Otherwise show all products
    return products;
  };

  // Calculate base products for filter counts
  const baseProducts = React.useMemo(() => {
    let filtered = allProducts;
    
    // If searching, restrict to search results
    if (searchQuery.trim()) {
       const searchIds = searchResults.map(r => r.id);
       filtered = filtered.filter(p => searchIds.includes(p.id));
    }

    return filtered;
  }, [searchQuery, searchResults, allProducts]);

  const displayProducts = getDisplayProducts();
  const productCount = displayProducts.length;

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900">
      <PageHeader
        title="Catálogo de Productos"
        description="Descubre nuestra colección de productos de impresión 3D listos para ti"
        image="/images/placeholder-innovation.svg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFiltersComponent 
                  onFiltersChange={handleFiltersChange}
                  showSearch={false}
                  availableProducts={baseProducts}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
            {/* Tabs and Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
              {/* Product Count / Header */}
              <div className="flex space-x-2 bg-neutral-100 dark:bg-neutral-800/50 p-1.5 rounded-xl self-start sm:self-auto">
                <div
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-md ring-1 ring-black/5 dark:ring-white/10 transition-all duration-200"
                >
                  Productos
                  <span className="ml-2 text-xs opacity-80 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-full text-primary-700 dark:text-primary-300">
                    {productCount}
                  </span>
                </div>
                
                {searchQuery.trim() && (
                  <div
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-neutral-600 dark:text-neutral-400 bg-white/50 dark:bg-neutral-700/50 transition-all duration-200"
                  >
                    Búsqueda ({searchResults.length})
                  </div>
                )}
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-2">
                {/* Mobile Filter Toggle */}
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 border border-neutral-200 dark:border-neutral-700 rounded-lg p-1">
                  <Button
                    onClick={() => setViewMode('grid')}
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    title="Vista en cuadrícula"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    title="Vista en lista"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Results Info */}
            {searchQuery.trim() && (
              <div className="mb-6 p-4 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-primary-800 dark:text-primary-200">
                    Resultados para &quot;{searchQuery}&quot;
                    <span className="ml-1 text-sm text-primary-600 dark:text-primary-400">
                      ({searchResults.length} encontrados)
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Products Display */}
            {viewMode === 'grid' ? (
              <ProductGrid 
                products={displayProducts} 
                isLoading={isLoading}
                showAddToCart={true}
                emptyMessage={
                  searchQuery.trim()
                    ? `No se encontraron resultados para "${searchQuery}"`
                    : 'No hay productos disponibles en esta categoría'
                }
              />
            ) : (
              <ProductList
                products={displayProducts}
                isLoading={isLoading}
                showAddToCart={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-neutral-800 shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filtros
                </h3>
                <Button
                  onClick={() => setShowFilters(false)}
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <ProductFiltersComponent
                onFiltersChange={handleFiltersChange}
                showSearch={true}
                isCollapsible={false}
                availableProducts={baseProducts}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
