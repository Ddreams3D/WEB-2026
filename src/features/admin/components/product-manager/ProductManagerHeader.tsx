import React from 'react';
import { Search, RefreshCw, Trash2, Filter, Plus } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ViewToggle } from '../ViewToggle';

interface ProductManagerHeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    loading: boolean;
    loadProducts: (force?: boolean) => void;
    showDeleted: boolean;
    setShowDeleted: (show: boolean) => void;
    mode: 'product' | 'service' | 'all';
    handleAddProduct: () => void;
}

export function ProductManagerHeader({
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    loading,
    loadProducts,
    showDeleted,
    setShowDeleted,
    mode,
    handleAddProduct
}: ProductManagerHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-800 border rounded-lg dark:border-neutral-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
        </div>
        <div className="flex gap-2">
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
            <Button variant="outline" onClick={() => loadProducts(true)} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Actualizar
            </Button>
            <Button 
            variant={showDeleted ? 'destructive' : 'outline'} 
            onClick={() => setShowDeleted(!showDeleted)}
            className="gap-2"
            >
            <Trash2 className="w-4 h-4" />
            {showDeleted ? 'Ver Activos' : 'Papelera'}
            </Button>
            <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
            </Button>
            <Button onClick={handleAddProduct} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Nuevo {mode === 'service' ? 'Servicio' : mode === 'product' ? 'Producto' : 'Elemento'}
            </Button>
        </div>
        </div>
    </div>
  );
}
