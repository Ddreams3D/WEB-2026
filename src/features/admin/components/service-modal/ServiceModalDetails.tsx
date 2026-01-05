import React from 'react';
import { Service } from '@/shared/types/domain';
import { ProductSpecification } from '@/shared/types';
import { SpecificationsEditor } from '../AdminEditors';

interface ServiceModalDetailsProps {
  formData: Partial<Service>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  updateSpecs: (specs: ProductSpecification[]) => void;
}

export function ServiceModalDetails({
  formData,
  handleChange,
  updateSpecs
}: ServiceModalDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción Principal (Fallback)</label>
        <p className="text-xs text-muted-foreground mb-1">
          Esta descripción se muestra si no hay pestañas configuradas.
        </p>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700 font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Especificaciones Técnicas</label>
        <div className="p-4 border rounded-lg dark:border-neutral-700">
          <SpecificationsEditor 
            specs={formData.specifications || []} 
            onChange={updateSpecs} 
          />
        </div>
      </div>
    </div>
  );
}
