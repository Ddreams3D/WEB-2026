'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search } from '@/lib/icons';
import Link from 'next/link';
import { ProductGrid, ProductList } from '@/components/marketplace/ProductGrid';
import { ProductFilters as ProductFiltersComponent } from '@/components/marketplace/ProductFilters';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ProductFilters as ProductFiltersType, Product } from '@/shared/types';

type ViewMode = 'grid' | 'list';

export default function MarketplacePage() {
  const {
    products,
    featuredProducts,
    categories,
    searchQuery,
    searchResults,
    isLoading,
    setSearchQuery,
    loadFeaturedProducts
  } = useMarketplace();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'search'>('all');

  useEffect(() => {
    loadFeaturedProducts();
  }, [loadFeaturedProducts]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setActiveTab('search');
    } else if (activeTab === 'search') {
      setActiveTab('all');
    }
  }, [searchQuery, activeTab]);

  const handleFiltersChange = (filters: ProductFiltersType) => {
    // Filters are automatically applied through the MarketplaceContext
  };

  const getDisplayProducts = () => {
    switch (activeTab) {
      case 'featured':
        return featuredProducts;
      case 'search':
        return searchResults.map(result => products.find(p => p.id === result.id)).filter((product): product is Product => product !== undefined);
      default:
        return products;
    }
  };

  const displayProducts = getDisplayProducts();

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 pt-20 lg:pt-24">
      {/* Header */}
      <div className="bg-surface dark:bg-neutral-800 border-b border-soft dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Explora nuestros productos destacados
                </h1>
              </div>
              
              
              {/* User Info and Actions - Removed as requested */}

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters (Hidden temporarily) */}
          {/*
          <div className="lg:w-80 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
            <ProductFiltersComponent
              onFiltersChange={handleFiltersChange}
              showSearch={true}
              isCollapsible={true}
            />
          </div>
          */}

          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs and Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              {/* Tabs */}
              <div className="flex space-x-1 bg-background dark:bg-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-surface dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Todos ({products.length})
                </button>
                <button
                  onClick={() => setActiveTab('featured')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'featured'
                      ? 'bg-surface dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Destacados ({featuredProducts.length})
                </button>
                {searchQuery.trim() && (
                  <button
                    onClick={() => setActiveTab('search')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'search'
                        ? 'bg-surface dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Búsqueda ({searchResults.length})
                  </button>
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
            {activeTab === 'search' && searchQuery.trim() && (
              <div className="mb-6 p-4 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-primary-800 dark:text-primary-200">
                    Resultados para: <strong>&quot;{searchQuery}&quot;</strong>
                  </span>
                  <span className="text-primary-600 dark:text-primary-400">
                    ({searchResults.length} encontrados)
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
                showWishlist={true}
                emptyMessage={
                  activeTab === 'search'
                    ? `No se encontraron productos para "${searchQuery}"`
                    : activeTab === 'featured'
                    ? 'No hay productos destacados disponibles'
                    : 'No hay productos disponibles'
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

      {/* Mobile Filters Overlay (Hidden temporarily) */}
      {/* 
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-surface dark:bg-neutral-800 shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filtros
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </div>
              <ProductFiltersComponent
                onFiltersChange={handleFiltersChange}
                showSearch={false}
                isCollapsible={false}
              />
            </div>
          </div>
        </div>
      )}
      */}
    </div>
  );
}