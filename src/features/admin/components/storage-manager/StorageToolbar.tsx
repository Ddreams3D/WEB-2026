import React, { useState, useRef } from 'react';
import { ArrowUp, Home, ChevronRight, RefreshCw, Grid, List as ListIcon, FolderPlus, Upload, Wand2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ViewMode, StorageProgress } from '@/features/admin/hooks/useStorageManager';

interface StorageToolbarProps {
    currentPath: string;
    loading: boolean;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    loadFiles: (path: string) => void;
    handleNavigateUp: () => void;
    createFolder: (name: string) => Promise<void>;
    progress?: StorageProgress | null;
    uploadFile?: (file: File) => Promise<void>;
    onMigrate?: () => Promise<void>; // Add prop
    onScanDuplicates?: () => void; // Add prop
}

export function StorageToolbar({
    currentPath,
    loading,
    viewMode,
    setViewMode,
    loadFiles,
    handleNavigateUp,
    createFolder,
    progress,
    uploadFile,
    onMigrate, // Destructure prop
    onScanDuplicates // Destructure prop
}: StorageToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateFolder = () => {
        const name = window.prompt('Nombre de la nueva carpeta:');
        if (name && name.trim()) {
            createFolder(name.trim());
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && uploadFile) {
            // For now, single file upload logic as per hook, but we could loop
            // Since hook takes 1 file, let's just do the first one or loop if we update hook
            for (let i = 0; i < files.length; i++) {
                await uploadFile(files[i]);
            }
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col gap-4 mb-6">
            {/* Progress Bar Overlay/Banner */}
            {progress && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center text-sm font-medium text-blue-700">
                            <span>{progress.message}</span>
                            {progress.total > 0 && (
                                <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                            )}
                        </div>
                        {progress.total > 0 && (
                            <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
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
                    size="sm"
                    onClick={handleCreateFolder}
                    title="Crear carpeta"
                    className="gap-2"
                >
                    <FolderPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Nueva Carpeta</span>
                </Button>

                {/* Upload Button */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept="image/*" // Restrict to images for now as per user context
                    multiple
                />
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleUploadClick}
                    title="Subir Imágenes"
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Subir</span>
                </Button>

                {onScanDuplicates && (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onScanDuplicates}
                        title="Escanear Duplicados"
                        className="gap-2"
                    >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Auditar</span>
                    </Button>
                )}

                {onMigrate && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (window.confirm('¿Estás seguro de migrar la estructura antigua a la nueva? Esto moverá archivos y actualizará referencias.')) {
                                onMigrate();
                            }
                        }}
                        title="Migrar Estructura Legacy"
                        className="gap-2"
                    >
                        <Wand2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Migrar Estructura</span>
                    </Button>
                )}

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
        </div>
    );
}
