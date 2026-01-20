import React, { useEffect, useRef, useState } from 'react';
import { Trash2, Copy, ExternalLink, FolderInput, X, MoreVertical } from 'lucide-react';
import { StorageItem, StorageFile } from '@/features/admin/hooks/useStorageManager';
import { toast } from 'sonner';

interface StorageContextMenuProps {
    item: StorageItem | null;
    x: number;
    y: number;
    onClose: () => void;
    onDelete: (item: StorageItem) => void;
    onCopyUrl: (url: string) => void;
    onMove?: (item: StorageFile, targetPath: string) => Promise<void>;
}

export function StorageContextMenu({ 
    item, 
    x, 
    y, 
    onClose, 
    onDelete, 
    onCopyUrl,
    onMove 
}: StorageContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: y, left: x });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Smart positioning to keep menu within viewport
    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            let newTop = y;
            let newLeft = x;

            // Check bottom edge
            if (y + rect.height > window.innerHeight) {
                newTop = y - rect.height;
            }
            
            // Check right edge
            if (x + rect.width > window.innerWidth) {
                newLeft = x - rect.width;
            }

            // Ensure non-negative
            setPosition({
                top: Math.max(0, newTop),
                left: Math.max(0, newLeft)
            });
        }
    }, [x, y]);

    if (!item) return null;

    return (
        <div 
            ref={menuRef}
            className="fixed z-50 w-56 bg-popover text-popover-foreground border rounded-md shadow-lg p-1 animate-in fade-in zoom-in-95 duration-100"
            style={{ top: position.top, left: position.left }}
        >
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1 truncate select-none">
                {item.name}
            </div>
            
            {item.type === 'file' && (
                <>
                    <button
                        onClick={() => {
                            onCopyUrl(item.url);
                            onClose();
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-left"
                    >
                        <Copy className="w-4 h-4" />
                        Copiar URL
                    </button>
                    
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-left"
                        onClick={onClose}
                    >
                        <ExternalLink className="w-4 h-4" />
                        Abrir en nueva pestaña
                    </a>
                </>
            )}

            {onMove && item.type === 'file' && (
                <button
                    onClick={() => {
                        // Placeholder for move functionality interaction
                        toast.info("Funcionalidad de mover pendiente de UI");
                        onClose();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-left"
                >
                    <FolderInput className="w-4 h-4" />
                    Mover a...
                </button>
            )}

            <div className="h-px bg-border my-1" />

            <button
                onClick={() => {
                    onDelete(item);
                    onClose();
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-destructive hover:text-destructive-foreground text-destructive cursor-pointer text-left"
            >
                <Trash2 className="w-4 h-4" />
                Eliminar
            </button>
        </div>
    );
}
