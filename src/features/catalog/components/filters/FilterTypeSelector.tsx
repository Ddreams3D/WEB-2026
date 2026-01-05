import React from 'react';
import { cn } from '@/lib/utils';
import { ProductFilters } from '@/shared/types';

interface FilterTypeSelectorProps {
  filters: ProductFilters;
  onTypeChange: (type: 'product' | 'service' | 'all') => void;
}

export function FilterTypeSelector({ filters, onTypeChange }: FilterTypeSelectorProps) {
  return (
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
              onClick={() => onTypeChange(type.value as 'product' | 'service' | 'all')}
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
  );
}
