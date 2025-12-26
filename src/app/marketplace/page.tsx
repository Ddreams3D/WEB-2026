'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, FileText, X } from '@/lib/icons';
import Link from 'next/link';
import { ProductGrid, ProductList } from '@/components/marketplace/ProductGrid';
import { ProductFilters as ProductFiltersComponent } from '@/components/marketplace/ProductFilters';
import { B2BServicesView } from '@/components/marketplace/B2BServicesView';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ProductFilters as ProductFiltersType, Product } from '@/shared/types';
import PageHeader from '@/shared/components/PageHeader';

type ViewMode = 'grid' | 'list';

export default function MarketplacePage() {
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
        .filter((product): product is Product => product !== undefined && !product.customPriceDisplay);
    }
    // Otherwise show only products (not services)
    return products.filter(p => !p.customPriceDisplay);
  };

  // Calculate base products for filter counts (only products, no services)
  const baseProducts = React.useMemo(() => {
    let filtered = allProducts;
    
    // If searching, restrict to search results
    if (searchQuery.trim()) {
       const searchIds = searchResults.map(r => r.id);
       filtered = filtered.filter(p => searchIds.includes(p.id));
    }

    // Always filter out services (customPriceDisplay)
    return filtered.filter(p => !p.customPriceDisplay);
  }, [searchQuery, searchResults, allProducts]);

  const displayProducts = getDisplayProducts();
  const productCount = products.filter(p => !p.customPriceDisplay).length;

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
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-background dark:hover:bg-neutral-800"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtros</span>
                </button>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid'
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-background dark:hover:bg-neutral-700'
                    }`}
                    title="Vista en cuadrícula"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list'
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-background dark:hover:bg-neutral-700'
                    }`}
                    title="Vista en lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
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
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
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