import React from 'react';
import { Service } from '@/shared/types/domain';

interface ServiceModalGeneralProps {
  formData: Partial<Service>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categories: { id: string; name: string }[];
}

export function ServiceModalGeneral({
  formData,
  handleChange,
  handleCheckboxChange,
  categories
}: ServiceModalGeneralProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Main Info */}
      <div className="lg:col-span-2 space-y-6">
         <div className="p-4 bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Nombre del Servicio</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    placeholder="Ej. Impresión 3D Personalizada"
                    className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Descripción Corta</label>
                <textarea
                    name="shortDescription"
                    value={formData.shortDescription || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Breve resumen del servicio..."
                />
            </div>
         </div>
      </div>

      {/* Right Column: Status & Metadata */}
      <div className="space-y-6">
         {/* Status Card */}
         <div className="p-4 bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
            <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 border-b pb-2 dark:border-neutral-700">Visibilidad</h3>
            
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                <span className="text-sm font-medium">Activo</span>
                <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive || false}
                onChange={handleCheckboxChange}
                className="w-5 h-5 accent-primary"
                />
            </label>
            
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                <span className="text-sm font-medium">Destacado</span>
                <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured || false}
                onChange={handleCheckboxChange}
                className="w-5 h-5 accent-primary"
                />
            </label>

            <div className="space-y-2 pt-2">
                <label className="text-xs font-medium uppercase text-neutral-500">Orden</label>
                <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder ?? 0}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-neutral-800 border rounded-lg"
                />
            </div>
         </div>

         {/* Pricing Card */}
         <div className="p-4 bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
            <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 border-b pb-2 dark:border-neutral-700">Precio</h3>
            <div className="space-y-2">
                <label className="text-sm font-medium">Texto a Mostrar</label>
                <input
                    type="text"
                    name="customPriceDisplay"
                    value={formData.customPriceDisplay || ''}
                    onChange={handleChange}
                    placeholder="Ej. Cotización personalizada"
                    className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border rounded-lg text-sm"
                />
                <p className="text-[10px] text-muted-foreground">Lo que ven los clientes.</p>
            </div>
         </div>

         {/* Organization Card */}
         <div className="p-4 bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
            <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 border-b pb-2 dark:border-neutral-700">Organización</h3>
            <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
                <select
                    name="categoryId"
                    value={formData.categoryId || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border rounded-lg"
                >
                    {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
         </div>
      </div>
    </div>
  );
}
