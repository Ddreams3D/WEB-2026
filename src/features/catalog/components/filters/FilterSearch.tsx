import React from 'react';
import { Search } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface FilterSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function FilterSearch({ searchTerm, onSearchChange }: FilterSearchProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
        Búsqueda
      </label>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
  );
}
