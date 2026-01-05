import React from 'react';
import { X } from 'lucide-react';
import { Service } from '@/shared/types/domain';
import ImageUpload from '../ImageUpload';
import { ProductImage } from '@/shared/components/ui/DefaultImage';

interface ServiceModalImagesProps {
  formData: Partial<Service>;
  handleImageUploaded: (url: string) => void;
  removeImage: (index: number) => void;
  setIsImageUploading: (isUploading: boolean) => void;
}

export function ServiceModalImages({
  formData,
  handleImageUploaded,
  removeImage,
  setIsImageUploading
}: ServiceModalImagesProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
        <h3 className="text-sm font-medium mb-4">Subir Nueva Imagen</h3>
        <ImageUpload
          value=""
          onChange={handleImageUploaded}
          onRemove={() => {}}
          onUploadStatusChange={setIsImageUploading}
          defaultName={formData.name}
          existingImages={formData.images || []}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {formData.images?.map((img, idx) => (
          <div key={idx} className="relative group border rounded-lg overflow-hidden bg-white dark:bg-neutral-800 shadow-sm">
            <div className="aspect-square relative">
               <ProductImage src={img.url} alt={img.alt} fill className="object-cover" />
            </div>

            {/* File Info Overlay - Always visible at bottom */}
            <div className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 border-t dark:border-neutral-700 text-[10px] leading-tight">
              <div className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {img.viewType ? img.viewType.toUpperCase() : 'SIN TIPO'}
              </div>
              <div className="text-neutral-500 truncate" title={decodeURIComponent(img.url.split('/').pop()?.split('?')[0] || '')}>
                  {(() => {
                       const full = decodeURIComponent(img.url.split('/').pop()?.split('?')[0] || '');
                       const underscoreIndex = full.indexOf('_');
                       return underscoreIndex !== -1 ? full.substring(underscoreIndex + 1) : full;
                  })()}
              </div>
            </div>

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 top-0 bottom-[36px]">
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                title="Eliminar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {img.isPrimary && (
              <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded shadow-sm">
                Principal
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
