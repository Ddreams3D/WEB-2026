'use client';

import React from 'react';
import { ProductFilters as ProductFiltersType } from '@/shared/types';
import { CatalogItem } from '@/shared/types/catalog';
import { cn } from '@/lib/utils';
import { useProductFilters } from '@/features/catalog/hooks/useProductFilters';
import { FilterHeader } from '@/features/catalog/components/filters/FilterHeader';
import { FilterSearch } from '@/features/catalog/components/filters/FilterSearch';
import { FilterTypeSelector } from '@/features/catalog/components/filters/FilterTypeSelector';
import { FilterCategories } from '@/features/catalog/components/filters/FilterCategories';
import { FilterSort } from '@/features/catalog/components/filters/FilterSort';

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
  const {
    categories,
    filters,
    applyFilters,
    localSearchTerm,
    setLocalSearchTerm,
    isExpanded,
    setIsExpanded,
    handleSortChange,
    handleClearFilters,
    hasActiveFilters,
    toggleCategory
  } = useProductFilters(onFiltersChange);

  return (
    <div className={cn(
      "backdrop-blur-sm rounded-lg border border-border shadow-lg relative z-30",
      "bg-card text-card-foreground",
      className
    )}>
      <FilterHeader 
        hasActiveFilters={hasActiveFilters}
        isExpanded={isExpanded}
        isCollapsible={isCollapsible}
        onClearFilters={handleClearFilters}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <div className="p-4 space-y-6">
          {showSearch && (
            <FilterSearch 
              searchTerm={localSearchTerm}
              onSearchChange={setLocalSearchTerm}
            />
          )}

          <FilterTypeSelector 
            filters={filters}
            onTypeChange={(type) => {
              const newFilters = { ...filters, type };
              applyFilters(newFilters);
              onFiltersChange?.(newFilters);
            }}
          />

          <FilterCategories 
            categories={categories}
            filters={filters}
            availableProducts={availableProducts}
            onToggleCategory={toggleCategory}
          />

          <FilterSort 
            filters={filters}
            onSortChange={handleSortChange}
          />
        </div>
      )}
    </div>
  );
}
