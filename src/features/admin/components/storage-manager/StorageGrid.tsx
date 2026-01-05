import React from 'react';
import { Loader2, FolderOpen, Folder, FileText, Image as ImageIcon } from 'lucide-react';
import DefaultImage from '@/shared/components/ui/DefaultImage';
import { StorageItem, ViewMode } from '@/features/admin/hooks/useStorageManager';

interface StorageGridProps {
    items: StorageItem[];
    loading: boolean;
    viewMode: ViewMode;
    selectedItem: StorageItem | null;
    setSelectedItem: (item: StorageItem | null) => void;
    handleFolderClick: (folderName: string) => void;
}

export function StorageGrid({
    items,
    loading,
    viewMode,
    selectedItem,
    setSelectedItem,
    handleFolderClick
}: StorageGridProps) {

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
        <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg bg-card/50">
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
                    {items.map((item) => (
                        <div
                            key={item.fullPath}
                            onClick={() => item.type === 'folder' ? handleFolderClick(item.name) : setSelectedItem(item)}
                            className={`
                                group relative aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md
                                ${selectedItem?.fullPath === item.fullPath ? 'ring-2 ring-primary border-primary' : 'border-border'}
                                ${item.type === 'folder' ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-background'}
                            `}
                        >
                            {item.type === 'folder' ? (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-blue-500 dark:text-blue-400">
                                    <Folder className="w-12 h-12 mb-2 fill-current opacity-20" />
                                    <span className="text-sm font-medium text-center line-clamp-2 px-2 text-foreground">
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
                    ))}
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
                            {items.map((item) => (
                                <tr
                                    key={item.fullPath}
                                    onClick={() => item.type === 'folder' ? handleFolderClick(item.name) : setSelectedItem(item)}
                                    className={`
                                        cursor-pointer hover:bg-accent/50 transition-colors
                                        ${selectedItem?.fullPath === item.fullPath ? 'bg-accent' : ''}
                                    `}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {item.type === 'folder' ? (
                                                <Folder className="w-5 h-5 text-blue-500" />
                                            ) : item.contentType?.startsWith('image/') ? (
                                                <ImageIcon className="w-5 h-5 text-purple-500" />
                                            ) : (
                                                <FileText className="w-5 h-5 text-muted-foreground" />
                                            )}
                                            <span className="truncate max-w-[300px]">{item.name}</span>
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
