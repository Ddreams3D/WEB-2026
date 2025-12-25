'use client';

import React from 'react';
import AdminProtection from '@/components/admin/AdminProtection';
import ProductManager from '@/components/admin/ProductManager';

export default function ProductsPage() {
  return (
    <AdminProtection requiredRole="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ProductManager />
      </div>
    </AdminProtection>
  );
}