'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X, Filter, Search } from '@/lib/icons';
import { ProductFilters as ProductFiltersType, Category, ProductSortOption, Product } from '../../shared/types';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';

interface ProductFiltersProps {
  onFiltersChange?: (filters: ProductFiltersType) => void;
  className?: string;
  showSearch?: boolean;
  isCollapsible?: boolean;
  availableProducts?: Product[];
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

  const sortOptions: { value: ProductSortOption; label: string }[] = [
    { value: 'createdAt', label: 'Más recientes' },
    { value: 'price', label: 'Precio' },
    { value: 'rating', label: 'Mejor valorados' },
    { value: 'downloadCount', label: 'Más descargados' },
    { value: 'name', label: 'Nombre' }
  ];

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
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Buscar productos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, descripción o tags..."
                  className={cn(
                    "w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200",
                    "border-neutral-300 dark:border-neutral-600",
                    "bg-white dark:bg-neutral-800",
                    "text-neutral-900 dark:text-white",
                    "placeholder-neutral-500 dark:placeholder-neutral-400",
                    "focus:ring-primary-500 dark:focus:ring-primary-400"
                  )}
                />
              </div>
            </div>
          )}

          {/* Tipo de Producto */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Tipo
            </label>
            <div className="flex space-x-2">
              {[
                { value: 'product', label: 'Producto' },
                { value: 'service', label: 'Servicio' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    const newFilters = { ...localFilters, type: type.value as any };
                    setLocalFilters(newFilters);
                    applyFilters(newFilters);
                    onFiltersChange?.(newFilters);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg transition-all duration-200 border",
                    localFilters.type === type.value
                      ? "bg-primary-600 text-white border-primary-600 shadow-md"
                      : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Categorías
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600">
              {categories.map((category) => {
                const count = availableProducts 
                  ? availableProducts.filter(p => p.categoryId === category.id).length
                  : category.productCount;
                
                return (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={localFilters.categoryIds?.includes(category.id) || false}
                      onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                      className="rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500 dark:bg-neutral-700 transition-colors"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {category.name}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Ordenar por
            </label>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer flex-1 group">
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={localFilters.sortBy === option.value}
                      onChange={() => handleSortChange(option.value, localFilters.sortOrder || 'desc')}
                      className="text-primary-600 focus:ring-primary-500 dark:bg-neutral-700 dark:border-neutral-600"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {option.label}
                    </span>
                  </label>
                  
                  {localFilters.sortBy === option.value && (
                    <div className="flex items-center space-x-1">
                      <Button
                        onClick={() => handleSortChange(option.value, 'asc')}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-6 px-2 text-xs rounded transition-colors",
                          localFilters.sortOrder === 'asc'
                            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        )}
                      >
                        ↑
                      </Button>
                      <Button
                        onClick={() => handleSortChange(option.value, 'desc')}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-6 px-2 text-xs rounded transition-colors",
                          localFilters.sortOrder === 'desc'
                            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        )}
                      >
                        ↓
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
