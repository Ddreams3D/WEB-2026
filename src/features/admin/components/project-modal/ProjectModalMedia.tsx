import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { PortfolioItem } from '@/shared/types/domain';

interface ProjectModalMediaProps {
  formData: Partial<PortfolioItem>;
  handleChange: (field: keyof PortfolioItem, value: unknown) => void;
  handleGalleryAdd: () => void;
  handleGalleryUpdate: (index: number, url: string) => void;
  handleGalleryRemove: (index: number) => void;
}

export function ProjectModalMedia({
  formData,
  handleChange,
  handleGalleryAdd,
  handleGalleryUpdate,
  handleGalleryRemove
}: ProjectModalMediaProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Imagen de Portada</h3>
        <div className="max-w-md">
          <ImageUpload
            value={formData.coverImage}
            onChange={(url) => handleChange('coverImage', url)}
            onRemove={() => handleChange('coverImage', '')}
            defaultName={formData.title}
            existingImages={[]} // Not strictly needed for cover
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Galería Adicional</h3>
          <Button onClick={handleGalleryAdd} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Agregar Imagen
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.galleryImages?.map((url, index) => (
            <div key={index} className="relative group border rounded-lg p-2">
              <ImageUpload
                value={url}
                onChange={(newUrl) => handleGalleryUpdate(index, newUrl)}
                onRemove={() => handleGalleryRemove(index)}
                defaultName={`${formData.title}-gallery-${index + 1}`}
                existingImages={[]}
              />
              <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => handleGalleryRemove(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {formData.galleryImages?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 bg-accent/20 rounded-lg">
            No hay imágenes adicionales. Agrega algunas para mostrar detalles.
          </p>
        )}
      </div>
    </div>
  );
}
