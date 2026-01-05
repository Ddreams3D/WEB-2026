import React from 'react';
import { ArrowUp, Home, ChevronRight, RefreshCw, Grid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/features/admin/hooks/useStorageManager';

interface StorageToolbarProps {
    currentPath: string;
    loading: boolean;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    loadFiles: (path: string) => void;
    handleNavigateUp: () => void;
}

export function StorageToolbar({
    currentPath,
    loading,
    viewMode,
    setViewMode,
    loadFiles,
    handleNavigateUp
}: StorageToolbarProps) {
    return (
        <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 overflow-hidden">
                <button 
                    onClick={handleNavigateUp}
                    disabled={!currentPath}
                    className="p-2 hover:bg-accent rounded-full disabled:opacity-30"
                    title="Subir un nivel"
                >
                    <ArrowUp className="w-4 h-4" />
                </button>
                
                <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                    <Home className="w-4 h-4 mr-1" />
                    <span className="mx-1">/</span>
                    {currentPath.split('/').filter(Boolean).map((part, index, arr) => (
                        <span key={index} className="flex items-center">
                            <span className={index === arr.length - 1 ? "font-medium text-foreground" : ""}>
                                {part}
                            </span>
                            {index < arr.length - 1 && <ChevronRight className="w-3 h-3 mx-1" />}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => loadFiles(currentPath)}
                    title="Recargar"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                
                <div className="flex border rounded-md overflow-hidden">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}
                        title="Vista Cuadrícula"
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}
                        title="Vista Lista"
                    >
                        <ListIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
