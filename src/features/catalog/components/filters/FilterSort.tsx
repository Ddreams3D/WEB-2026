import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProductFilters, ProductSortOption } from '@/shared/types';

interface FilterSortProps {
  filters: ProductFilters;
  onSortChange: (sortBy: ProductSortOption, sortOrder: 'asc' | 'desc') => void;
}

export function FilterSort({ filters, onSortChange }: FilterSortProps) {
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

  return (
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
                    onChange={() => onSortChange(option.value, filters.sortOrder || 'desc')}
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
                    onClick={() => onSortChange(option.value, 'asc')}
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
                    onClick={() => onSortChange(option.value, 'desc')}
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
  );
}
