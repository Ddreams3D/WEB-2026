'use client';

import { useStorageManager } from '@/features/admin/hooks/useStorageManager';
import { StorageSidebar } from './storage-manager/StorageSidebar';
import { StorageToolbar } from './storage-manager/StorageToolbar';
import { StorageGrid } from './storage-manager/StorageGrid';
import { StorageDetails } from './storage-manager/StorageDetails';

export default function StorageManager() {
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
        copyToClipboard,
        loadFiles
    } = useStorageManager();

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            <StorageSidebar 
                activeSection={activeSection} 
                handleSectionChange={handleSectionChange} 
            />

            <div className="flex-1 flex flex-col min-w-0">
                <StorageToolbar
                    currentPath={currentPath}
                    loading={loading}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    loadFiles={loadFiles}
                    handleNavigateUp={handleNavigateUp}
                />

                <StorageGrid
                    items={items}
                    loading={loading}
                    viewMode={viewMode}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    handleFolderClick={handleFolderClick}
                />
            </div>

            <StorageDetails 
                selectedItem={selectedItem} 
                copyToClipboard={copyToClipboard} 
            />
        </div>
    );
}
