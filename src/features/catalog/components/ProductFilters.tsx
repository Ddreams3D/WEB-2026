'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X, Filter, Search, Check as CheckIcon } from '@/lib/icons';
import { ProductFilters as ProductFiltersType, Category, ProductSortOption } from '@/shared/types';
import { CatalogItem } from '@/shared/types/catalog';
import { useCatalog } from '@/contexts/CatalogContext';
import { cn } from '@/lib/utils';

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
  const { categories, filters, applyFilters, clearFilters, searchQuery, setSearchQuery, toggleCategory, defaultMaxPrice } = useCatalog();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery);

  // Sync local search with URL state
  useEffect(() => {
    setLocalSearchTerm(searchQuery);
  }, [searchQuery]);

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchQuery) {
        setSearchQuery(localSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, setSearchQuery, searchQuery]);

  // Filter sort options based on selected type
  const getSortOptions = () => {
    const baseOptions: { value: ProductSortOption; label: string }[] = [
      { value: 'createdAt', label: 'Más recientes' },
      { value: 'rating', label: 'Mejor valorados' },
      { value: 'name', label: 'Nombre' }
    ];

    // Only show Price for Products or All
    if (filters.type !== 'service') {
      baseOptions.push({ value: 'price', label: 'Precio' });
    }

    return baseOptions;
  };

  const sortOptions = getSortOptions();

  const handleSortChange = (sortBy: ProductSortOption, sortOrder: 'asc' | 'desc') => {
    const newFilters = { ...filters, sortBy, sortOrder };
    applyFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery('');
    onFiltersChange?.({
      categoryIds: [],
      minPrice: 0,
      maxPrice: defaultMaxPrice,
      tags: [],
      type: 'product',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      isActive: true
    });
  };

  const hasActiveFilters = (
    (filters.categoryIds && filters.categoryIds.length > 0) ||
    searchQuery.trim() !== ''
  );

  return (
    <div className={cn(
      "backdrop-blur-sm rounded-lg border border-border shadow-lg relative z-30",
      "bg-card text-card-foreground",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">
            Filtros
          </h3>
          {hasActiveFilters && (
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              "bg-primary/10",
              "text-primary"
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
              className="text-muted-foreground hover:text-foreground h-8 px-2"
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
              className="w-8 h-8 text-muted-foreground hover:text-foreground"
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
              <label className="block text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                Búsqueda
              </label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <input
                  type="text"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className={cn(
                    "w-full pl-10 pr-4 py-2 text-sm border rounded-lg outline-none transition-all duration-200",
                    "border-input",
                    "bg-muted/50 focus:bg-background",
                    "text-foreground",
                    "placeholder-muted-foreground",
                    "focus:ring-2 focus:ring-ring/20 focus:border-ring"
                  )}
                />
              </div>
            </div>
          )}

          {/* Tipo de Producto - Segmented Control Style */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
              Tipo
            </label>
            <div className="flex p-1 bg-muted rounded-lg border border-border">
              {[
                { value: 'product', label: 'Productos' },
                { value: 'service', label: 'Servicios' },
                { value: 'all', label: 'Todos' }
              ].map((type) => {
                const isActive = filters.type === type.value || (!filters.type && type.value === 'product');
                return (
                  <button
                    key={type.value}
                    onClick={() => {
                      const newFilters = { ...filters, type: type.value as 'product' | 'service' | 'all' };
                      applyFilters(newFilters);
                      onFiltersChange?.(newFilters);
                    }}
                    className={cn(
                      "flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
            <label className="block text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
              Categorías
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {categories.map((category) => {
                const count = availableProducts 
                  ? availableProducts.filter(p => p.categoryId === category.id).length
                  : category.productCount;
                
                const isSelected = filters.categoryIds?.includes(category.id) || false;

                return (
                  <label key={category.id} className="flex items-center space-x-3 cursor-pointer group py-1 select-none active:scale-[0.98] transition-transform duration-100">
                    <div className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-all duration-200",
                      "group-hover:border-primary peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2",
                      isSelected 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-input bg-background"
                    )}>
                      {isSelected && <CheckIcon className="w-3.5 h-3.5" />}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCategory(category.id)}
                        className="sr-only peer"
                      />
                    </div>
                    <span className={cn(
                      "text-sm transition-colors flex-1",
                      isSelected ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
              Ordenar por
            </label>
            <div className="space-y-1">
              {sortOptions.map((option) => {
                const isSelected = filters.sortBy === option.value;
                return (
                  <div key={option.value} className={cn(
                    "flex items-center space-x-3 p-2 rounded-lg transition-colors",
                     isSelected ? "bg-muted/50" : "hover:bg-muted/30"
                  )}>
                    <label className="flex items-center space-x-3 cursor-pointer flex-1 group select-none">
                      <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        "group-active:scale-95",
                        isSelected 
                          ? "border-primary" 
                          : "border-input group-hover:border-primary",
                        "group-focus-within:ring-2 group-focus-within:ring-primary group-focus-within:ring-offset-2"
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                        <input
                          type="radio"
                          name="sortBy"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => handleSortChange(option.value, filters.sortOrder || 'desc')}
                          className="sr-only"
                        />
                      </div>
                      <span className={cn(
                        "text-sm transition-colors",
                        isSelected ? "text-foreground font-medium" : "text-muted-foreground"
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
                            filters.sortOrder === 'asc'
                              ? "bg-primary/20 text-primary"
                              : "text-muted-foreground hover:text-foreground"
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
                            filters.sortOrder === 'desc'
                              ? "bg-primary/20 text-primary"
                              : "text-muted-foreground hover:text-foreground"
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
