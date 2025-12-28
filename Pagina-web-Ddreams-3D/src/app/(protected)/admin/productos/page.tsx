'use client';

import React from 'react';
import ProductManager from '@/components/admin/ProductManager';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProductManager />
    </div>
  );
}