'use client';

import ServiceManager from '@/features/admin/components/ServiceManager';

export default function ServicesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Gestión de Servicios
        </h1>
        <p className="text-muted-foreground">
          Administra tu catálogo de servicios, precios y descripciones.
        </p>
      </div>

      <ServiceManager />
    </div>
  );
}
