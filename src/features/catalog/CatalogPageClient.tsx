'use client';

import React, { useState } from 'react';
import { Filter, Grid, List } from '@/lib/icons';
import { ProductGrid, ProductGridSkeleton } from '@/features/catalog/components/ProductGrid';
import { ProductFilters as ProductFiltersComponent } from '@/features/catalog/components/ProductFilters';
import { useCatalog } from '@/contexts/CatalogContext';
import { ProductFilters as ProductFiltersType } from '@/shared/types';
import PageHeader from '@/shared/components/PageHeader';
import { Button } from '@/components/ui';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { cn } from '@/lib/utils';
import { heroImages } from '@/config/images';

type ViewMode = 'grid' | 'list';

export default function CatalogPageClient() {
  const {
    products,
    allProducts,
    searchQuery,
    isLoading,
    applyFilters
  } = useCatalog();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Ensure component is mounted to prevent hydration mismatches
  const [mounted, setMounted] = useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize Scroll Restoration System
  useScrollRestoration(true, !isLoading && products.length > 0);

  // Calculate base products for filter counts
  const baseProducts = React.useMemo(() => {
    // Base products should be all products, or maybe filtered by search?
    // Usually filters show counts based on current search but NOT other filters.
    // Let's keep it simple: use allProducts filtered by search only for the counts
    let filtered = allProducts;
    
    // If searching, restrict to search results
    if (searchQuery.trim()) {
       const term = searchQuery.toLowerCase();
       filtered = filtered.filter(p => 
         p.name.toLowerCase().includes(term) || 
         p.description.toLowerCase().includes(term)
       );
    }

    return filtered;
  }, [searchQuery, allProducts]);

  const getDisplayProducts = () => {
    return products;
  };

  const displayProducts = getDisplayProducts();
  const productCount = displayProducts.length;

  // Handler for filter changes from UI
  // This just updates the context state, the context will handle URL sync
  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    applyFilters(newFilters);
  };

  // If not mounted, render a minimal placeholder to match server HTML structure
  // This prevents hydration errors where client renders nothing but server rendered content
  if (!mounted) {
    return (
      <div className="bg-background min-h-screen">
         <PageHeader
          title="Catálogo de productos bajo pedido"
          className="pt-16 sm:pt-20"
          description={
            <div className="flex flex-col gap-4">
              <p>Elige un diseño base y lo fabricamos a medida en Arequipa.</p>
              <p>Todos los productos de nuestro catálogo de impresión 3D se fabrican bajo pedido y pueden personalizarse según tus requerimientos técnicos, estéticos o funcionales.</p>
            </div>
          }
          image={heroImages.services}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <ProductGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <PageHeader
        title="Catálogo de productos bajo pedido"
        className="pt-16 sm:pt-20"
        description={
          <div className="flex flex-col gap-4">
            <p>Elige un diseño base y lo fabricamos a medida en Arequipa.</p>
            <p>Todos los productos de nuestro catálogo de impresión 3D se fabrican bajo pedido y pueden personalizarse según tus requerimientos técnicos, estéticos o funcionales.</p>
          </div>
        }
        image={heroImages.services}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFiltersComponent 
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
              <div className="flex space-x-2 bg-muted p-1.5 rounded-xl self-start sm:self-auto">
                <div
                  className={cn(
                    "px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md ring-1 ring-black/5 dark:ring-white/10 transition-all duration-200",
                    "bg-card text-primary"
                  )}
                >
                  Productos
                  <span className={cn(
                    "ml-2 text-xs opacity-80 px-2 py-0.5 rounded-full",
                    "bg-primary/10 text-primary"
                  )}>
                    {productCount}
                  </span>
                </div>
              </div>

              {/* Mobile Filter & View Toggle */}
              <div className="flex items-center space-x-3 self-end sm:self-auto w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden flex items-center space-x-2 border-border"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtros</span>
                </Button>

                <div className="flex bg-muted p-1 rounded-lg border border-border">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === 'grid'
                        ? 'bg-card text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    aria-label="Vista de cuadrícula"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === 'list'
                        ? 'bg-card text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    aria-label="Vista de lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <ProductFiltersComponent 
                  onFiltersChange={handleFiltersChange}
                  showSearch={true}
                  isCollapsible={true}
                  availableProducts={baseProducts}
                />
              </div>
            )}

            {/* Product Grid */}
            <div className="min-h-[400px]">
              {isLoading ? (
                <ProductGridSkeleton count={6} />
              ) : (
                <ProductGrid
                  products={displayProducts}
                  emptyMessage="No se encontraron productos con los filtros seleccionados."
                  className={viewMode === 'grid' 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "grid-cols-1 gap-4"
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
