import React from 'react';
import { Service } from '@/shared/types/domain';
import { StringListEditor } from '../AdminEditors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuración SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Slug (URL)</label>
                <div className="flex gap-2">
                    <span className="px-3 py-2 bg-muted border border-r-0 rounded-l-md text-muted-foreground text-sm flex items-center">
                        /servicios/
                    </span>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug || ''}
                        onChange={handleChange}
                        placeholder="url-del-servicio"
                        className="flex-1 px-4 py-2 border rounded-r-lg bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Identificador único para la URL. Se genera automáticamente del nombre si se deja vacío.
                </p>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Etiquetado</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <label className="text-sm font-medium">Etiquetas (Tags)</label>
                <div className="p-4 border rounded-lg bg-muted/20">
                    <StringListEditor
                        items={formData.tags || []}
                        onChange={updateTags}
                        placeholder="Ej. impresión 3d, diseño..."
                        addButtonText="Agregar Tag"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Las etiquetas ayudan a filtrar y encontrar el servicio en el catálogo.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
