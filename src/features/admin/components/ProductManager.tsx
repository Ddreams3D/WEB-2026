'use client';

import React from 'react';
import ProductModal from './ProductModal';
import ConfirmationModal from './ConfirmationModal';
import { useProductManager } from '../hooks/useProductManager';
import { ProductManagerHeader } from './product-manager/ProductManagerHeader';
import { ProductManagerList } from './product-manager/ProductManagerList';
import { ProductManagerGrid } from './product-manager/ProductManagerGrid';

interface ProductManagerProps {
  mode?: 'product' | 'service' | 'all';
}

export default function ProductManager({ mode = 'all' }: ProductManagerProps) {
  const {
    loading,
    searchTerm,
    selectedProduct,
    isModalOpen,
    viewMode,
    showDeleted,
    filterActive,
    sortBy,
    sortDir,
    confirmation,
    categoryCounts,
    filteredProducts,
    setSearchTerm,
    setViewMode,
    setShowDeleted,
    setFilterActive,
    setSortBy,
    setSortDir,
    setIsModalOpen,
    loadProducts,
    handleAddProduct,
    handleEditProduct,
    closeConfirmation,
    handleDeleteProduct,
    handleRestoreProduct,
    handlePermanentDeleteProduct,
    handleSaveProduct
  } = useProductManager({ mode });

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        variant={confirmation.variant}
        isLoading={confirmation.isLoading}
      />
      
      <ProductManagerHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        loading={loading}
        loadProducts={loadProducts}
        showDeleted={showDeleted}
        setShowDeleted={setShowDeleted}
        filterActive={filterActive}
        setFilterActive={setFilterActive}
        sortBy={sortBy}
        sortDir={sortDir}
        setSortBy={setSortBy}
        setSortDir={setSortDir}
        mode={mode}
        handleAddProduct={handleAddProduct}
      />

      {viewMode === 'list' ? (
        <ProductManagerList
            loading={loading}
            filteredProducts={filteredProducts}
            mode={mode}
            showDeleted={showDeleted}
            handleRestoreProduct={handleRestoreProduct}
            handlePermanentDeleteProduct={handlePermanentDeleteProduct}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
        />
      ) : (
        <ProductManagerGrid
            filteredProducts={filteredProducts}
            showDeleted={showDeleted}
            mode={mode}
            handleRestoreProduct={handleRestoreProduct}
            handlePermanentDeleteProduct={handlePermanentDeleteProduct}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
        />
      )}
      
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        forcedType={mode === 'service' ? 'service' : mode === 'product' ? 'product' : undefined}
        categoryCounts={categoryCounts}
      />
    </div>
  );
}
