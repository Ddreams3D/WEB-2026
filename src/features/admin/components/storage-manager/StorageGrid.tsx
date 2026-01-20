import React, { useState } from 'react';
import { 
    Loader2, FolderOpen, Folder, FileText, Image as ImageIcon, CheckCircle2, ShieldCheck,
    ShoppingBag, Layers, Briefcase, Calendar, LayoutTemplate, Home, ArchiveRestore,
    BadgeDollarSign, Component, Palette, BookOpen, HelpCircle, Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DefaultImage from '@/shared/components/ui/DefaultImage';
import { StorageItem, StorageFile, ViewMode } from '@/features/admin/hooks/useStorageManager';
import { StorageContextMenu } from './StorageContextMenu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StorageGridProps {
    items: StorageItem[];
    loading: boolean;
    viewMode: ViewMode;
    onFileClick: (item: StorageItem) => void;
    onFolderClick: (folderName: string) => void;
    onDelete: (item: StorageItem) => Promise<void>;
    onMove?: (item: StorageFile, targetPath: string) => Promise<void>;
    onCopyUrl?: (url: string) => void;
    isFileUsed: (url: string) => boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    // Multi-select props
    multiSelectMode?: boolean;
    selectedItems?: Set<string>;
}

import { STORAGE_PATHS } from '@/shared/constants/storage-paths';
import { cn } from '@/lib/utils';

const OFFICIAL_PATHS = new Set([
    STORAGE_PATHS.IMAGES,
    STORAGE_PATHS.FINANCES,
    STORAGE_PATHS.ASSETS,
    STORAGE_PATHS.LANDINGS,
    STORAGE_PATHS.PRODUCTS,
    STORAGE_PATHS.SEASONAL,
    STORAGE_PATHS.SERVICES,
    STORAGE_PATHS.PROJECTS,
    STORAGE_PATHS.CATEGORIES,
    STORAGE_PATHS.SOPORTES,
    STORAGE_PATHS.UI,
    STORAGE_PATHS.BLOG,
    STORAGE_PATHS.HOME,
    STORAGE_PATHS.COMPANY,
    'images/recuperado'
]);

const isOfficialFolder = (fullPath: string) => {
    const normalizedPath = fullPath.replace(/\/+$/, '');
    return OFFICIAL_PATHS.has(normalizedPath);
};

const getFolderIcon = (fullPath: string, className: string) => {
    const normalized = fullPath.replace(/\/+$/, '');
    
    // Exact matches
    switch (normalized) {
        case STORAGE_PATHS.IMAGES: return <ImageIcon className={className} />;
        case STORAGE_PATHS.FINANCES: return <BadgeDollarSign className={className} />;
        case STORAGE_PATHS.ASSETS: return <Component className={className} />;
        case STORAGE_PATHS.LANDINGS: return <LayoutTemplate className={className} />;
        case STORAGE_PATHS.PRODUCTS: return <ShoppingBag className={className} />;
        case STORAGE_PATHS.SERVICES: return <Layers className={className} />;
        case STORAGE_PATHS.PROJECTS: return <Briefcase className={className} />;
        case 'images/seasonal': return <Calendar className={className} />;
        case 'images/categories': return <Palette className={className} />;
        case 'images/soportes': return <HelpCircle className={className} />;
        case 'images/ui': return <Layout className={className} />;
        case 'images/blog': return <BookOpen className={className} />;
        case 'images/home': return <Home className={className} />;
        case 'images/recuperado': return <ArchiveRestore className={className} />;
    }

    // Prefix matches for subfolders (optional, or keep generic)
    if (normalized.startsWith('images/landings/')) return <LayoutTemplate className={className} />;
    if (normalized.startsWith('images/seasonal/')) return <Calendar className={className} />;

    return <Folder className={className} />;
};

export function StorageGrid({
    items,
    loading,
    viewMode,
    onFileClick,
    onFolderClick,
    onDelete,
    onMove,
    onCopyUrl,
    isFileUsed,
    onLoadMore,
    hasMore,
    multiSelectMode,
    selectedItems
}: StorageGridProps) {
    // Local state for context menu
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: StorageItem } | null>(null);
    const [itemToDelete, setItemToDelete] = useState<StorageItem | null>(null);
    const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);

    const handleContextMenu = (e: React.MouseEvent, item: StorageItem) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, item });
        setSelectedItem(item);
    };

    const handleItemClick = (item: StorageItem) => {
        if (item.type === 'folder') {
            onFolderClick(item.name);
        } else {
            setSelectedItem(item);
            onFileClick(item);
        }
    };

    const handleDeleteRequest = (item: StorageItem) => {
        setItemToDelete(item);
        setContextMenu(null);
    };

    const confirmDelete = () => {
        if (itemToDelete && onDelete) {
            onDelete(itemToDelete);
            setItemToDelete(null);
        }
    };

    // Double tap / Double click handling
    const [lastTap, setLastTap] = useState<{time: number, id: string} | null>(null);

    const handleInteraction = (e: React.MouseEvent, item: StorageItem) => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (lastTap && lastTap.id === item.fullPath && (now - lastTap.time) < DOUBLE_TAP_DELAY) {
            // Double tap detected -> Open context menu
            setContextMenu({ x: e.clientX, y: e.clientY, item });
            setLastTap(null); // Reset
            e.preventDefault(); // Prevent zoom or other defaults
        } else {
            // Single tap
            setLastTap({ time: now, id: item.fullPath });
            // Execute normal click logic
            if (item.type === 'folder') {
                onFolderClick(item.name);
            } else {
                setSelectedItem(item);
            }
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg bg-card/50 relative">
            {contextMenu && (
                <StorageContextMenu
                    item={contextMenu.item}
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    onDelete={handleDeleteRequest}
                    onCopyUrl={onCopyUrl || ((url) => navigator.clipboard.writeText(url))}
                    onMove={onMove}
                />
            )}

            <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Estás seguro?</DialogTitle>
                        <DialogDescription>
                            Se eliminará permanentemente: <strong>{itemToDelete?.name}</strong>
                            <br />
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setItemToDelete(null)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Sí, Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Cargando archivos...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mb-4 opacity-20" />
                    <p>Carpeta vacía</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {items.map((item) => {
                        const isUsed = item.type === 'file' && isFileUsed?.(item.url);
                        const isOfficial = item.type === 'folder' && isOfficialFolder(item.fullPath);
                        const isSelected = selectedItems?.has(item.fullPath);
                        
                        return (
                        <div
                            key={item.fullPath}
                            onClick={(e) => {
                                if (multiSelectMode && item.type === 'file') {
                                    onFileClick(item);
                                } else {
                                    handleInteraction(e, item);
                                }
                            }}
                            onContextMenu={(e) => handleContextMenu(e, item)}
                            className={cn(
                                "group relative aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md",
                                isSelected || selectedItem?.fullPath === item.fullPath 
                                    ? 'ring-2 ring-primary border-primary' 
                                    : isUsed 
                                        ? 'ring-2 ring-green-500/70 border-green-500' 
                                        : isOfficial
                                            ? 'ring-1 ring-emerald-500/30 border-emerald-500/50 bg-emerald-50/10'
                                            : 'border-border',
                                item.type === 'folder' ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-background'
                            )}
                        >
                            {/* Multi-select Checkbox Overlay */}
                            {multiSelectMode && item.type === 'file' && (
                                <div className={cn(
                                    "absolute top-2 right-2 z-20 w-5 h-5 rounded-full border border-white/50 flex items-center justify-center transition-all",
                                    isSelected ? "bg-primary border-primary" : "bg-black/30 hover:bg-black/50"
                                )}>
                                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                            )}

                            {!multiSelectMode && isUsed && (
                                <div className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full p-1 shadow-sm" title="En uso">
                                    <CheckCircle2 className="w-3 h-3" />
                                </div>
                            )}

                            {isOfficial && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="absolute top-2 right-2 z-10 bg-emerald-500 text-white rounded-full p-1 shadow-sm cursor-help">
                                                <ShieldCheck className="w-3 h-3" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Carpeta del Sistema (Oficial)</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            {item.type === 'folder' ? (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-blue-500 dark:text-blue-400">
                                    {getFolderIcon(item.fullPath, `w-12 h-12 mb-2 fill-current opacity-20 ${isOfficial ? 'text-emerald-500' : ''}`)}
                                    <span className={`text-sm font-medium text-center line-clamp-2 px-2 ${isOfficial ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                                        {item.name}
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className="relative w-full h-full">
                                        {item.contentType?.startsWith('image/') ? (
                                            <DefaultImage
                                                src={item.url}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-accent/20">
                                                <FileText className="w-10 h-10 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-xs text-white truncate">{item.name}</p>
                                        <p className="text-[10px] text-white/70">{formatSize(item.size)}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                    })}
                </div>
            ) : (
                <div className="w-full">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b sticky top-0">
                            <tr>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3 w-32">Tamaño</th>
                                <th className="px-4 py-3 w-32">Tipo</th>
                                <th className="px-4 py-3 w-48">Creado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items.map((item) => {
                                const isUsed = item.type === 'file' && isFileUsed?.(item.url);
                                const isOfficial = item.type === 'folder' && isOfficialFolder(item.fullPath);
                                
                                return (
                                <tr
                                    key={item.fullPath}
                                    onClick={() => item.type === 'folder' ? onFolderClick(item.name) : setSelectedItem(item)}
                                    onContextMenu={(e) => handleContextMenu(e, item)}
                                    className={`
                                        cursor-pointer hover:bg-accent/50 transition-colors
                                        ${selectedItem?.fullPath === item.fullPath ? 'bg-accent' : ''}
                                        ${isUsed && selectedItem?.fullPath !== item.fullPath ? 'bg-green-50/30 dark:bg-green-900/10' : ''}
                                        ${isOfficial && !selectedItem ? 'bg-emerald-50/10' : ''}
                                    `}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {item.type === 'folder' ? (
                                                getFolderIcon(item.fullPath, `w-5 h-5 ${isOfficial ? 'text-emerald-500' : 'text-blue-500'}`)
                                            ) : item.contentType?.startsWith('image/') ? (
                                                <ImageIcon className="w-5 h-5 text-purple-500" />
                                            ) : (
                                                <FileText className="w-5 h-5 text-muted-foreground" />
                                            )}
                                            <span className={`truncate max-w-[300px] ${isOfficial ? 'font-medium text-emerald-700 dark:text-emerald-400' : ''}`}>
                                                {item.name}
                                            </span>
                                            {isOfficial && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <ShieldCheck className="w-4 h-4 text-emerald-500 ml-1" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Carpeta del Sistema (Oficial)</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            {isUsed && (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-medium border border-green-200 dark:border-green-800">
                                                    En uso
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {item.type === 'file' ? formatSize(item.size) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {item.type === 'file' ? item.contentType : 'Carpeta'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {item.type === 'file' && item.timeCreated ? formatDate(item.timeCreated) : '-'}
                                    </td>
                                </tr>
                            );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center py-6 border-t mt-4 bg-muted/5">
                    <Button 
                        variant="secondary" 
                        size="lg"
                        onClick={(e) => {
                            e.stopPropagation();
                            onLoadMore?.();
                        }}
                        disabled={loading}
                        className="min-w-[200px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cargando...
                            </>
                        ) : (
                            <>
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Cargar más archivos
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
