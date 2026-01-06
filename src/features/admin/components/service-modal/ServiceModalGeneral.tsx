import React from 'react';
import { Service } from '@/shared/types/domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="space-y-6">
      {/* Description Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Descripción Corta</label>
                <textarea
                    name="shortDescription"
                    value={formData.shortDescription || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Breve resumen del servicio que aparecerá en las tarjetas..."
                />
                <p className="text-xs text-muted-foreground">Esta descripción aparece en el catálogo principal.</p>
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pricing & Display Card */}
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Visualización de Precio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Texto Personalizado</label>
                    <input
                        type="text"
                        name="customPriceDisplay"
                        value={formData.customPriceDisplay || ''}
                        onChange={handleChange}
                        placeholder="Ej. Cotización personalizada"
                        className="w-full px-4 py-2 bg-background border rounded-lg text-sm"
                    />
                    <p className="text-[10px] text-muted-foreground">Reemplaza el precio numérico si se llena.</p>
                </div>
            </CardContent>
        </Card>

        {/* Organization Card */}
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Organización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-background border rounded-lg text-sm"
                    >
                        {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Orden</label>
                        <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder ?? 0}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-background border rounded-lg text-sm"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between pt-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured || false}
                                onChange={handleCheckboxChange}
                                className="w-4 h-4 accent-primary"
                            />
                            <span className="text-sm font-medium">Destacado</span>
                        </label>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
