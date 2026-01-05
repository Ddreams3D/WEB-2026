import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { Product, Service, ProductImage as ProductImageType } from '@/shared/types/domain';

interface ProductImageModalProps {
  product: Product | Service;
  selectedImage: ProductImageType | null;
  selectedImageId: string;
  isOpen: boolean;
  onClose: () => void;
  onNext: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
}

export function ProductImageModal({
  product,
  selectedImage,
  selectedImageId,
  isOpen,
  onClose,
  onNext,
  onPrev
}: ProductImageModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-6 right-6 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 z-[60] rounded-full h-12 w-12 backdrop-blur-md transition-all duration-300 border border-white/10 hover:rotate-90"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Main Stage Container */}
      <div 
        className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
         {/* Interactive Zone Container */}
         <div className="relative w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center pointer-events-auto group/stage">
           
           {/* Navigation */}
           {product.images && product.images.length > 1 && (
             <>
               <div className="absolute inset-y-0 left-0 w-[15%] flex items-center justify-start z-50 hover:bg-gradient-to-r hover:from-black/20 hover:to-transparent transition-all duration-500 group/nav-left cursor-pointer" onClick={onPrev}>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="ml-4 md:ml-8 text-white/30 group-hover/nav-left:text-white/90 group-hover/nav-left:bg-black/40 group-hover/nav-left:scale-110 rounded-full h-12 w-12 md:h-16 md:w-16 transition-all duration-300"
                 >
                    <ChevronLeft className="w-10 h-10" />
                 </Button>
               </div>
               
               <div className="absolute inset-y-0 right-0 w-[15%] flex items-center justify-end z-50 hover:bg-gradient-to-l hover:from-black/20 hover:to-transparent transition-all duration-500 group/nav-right cursor-pointer" onClick={onNext}>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="mr-4 md:mr-8 text-white/30 group-hover/nav-right:text-white/90 group-hover/nav-right:bg-black/40 group-hover/nav-right:scale-110 rounded-full h-12 w-12 md:h-16 md:w-16 transition-all duration-300"
                 >
                    <ChevronRight className="w-10 h-10" />
                 </Button>
               </div>
             </>
           )}

           {/* Image Container */}
           <div className="relative w-full h-full flex items-center justify-center p-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none"></div>

              <ProductImage
                src={selectedImage?.url}
                alt={selectedImage?.alt || product.name}
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10"
                priority
                sizes="95vw"
              />
              
              {/* Caption / Counter */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/stage:opacity-100 transition-opacity duration-500 delay-150 flex items-center gap-3 text-xs font-medium px-4 py-2 bg-black/60 rounded-full backdrop-blur-xl border border-white/10 shadow-2xl whitespace-nowrap max-w-[80%] overflow-hidden pointer-events-none z-20">
                  <span className="truncate max-w-[300px] text-white/90 tracking-wide">{selectedImage?.alt || product.name}</span>
                  <span className="w-px h-3 bg-white/20 shrink-0"></span>
                  <span className="shrink-0 text-white/50">{(product.images || []).findIndex(img => img.id === selectedImageId) + 1} <span className="text-white/30 text-[10px] mx-0.5">/</span> {(product.images || []).length}</span>
              </div>
           </div>
         </div>
      </div>
    </div>
  );
}
