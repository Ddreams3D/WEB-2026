import React from 'react';
import { Check as CheckIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Category, ProductFilters } from '@/shared/types';
import { CatalogItem } from '@/shared/types/catalog';

interface FilterCategoriesProps {
  categories: Category[];
  filters: ProductFilters;
  availableProducts?: CatalogItem[];
  onToggleCategory: (categoryId: string) => void;
}

export function FilterCategories({ 
  categories, 
  filters, 
  availableProducts, 
  onToggleCategory 
}: FilterCategoriesProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
        Categorías
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {categories.map((category) => {
          const count = availableProducts 
            ? availableProducts.filter(p => p.categoryId === category.id || p.categoryName === category.name).length
            : category.productCount;
          
          const isSelected = filters.categoryIds?.includes(category.id) || filters.categoryIds?.includes(category.name) || false;

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
                  onChange={() => onToggleCategory(category.id)}
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
  );
}
