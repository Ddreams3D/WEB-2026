'use client';

import ProductManager from '@/components/admin/ProductManager';

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Gestión de Servicios
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Administra tu catálogo de servicios, precios y descripciones.
        </p>
      </div>

      <ProductManager mode="service" />
    </div>
  );
}
