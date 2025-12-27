'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, FileText, X } from '@/lib/icons';
import Link from 'next/link';
import { ProductGrid, ProductList } from '@/components/marketplace/ProductGrid';
import { ProductFilters as ProductFiltersComponent } from '@/components/marketplace/ProductFilters';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ProductFilters as ProductFiltersType, Product } from '@/shared/types';
import PageHeader from '@/shared/components/PageHeader';
import { Button } from '@/components/ui';

type ViewMode = 'grid' | 'list';

export default function MarketplacePageClient() {
  const {
    products,
    allProducts,
    categories,
    searchQuery,
    searchResults,
    isLoading,
    setSearchQuery,
  } = useMarketplace();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  // Removed section state as Services are moved to /services
  const [showFilters, setShowFilters] = useState(false);

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

  // Debug logging
  useEffect(() => {
    console.log('MarketplacePageClient:', {
      productsCount: products.length,
      displayProductsCount: displayProducts.length,
      isLoading
    });
  }, [products, displayProducts, isLoading]);

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
