import React from 'react';
import { Service } from '@/shared/types/domain';
import { StringListEditor } from '../AdminEditors';

interface ServiceModalSeoProps {
  formData: Partial<Service>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  updateTags: (tags: string[]) => void;
}

export function ServiceModalSeo({
  formData,
  handleChange,
  updateTags
}: ServiceModalSeoProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Slug (URL)</label>
        <input
            type="text"
            name="slug"
            value={formData.slug || ''}
            onChange={handleChange}
            placeholder="Generado automáticamente si se deja vacío"
            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
        />
        <p className="text-xs text-muted-foreground">
            Identificador único para la URL. Ej: impresion-3d-resina
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Etiquetas (Tags)</label>
        <div className="p-4 border rounded-lg dark:border-neutral-700">
            <StringListEditor
                items={formData.tags || []}
                onChange={updateTags}
                placeholder="Ej. impresión 3d, diseño..."
                addButtonText="Agregar Tag"
            />
        </div>
      </div>
    </div>
  );
}
