import React from 'react';
import { Maximize2 } from 'lucide-react';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { ProductImage as ProductImageType } from '@/shared/types/domain';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: ProductImageType[];
  selectedImageId: string;
  selectedImage: ProductImageType | undefined;
  productName: string;
  onImageSelect: (id: string) => void;
  onOpenModal: () => void;
}

export function ProductImageGallery({
  images,
  selectedImageId,
  selectedImage,
  productName,
  onImageSelect,
  onOpenModal
}: ProductImageGalleryProps) {
  
  // Helper para ajustar el encuadre de imágenes específicas
  const getImageClassName = (imageId: string | undefined, isThumbnail: boolean = false) => {
    const baseClass = "object-cover";
    
    // Fix para product-2-b que está muy alejada (zoomed out)
    if (imageId === '2-b') {
       // Aplicar escala para hacer zoom
       if (isThumbnail) {
         return `${baseClass} scale-125`;
       }
       return `${baseClass} transition-transform duration-500 scale-125 hover:scale-[1.35]`;
    }
    
    if (isThumbnail) {
      return baseClass;
    }
    
    return `${baseClass} transition-transform duration-500 hover:scale-105`;
  };

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      <div 
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-sm cursor-zoom-in group",
          "bg-muted/30"
        )}
        onClick={onOpenModal}
      >
        <ProductImage
          src={selectedImage?.url}
          alt={selectedImage?.alt || productName}
          fill
          className={getImageClassName(selectedImage?.id)}
          priority
        />
        
        {/* Zoom Indicator - Bottom Right Corner */}
        <div className="absolute bottom-4 right-4 z-20 transition-all duration-300 transform group-hover:scale-110">
          <div className="bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md shadow-lg border border-white/10 hover:bg-black/80 transition-colors">
             <Maximize2 className="w-5 h-5" />
          </div>
        </div>
      </div>
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image) => (
            <div 
              key={image.id} 
              className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                selectedImageId === image.id 
                  ? 'border-primary ring-2 ring-primary/20 ring-offset-2 dark:ring-offset-background' 
                  : 'border-transparent hover:border-border'
              }`}
              onClick={() => onImageSelect(image.id)}
            >
              <ProductImage
                src={image.url}
                alt={image.alt}
                fill
                className={getImageClassName(image.id, true)}
                sizes="(max-width: 768px) 25vw, 15vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
