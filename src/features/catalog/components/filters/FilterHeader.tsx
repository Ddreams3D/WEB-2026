import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X, Filter } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface FilterHeaderProps {
  hasActiveFilters: boolean;
  isExpanded: boolean;
  isCollapsible: boolean;
  onClearFilters: () => void;
  onToggleExpand: () => void;
}

export function FilterHeader({
  hasActiveFilters,
  isExpanded,
  isCollapsible,
  onClearFilters,
  onToggleExpand
}: FilterHeaderProps) {
  return (
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
            onClick={onClearFilters}
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
            onClick={onToggleExpand}
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
  );
}
