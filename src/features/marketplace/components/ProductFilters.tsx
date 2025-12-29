'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X, Filter, Search, Check as CheckIcon } from '@/lib/icons';
import { ProductFilters as ProductFiltersType, Category, ProductSortOption } from '@/shared/types';
import { CatalogItem } from '@/shared/types/catalog';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';

interface ProductFiltersProps {
  onFiltersChange?: (filters: ProductFiltersType) => void;
  className?: string;
  showSearch?: boolean;
  isCollapsible?: boolean;
  availableProducts?: CatalogItem[];
}

export function ProductFilters({
  onFiltersChange,
  className = '',
  showSearch = true,
  isCollapsible = true,
  availableProducts
}: ProductFiltersProps) {
  const { categories, filters, applyFilters, clearFilters, searchQuery, setSearchQuery } = useMarketplace();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localFilters, setLocalFilters] = useState<ProductFiltersType>(filters);

  // Filter sort options based on selected type
  const getSortOptions = () => {
    const baseOptions: { value: ProductSortOption; label: string }[] = [
      { value: 'createdAt', label: 'Más recientes' },
      { value: 'rating', label: 'Mejor valorados' },
      { value: 'name', label: 'Nombre' }
    ];

    // Only show Price for Products or All
    if (localFilters.type !== 'service') {
      baseOptions.push({ value: 'price', label: 'Precio' });
    }

    return baseOptions;
  };

  const sortOptions = getSortOptions();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategoryIds = checked
      ? [...(localFilters.categoryIds || []), categoryId]
      : (localFilters.categoryIds || []).filter(id => id !== categoryId);
    
    const newFilters = { ...localFilters, categoryIds: newCategoryIds };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSortChange = (sortBy: ProductSortOption, sortOrder: 'asc' | 'desc') => {
    const newFilters = { ...localFilters, sortBy, sortOrder };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery('');
    onFiltersChange?.({
      categoryIds: [],
      minPrice: 0,
      maxPrice: 1000,
      tags: [],
      type: 'product',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      isActive: true
    });
  };

  const hasActiveFilters = (
    (localFilters.categoryIds && localFilters.categoryIds.length > 0) ||
    searchQuery.trim() !== ''
  );

  return (
    <div className={cn(
      "backdrop-blur-sm rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg relative z-30",
      colors.backgrounds.card,
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">
            Filtros
          </h3>
          {hasActiveFilters && (
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              colors.gradients.backgroundInfo,
              "text-blue-800 dark:text-blue-100"
            )}>
              Activos
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              onClick={handleClearFilters}
              variant="ghost"
              size="sm"
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 h-8 px-2"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
          
          {isCollapsible && (
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              aria-label={isExpanded ? "Contraer filtros" : "Expandir filtros"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Search */}
          {showSearch && (
            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
                Búsqueda
              </label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className={cn(
                    "w-full pl-10 pr-4 py-2 text-sm border rounded-lg outline-none transition-all duration-200",
                    "border-neutral-200 dark:border-neutral-700",
                    "bg-neutral-50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-800",
                    "text-neutral-900 dark:text-white",
                    "placeholder-neutral-400 dark:placeholder-neutral-500",
                    "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400"
                  )}
                />
              </div>
            </div>
          )}

          {/* Tipo de Producto - Segmented Control Style */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
              Tipo
            </label>
            <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
              {[
                { value: 'product', label: 'Productos' },
                { value: 'service', label: 'Servicios' },
                { value: 'all', label: 'Todos' }
              ].map((type) => {
                const isActive = localFilters.type === type.value || (!localFilters.type && type.value === 'product');
                return (
                  <button
                    key={type.value}
                    onClick={() => {
                      const newFilters = { ...localFilters, type: type.value as any };
                      setLocalFilters(newFilters);
                      applyFilters(newFilters);
                      onFiltersChange?.(newFilters);
                    }}
                    className={cn(
                      "flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                      isActive
                        ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    )}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
              Categorías
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
              {categories.map((category) => {
                const count = availableProducts 
                  ? availableProducts.filter(p => p.categoryId === category.id).length
                  : category.productCount;
                
                const isSelected = localFilters.categoryIds?.includes(category.id) || false;

                return (
                  <label key={category.id} className="flex items-center space-x-3 cursor-pointer group py-1">
                    <div className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-all duration-200",
                      isSelected 
                        ? "bg-primary-600 border-primary-600 text-white" 
                        : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 group-hover:border-primary-400"
                    )}>
                      {isSelected && <CheckIcon className="w-3.5 h-3.5" />}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                        className="hidden" // Hide native checkbox
                      />
                    </div>
                    <span className={cn(
                      "text-sm transition-colors flex-1",
                      isSelected ? "text-neutral-900 dark:text-white font-medium" : "text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
                    )}>
                      {category.name}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 tabular-nums">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
              Ordenar por
            </label>
            <div className="space-y-1">
              {sortOptions.map((option) => {
                const isSelected = localFilters.sortBy === option.value;
                return (
                  <div key={option.value} className={cn(
                    "flex items-center space-x-3 p-2 rounded-lg transition-colors",
                     isSelected ? "bg-neutral-50 dark:bg-neutral-800/50" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                  )}>
                    <label className="flex items-center space-x-3 cursor-pointer flex-1 group">
                      <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        isSelected 
                          ? "border-primary-600" 
                          : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                        <input
                          type="radio"
                          name="sortBy"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => handleSortChange(option.value, localFilters.sortOrder || 'desc')}
                          className="hidden" // Hide native radio
                        />
                      </div>
                      <span className={cn(
                        "text-sm transition-colors",
                        isSelected ? "text-neutral-900 dark:text-white font-medium" : "text-neutral-600 dark:text-neutral-300"
                      )}>
                        {option.label}
                      </span>
                    </label>
                    
                    {isSelected && (
                      <div className="flex items-center space-x-1">
                        <Button
                          onClick={() => handleSortChange(option.value, 'asc')}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-6 w-6 p-0 rounded transition-colors",
                            localFilters.sortOrder === 'asc'
                              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                              : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                          )}
                        >
                          ↑
                        </Button>
                        <Button
                          onClick={() => handleSortChange(option.value, 'desc')}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-6 w-6 p-0 rounded transition-colors",
                            localFilters.sortOrder === 'desc'
                              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                              : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                          )}
                        >
                          ↓
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
