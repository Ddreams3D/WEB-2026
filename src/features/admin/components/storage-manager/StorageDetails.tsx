import React from 'react';
import { FileText, ExternalLink, Copy } from 'lucide-react';
import DefaultImage from '@/shared/components/ui/DefaultImage';
import { StorageItem } from '@/features/admin/hooks/useStorageManager';

interface StorageDetailsProps {
    selectedItem: StorageItem | null;
    copyToClipboard: (text: string) => void;
}

export function StorageDetails({ selectedItem, copyToClipboard }: StorageDetailsProps) {
    if (!selectedItem || selectedItem.type !== 'file') return null;

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
        <div className="w-80 flex-shrink-0 border-l bg-card p-6 overflow-y-auto">
            <div className="flex flex-col gap-6">
                <div className="aspect-square relative rounded-lg border bg-accent/20 overflow-hidden">
                    {selectedItem.contentType?.startsWith('image/') ? (
                        <DefaultImage
                            src={selectedItem.url}
                            alt={selectedItem.name}
                            fill
                            className="object-contain"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-16 h-16 text-muted-foreground" />
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="font-semibold break-words mb-2">{selectedItem.name}</h4>
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex justify-between border-b pb-2">
                            <span>Tamaño</span>
                            <span className="font-medium text-foreground">{formatSize(selectedItem.size)}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Tipo</span>
                            <span className="font-medium text-foreground">{selectedItem.contentType}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-b pb-2">
                            <span>Creado</span>
                            <span className="font-medium text-foreground">{formatDate(selectedItem.timeCreated)}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span>Ruta completa</span>
                            <code className="text-xs bg-muted p-1 rounded break-all">{selectedItem.fullPath}</code>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                    <button
                        onClick={() => window.open(selectedItem.url, '_blank')}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Abrir original
                    </button>
                    <button
                        onClick={() => copyToClipboard(selectedItem.url)}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                        <Copy className="w-4 h-4" />
                        Copiar URL
                    </button>
                </div>
            </div>
        </div>
    );
}
