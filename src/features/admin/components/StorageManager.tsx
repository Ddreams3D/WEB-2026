'use client';

import React, { useState } from 'react';
import { useStorageManager } from '@/features/admin/hooks/useStorageManager';
import { useStorageAudit } from '@/features/admin/hooks/useStorageAudit';
import { StorageSidebar } from './storage-manager/StorageSidebar';
import { StorageToolbar } from './storage-manager/StorageToolbar';
import { StorageGrid } from './storage-manager/StorageGrid';
import { StorageDetails } from './storage-manager/StorageDetails';
import { DuplicateScannerModal } from './storage-manager/DuplicateScannerModal';

export default function StorageManager() {
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    
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
        loadFiles,
        isFileUsed,
        createFolder,
        moveFile,
        deleteFile,
        progress,
        uploadFile,
        migrateStructure,
        updateReferences,
        loadMore,
        hasMore
    } = useStorageManager();

    const {
        scanning: auditScanning,
        progress: auditProgress,
        duplicates,
        scanDuplicates,
        cleanDuplicates
    } = useStorageAudit();

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            <DuplicateScannerModal 
                isOpen={isAuditOpen}
                onClose={() => setIsAuditOpen(false)}
                duplicates={duplicates}
                scanning={auditScanning}
                progress={auditProgress}
                onScan={scanDuplicates}
                onClean={() => cleanDuplicates(updateReferences)}
            />

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
                    createFolder={createFolder}
                    progress={progress}
                    uploadFile={uploadFile}
                    onMigrate={migrateStructure}
                    onScanDuplicates={() => setIsAuditOpen(true)}
                />

                <StorageGrid
                    items={items}
                    loading={loading}
                    viewMode={viewMode}
                    onFileClick={setSelectedItem}
                    onFolderClick={handleFolderClick}
                    onDelete={deleteFile}
                    onMove={moveFile}
                    onCopyUrl={copyToClipboard}
                    isFileUsed={isFileUsed}
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                />
            </div>

            <StorageDetails 
                selectedItem={selectedItem} 
                copyToClipboard={copyToClipboard}
                moveFile={moveFile}
                currentPath={currentPath}
            />
        </div>
    );
}
