 'use client';
 import React, { useRef } from 'react';
 import { Package, Star, Plus } from '@/lib/icons';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { StoreProduct as Product, Service } from '@/shared/types/domain';

interface ProductManagerGridProps {
    filteredProducts: (Product | Service)[];
    showDeleted: boolean;
    mode: 'product' | 'service' | 'all';
    handleRestoreProduct: (id: string) => void;
    handlePermanentDeleteProduct: (id: string) => void;
    handleEditProduct: (product: Product | Service) => void;
    handleDeleteProduct: (id: string) => void;
    handleAddProduct: () => void;
}

export function ProductManagerGrid({
    filteredProducts,
    showDeleted,
    mode,
    handleRestoreProduct,
    handlePermanentDeleteProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleAddProduct
}: ProductManagerGridProps) {
   const clickTimer = useRef<number | null>(null);
   const lastClickedId = useRef<string | null>(null);
 
   const handleSingleClick = (product: Product | Service) => {
     lastClickedId.current = product.id;
     if (clickTimer.current) {
       clearTimeout(clickTimer.current);
       clickTimer.current = null;
     }
     clickTimer.current = window.setTimeout(() => {
       if (lastClickedId.current === product.id) {
         handleEditProduct(product);
       }
       lastClickedId.current = null;
       clickTimer.current = null;
     }, 220);
   };
 
   const handleDoubleClick = (product: Product | Service) => {
     if (clickTimer.current) {
       clearTimeout(clickTimer.current);
       clickTimer.current = null;
     }
     lastClickedId.current = null;
     if (showDeleted) {
       handlePermanentDeleteProduct(product.id);
     } else {
       handleDeleteProduct(product.id);
     }
   };
   return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {/* Add New Product Card */}
      {!showDeleted && (
        <div 
          onClick={handleAddProduct}
          className="group flex flex-col items-center justify-center bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-lg hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-300 min-h-[250px]"
        >
          <div className="p-4 rounded-full bg-background shadow-sm group-hover:scale-110 transition-transform duration-300 mb-3">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">Crear Nuevo</span>
        </div>
      )}

     {filteredProducts.map((product) => (
       <div
         key={product.id}
       className="group bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-300 overflow-hidden relative cursor-pointer flex flex-col h-full"
        onClick={() => handleSingleClick(product)}
        onDoubleClick={() => handleDoubleClick(product)}
       >
        
 
        <div className="aspect-square relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
          {product.images && product.images.length > 0 ? (
             <ProductImage 
                src={product.images.find(i => i.isPrimary)?.url || product.images[0].url} 
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <Package className="w-10 h-10 opacity-20" />
            </div>
          )}
          
          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="absolute top-2 left-2 z-10">
                 <div className="bg-primary text-primary-foreground p-1 rounded-full shadow-sm backdrop-blur-sm">
                    <Star className="w-3 h-3 fill-current" />
                 </div>
            </div>
          )}
        </div>
 
       <div className="p-3 flex flex-col justify-between flex-1">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3
              className="font-medium text-sm text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2 break-words flex-1"
              title={product.name}
            >
              {product.name}
            </h3>
            <span className="font-semibold text-sm text-neutral-900 dark:text-white shrink-0">
                {product.kind === 'service' && (product as Service).customPriceDisplay 
                    ? (product as Service).customPriceDisplay
                    : `S/ ${product.price.toFixed(2)}`
                }
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 truncate max-w-[60%]">
              {product.categoryName || 'Sin categoría'}
            </span>
            
            <div className="flex items-center gap-1.5" title={product.isActive ? 'Activo' : 'Inactivo'}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                  product.isActive ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]' : 'bg-neutral-300 dark:bg-neutral-600'
              }`} />
            </div>
          </div>
        </div>
       </div>
     ))}
   </div>
   );
 }
