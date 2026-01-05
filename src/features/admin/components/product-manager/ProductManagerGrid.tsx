import React from 'react';
import { Package, RotateCcw, Trash2, Edit } from '@/lib/icons';
import { Button } from '@/components/ui/button';
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
}

export function ProductManagerGrid({
    filteredProducts,
    showDeleted,
    mode,
    handleRestoreProduct,
    handlePermanentDeleteProduct,
    handleEditProduct,
    handleDeleteProduct
}: ProductManagerGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {filteredProducts.map((product) => (
      <div
        key={product.id}
        className="group bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        <div className="aspect-[4/3] relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
          {product.images && product.images.length > 0 ? (
             <ProductImage 
                src={product.images.find(i => i.isPrimary)?.url || product.images[0].url} 
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <Package className="w-12 h-12" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {showDeleted ? (
                <>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-green-500/80 hover:text-white"
                        onClick={() => handleRestoreProduct(product.id)}
                        title="Restaurar"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-red-500/80 hover:text-white"
                        onClick={() => handlePermanentDeleteProduct(product.id)}
                        title="Eliminar Definitivamente"
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </>
            ) : (
                <>
                    <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => handleEditProduct(product)}
                    >
                    <Edit className="w-5 h-5" />
                    </Button>
                    <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-red-500/80 hover:text-white"
                    onClick={() => handleDeleteProduct(product.id)}
                    >
                    <Trash2 className="w-5 h-5" />
                    </Button>
                </>
            )}
          </div>

          {mode === 'all' && (
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
                product.kind === 'service' 
                  ? 'bg-blue-100/90 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                  : 'bg-neutral-100/90 text-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-200'
              }`}>
                {product.kind === 'service' ? 'Servicio' : 'Producto'}
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="absolute top-2 right-2 z-20 bg-primary text-primary-foreground px-2 py-1 rounded-md text-[10px] font-bold shadow-md pointer-events-none uppercase tracking-wider border border-primary/20">
              Destacado
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
              {product.name}
            </h3>
            <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
                {product.kind === 'service' && (product as Service).customPriceDisplay 
                    ? (product as Service).customPriceDisplay
                    : `S/ ${product.price.toFixed(2)}`
                }
            </span>
          </div>
          
          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 h-10">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {product.categoryName}
            </span>
            <span className={`flex items-center gap-1.5 text-xs font-medium ${
                product.isActive ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                  product.isActive ? 'bg-green-500' : 'bg-amber-500'
              }`} />
              {product.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
  );
}
