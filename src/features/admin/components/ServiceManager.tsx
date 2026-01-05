'use client';

import React from 'react';
import { useServiceManager } from '@/features/admin/hooks/useServiceManager';
import { ServiceManagerHeader } from './service-manager/ServiceManagerHeader';
import { ServiceManagerList } from './service-manager/ServiceManagerList';
import { ServiceManagerGrid } from './service-manager/ServiceManagerGrid';
import ServiceModal from './ServiceModal';
import ConfirmationModal from './ConfirmationModal';

export default function ServiceManager() {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    selectedService,
    isModalOpen,
    setIsModalOpen,
    isSeeding,
    viewMode,
    setViewMode,
    confirmation,
    closeConfirmation,
    handleAddService,
    handleEditService,
    handleDeleteService,
    handleSeed,
    handleSaveService,
    filteredServices
  } = useServiceManager();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        variant={confirmation.variant}
        isLoading={confirmation.isLoading}
      />
      
      <ServiceManagerHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isSeeding={isSeeding}
        handleSeed={handleSeed}
        handleAddService={handleAddService}
      />

      {viewMode === 'list' ? (
        <ServiceManagerList
            loading={loading}
            filteredServices={filteredServices}
            handleEditService={handleEditService}
            handleDeleteService={handleDeleteService}
        />
      ) : (
        <ServiceManagerGrid
            filteredServices={filteredServices}
            handleEditService={handleEditService}
            handleDeleteService={handleDeleteService}
        />
      )}

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
        service={selectedService}
      />
    </div>
  );
}
