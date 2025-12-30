'use client';

import React from 'react';
import ProductManager from '@/components/admin/ProductManager';

export default function ProductsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Gestión de Productos
        </h1>
        <p className="text-muted-foreground">
          Administra tu inventario de productos físicos, stock y precios.
        </p>
      </div>

      <ProductManager mode="product" />
    </div>
  );
}
