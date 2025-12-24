'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter, Search } from '@/lib/icons';
import { ProductFilters as ProductFiltersType, Category, ProductSortOption } from '../../shared/types';
import { useMarketplace } from '../../contexts/MarketplaceContext';

interface ProductFiltersProps {
  onFiltersChange?: (filters: ProductFiltersType) => void;
  className?: string;
  showSearch?: boolean;
  isCollapsible?: boolean;
}

export function ProductFilters({
  onFiltersChange,
  className = '',
  showSearch = true,
  isCollapsible = true
}: ProductFiltersProps) {
  const { categories, filters, applyFilters, clearFilters, searchQuery, setSearchQuery } = useMarketplace();
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);
  const [localFilters, setLocalFilters] = useState<ProductFiltersType>(filters);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || 0,
    max: filters.maxPrice || 1000
  });

  // Available tags (extracted from mock data)
  const availableTags = [
    'casa', 'moderna', 'minimalista', 'arquitectura', 'residencial',
    'silla', 'oficina', 'ergonómica', 'mueble', 'industrial',
    'escultura', 'abstracta', 'arte', 'digital', 'decoración',
    'espada', 'medieval', 'fantasy', 'videojuego', 'arma',
    'robot', 'personaje', 'animación', 'rigging', 'sci-fi'
  ];

  const sortOptions: { value: ProductSortOption; label: string }[] = [
    { value: 'createdAt', label: 'Más recientes' },
    { value: 'price', label: 'Precio' },
    { value: 'rating', label: 'Mejor valorados' },
    { value: 'downloadCount', label: 'Más descargados' },
    { value: 'name', label: 'Nombre' }
  ];

  useEffect(() => {
    setLocalFilters(filters);
    setPriceRange({
      min: filters.minPrice || 0,
      max: filters.maxPrice || 1000
    });
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

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...(localFilters.tags || []), tag]
      : (localFilters.tags || []).filter(t => t !== tag);
    
    const newFilters = { ...localFilters, tags: newTags };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handlePriceChange = (field: 'min' | 'max', value: number) => {
    const newPriceRange = { ...priceRange, [field]: value };
    setPriceRange(newPriceRange);
    
    const newFilters = {
      ...localFilters,
      minPrice: newPriceRange.min,
      maxPrice: newPriceRange.max
    };
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
    setPriceRange({ min: 0, max: 1000 });
    setSearchQuery('');
    onFiltersChange?.({
      categoryIds: [],
      minPrice: 0,
      maxPrice: 1000,
      tags: [],
      sortBy: 'createdAt',
      sortOrder: 'desc',
      isActive: true
    });
  };

  const hasActiveFilters = (
    (localFilters.categoryIds && localFilters.categoryIds.length > 0) ||
    (localFilters.tags && localFilters.tags.length > 0) ||
    localFilters.minPrice !== 0 ||
    localFilters.maxPrice !== 1000 ||
    searchQuery.trim() !== ''
  );

  return (
    <div className={`bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg relative z-30 ${className}`} style={{backgroundColor: 'white', backdropFilter: 'blur(8px)'}}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filtros
          </h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
              Activos
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Limpiar</span>
            </button>
          )}
          
          {isCollapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Search */}
          {showSearch && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar productos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, descripción o tags..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Categorías
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.categoryIds?.includes(category.id) || false}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({category.productCount})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Rango de precio
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Mínimo</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Máximo</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ${priceRange.min} - ${priceRange.max}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {availableTags.map((tag) => (
                <label key={tag} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.tags?.includes(tag) || false}
                    onChange={(e) => handleTagChange(tag, e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    localFilters.tags?.includes(tag)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}>
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Ordenar por
            </label>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer flex-1">
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={localFilters.sortBy === option.value}
                      onChange={() => handleSortChange(option.value, localFilters.sortOrder || 'desc')}
                      className="text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                  
                  {localFilters.sortBy === option.value && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleSortChange(option.value, 'asc')}
                        className={`px-2 py-1 text-xs rounded ${
                          localFilters.sortOrder === 'asc'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleSortChange(option.value, 'desc')}
                        className={`px-2 py-1 text-xs rounded ${
                          localFilters.sortOrder === 'desc'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        ↓
                      </button>
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