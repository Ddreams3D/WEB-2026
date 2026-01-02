'use client';

import React from 'react';
import StorageManager from '@/features/admin/components/StorageManager';

export default function StoragePage() {
  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Gestión de Archivos Cloud
        </h1>
        <p className="text-muted-foreground">
          Explora, administra y limpia las imágenes almacenadas en Firebase Storage.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <StorageManager />
      </div>
    </div>
  );
}
