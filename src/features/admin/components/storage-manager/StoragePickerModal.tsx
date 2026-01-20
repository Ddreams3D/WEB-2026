import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStorageManager } from '@/features/admin/hooks/useStorageManager';
import { StorageSidebar } from './StorageSidebar';
import { StorageToolbar } from './StorageToolbar';
import { StorageGrid } from './StorageGrid';
import { Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface StoragePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export function StoragePickerModal({ isOpen, onClose, onSelect }: StoragePickerModalProps) {
    const {
        items,
        loading,
        viewMode,
        selectedItem,
        activeSection,
        currentPath,
        setViewMode,
        setSelectedItem,
        handleSectionChange,
        handleFolderClick,
        handleNavigateUp,
        loadFiles,
        isFileUsed,
        createFolder,
        uploadFile,
        loadMore,
        hasMore
    } = useStorageManager();

    // Reset selection when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setSelectedItem(null);
        }
    }, [isOpen, setSelectedItem]);

    const handleConfirm = () => {
        if (selectedItem && selectedItem.type === 'file') {
            onSelect(selectedItem.url);
            onClose();
        } else {
            toast.error('Por favor selecciona un archivo.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b bg-background z-10">
                    <DialogTitle>Biblioteca de Medios</DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Sidebar - Hidden on mobile, visible on lg */}
                    <div className="hidden lg:block w-64 border-r overflow-y-auto">
                        <StorageSidebar 
                            activeSection={activeSection} 
                            handleSectionChange={handleSectionChange} 
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col min-w-0 bg-neutral-50/50 dark:bg-neutral-900/50">
                        <div className="p-4 border-b bg-background">
                            <StorageToolbar
                                currentPath={currentPath}
                                loading={loading}
                                viewMode={viewMode}
                                setViewMode={setViewMode}
                                loadFiles={() => loadFiles(currentPath)}
                                handleNavigateUp={handleNavigateUp}
                                createFolder={createFolder}
                                uploadFile={uploadFile}
                            />
                        </div>

                        <div className="flex-1 overflow-hidden relative">
                            <StorageGrid
                                items={items}
                                loading={loading}
                                viewMode={viewMode}
                                onFileClick={(item) => setSelectedItem(item)}
                                onFolderClick={handleFolderClick}
                                onDelete={async () => {}} // Disable delete in picker
                                isFileUsed={isFileUsed}
                                onLoadMore={loadMore}
                                hasMore={hasMore}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-background z-10 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        {selectedItem ? (
                            <span className="font-medium text-foreground">
                                Seleccionado: {selectedItem.name}
                            </span>
                        ) : (
                            <span>Ningún archivo seleccionado</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirm} disabled={!selectedItem || selectedItem.type !== 'file'}>
                            <Check className="w-4 h-4 mr-2" />
                            Usar Seleccionado
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
