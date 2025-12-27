'use client';

import React from 'react';
import AdminProtection from '@/components/admin/AdminProtection';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import ProductManager from '@/components/admin/ProductManager';

export default function ProductsPage() {
  return (
    <AdminProtection requiredRole="admin">
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <ProductManager />
        </div>
      </AdminLayout>
    </AdminProtection>
  );
}