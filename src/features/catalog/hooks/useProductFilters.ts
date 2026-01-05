import { useState, useEffect } from 'react';
import { useCatalog } from '@/contexts/CatalogContext';
import { ProductFilters, ProductSortOption, Category } from '@/shared/types';
import { CatalogItem } from '@/shared/types/catalog';

export function useProductFilters(
  onFiltersChange?: (filters: ProductFilters) => void,
  initialSearchQuery?: string
) {
  const { categories: initialCategories, filters, applyFilters, clearFilters, searchQuery, setSearchQuery, toggleCategory, defaultMaxPrice } = useCatalog();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery);
  const [categories, setCategories] = useState(initialCategories);

  // Sync categories with local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('catalog_categories');
      if (stored) {
        try {
          const customCategories: string[] = JSON.parse(stored);
          const mergedCategories = [...initialCategories];
          
          customCategories.forEach(catName => {
            const exists = mergedCategories.some(c => c.name === catName);
            if (!exists) {
               mergedCategories.push({
                id: catName,
                name: catName,
                slug: catName.toLowerCase().replace(/\s+/g, '-'),
                description: '',
                productCount: 0,
                isActive: true,
                sortOrder: 0,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            }
          });
          
          setCategories(mergedCategories);
        } catch(e) { console.error(e); }
      } else {
        setCategories(initialCategories);
      }
    }
  }, [initialCategories]);

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

  return {
    categories,
    filters,
    applyFilters,
    searchQuery,
    localSearchTerm,
    setLocalSearchTerm,
    isExpanded,
    setIsExpanded,
    handleSortChange,
    handleClearFilters,
    hasActiveFilters,
    toggleCategory
  };
}
