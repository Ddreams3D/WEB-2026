import React from 'react';
import { Plus, Search, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ServiceLandingConfig } from '@/shared/types/service-landing';

interface ServiceLandingsHeaderProps {
    filteredLandings: ServiceLandingConfig[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleCreateNew: () => void;
}

export function ServiceLandingsHeader({
    filteredLandings,
    searchQuery,
    setSearchQuery,
    handleCreateNew
}: ServiceLandingsHeaderProps) {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Landings por Servicio</h2>
                <p className="text-muted-foreground">Crea y gestiona páginas de aterrizaje específicas para cada servicio.</p>
            </div>
            <Button onClick={handleCreateNew} className="shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Landing
            </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar landings..." 
                    className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
                <Layout className="w-4 h-4" />
                <span>{filteredLandings.length} landings</span>
            </div>
        </div>
    </div>
  );
}
