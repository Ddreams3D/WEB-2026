import React, { useState } from 'react';
import { Search, RefreshCw, Trash2, Filter, Plus, Grid, List, ArrowUp, ArrowDown, Check } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ProductService } from '@/services/product.service';
import { useToast } from '@/components/ui/ToastManager';

interface ProductManagerHeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    loading: boolean;
    loadProducts: (force?: boolean) => void;
    showDeleted: boolean;
    setShowDeleted: (show: boolean) => void;
    filterActive: 'all' | 'active' | 'inactive';
    setFilterActive: (v: 'all' | 'active' | 'inactive') => void;
    sortBy: 'recent' | 'name' | 'price' | 'category' | 'status';
    sortDir: 'asc' | 'desc';
    setSortBy: (v: 'recent' | 'name' | 'price' | 'category' | 'status') => void;
    setSortDir: (v: 'asc' | 'desc') => void;
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
    filterActive,
    setFilterActive,
    sortBy,
    sortDir,
    setSortBy,
    setSortDir,
    mode,
    handleAddProduct
}: ProductManagerHeaderProps) {
  const { toast } = useToast();

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
        <div className="flex flex-wrap gap-2 items-center">
            
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-white dark:bg-neutral-800 border-dashed">
                        <Filter className="w-4 h-4 text-neutral-500" />
                        <span className="hidden sm:inline">Vista y Filtros</span>
                        {(filterActive !== 'all' || sortBy !== 'recent') && (
                            <span className="flex h-2 w-2 rounded-full bg-primary" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                        {/* View Mode */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-xs text-neutral-500 uppercase tracking-wider">Visualización</h4>
                            <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all",
                                        viewMode === 'grid' 
                                            ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white" 
                                            : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                    )}
                                >
                                    <Grid className="w-4 h-4" />
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all",
                                        viewMode === 'list' 
                                            ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white" 
                                            : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                    )}
                                >
                                    <List className="w-4 h-4" />
                                    Lista
                                </button>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-xs text-neutral-500 uppercase tracking-wider">Estado</h4>
                            <select
                                value={filterActive}
                                onChange={(e) => setFilterActive(e.target.value as any)}
                                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg dark:border-neutral-700 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="active">Solo Activos</option>
                                <option value="inactive">Solo Inactivos</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-xs text-neutral-500 uppercase tracking-wider">Orden</h4>
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="flex-1 px-3 py-2 bg-white dark:bg-neutral-800 border rounded-lg dark:border-neutral-700 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="recent">Recientes</option>
                                    <option value="name">Nombre</option>
                                    <option value="price">Precio</option>
                                    <option value="category">Categoría</option>
                                    <option value="status">Estado</option>
                                </select>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                                    title={sortDir === 'asc' ? 'Ascendente' : 'Descendente'}
                                >
                                    {sortDir === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                        
                        {/* Reset Filters */}
                        {(filterActive !== 'all' || sortBy !== 'recent') && (
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full text-xs text-neutral-500 hover:text-neutral-900"
                                onClick={() => {
                                    setFilterActive('all');
                                    setSortBy('recent');
                                    setSortDir('desc');
                                }}
                            >
                                Restablecer filtros
                            </Button>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" onClick={() => loadProducts(true)} disabled={loading} title="Actualizar">
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
            
            <Button 
            variant={showDeleted ? 'destructive' : 'outline'} 
            size="icon"
            onClick={() => setShowDeleted(!showDeleted)}
            title={showDeleted ? 'Ver Activos' : 'Papelera'}
            className={cn(showDeleted && "bg-red-50 text-red-600 border-red-200 hover:bg-red-100")}
            >
            <Trash2 className="w-4 h-4" />
            </Button>
        </div>
        </div>
    </div>
  );
}
