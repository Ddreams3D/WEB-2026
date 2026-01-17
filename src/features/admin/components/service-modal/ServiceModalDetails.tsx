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
  const isOrganicService =
    formData.slug === 'modelado-3d-personalizado' ||
    formData.slug === 'merchandising-3d-personalizado' ||
    formData.slug === 'trofeos-medallas-3d-personalizados' ||
    formData.slug === 'maquetas-didacticas-material-educativo-3d' ||
    formData.slug === 'proyectos-anatomicos-3d-personalizados';

  return (
    <div className="space-y-6">
      {!isOrganicService && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Especificaciones Técnicas</label>
          <div className="p-4 border rounded-lg dark:border-neutral-700">
            <SpecificationsEditor
              specs={formData.specifications || []}
              onChange={updateSpecs}
            />
          </div>
        </div>
      )}
    </div>
  );
}
