import React from 'react';
import { Plus, Search } from '@/lib/icons';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewToggle } from '../ViewToggle';

interface ServiceManagerHeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    isSeeding: boolean;
    handleSeed: (force: boolean) => void;
    handleAddService: () => void;
}

export function ServiceManagerHeader({
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    isSeeding,
    handleSeed,
    handleAddService
}: ServiceManagerHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold">Servicios</h2>
            </div>
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar servicios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground transition-all duration-200 outline-none"
                />
            </div>
            <div className="flex gap-2">
                <ViewToggle view={viewMode} onViewChange={setViewMode} />
                <Button variant="outline" onClick={() => handleSeed(true)} disabled={isSeeding}>
                    {isSeeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    Sincronizar Datos Estáticos
                </Button>
                <Button onClick={handleAddService} variant="gradient" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Nuevo Servicio
                </Button>
            </div>
        </div>
    );
}
