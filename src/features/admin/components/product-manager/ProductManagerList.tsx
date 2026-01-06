 'use client';
import React, { useRef } from 'react';
import { Package, Star } from '@/lib/icons';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { StoreProduct as Product, Service } from '@/shared/types/domain';

interface ProductManagerListProps {
    loading: boolean;
    filteredProducts: (Product | Service)[];
    mode: 'product' | 'service' | 'all';
    showDeleted: boolean;
    handleRestoreProduct: (id: string) => void;
    handlePermanentDeleteProduct: (id: string) => void;
    handleEditProduct: (product: Product | Service) => void;
    handleDeleteProduct: (id: string) => void;
}

export function ProductManagerList({
    loading,
    filteredProducts,
    mode,
    showDeleted,
    handleRestoreProduct,
    handlePermanentDeleteProduct,
    handleEditProduct,
    handleDeleteProduct
}: ProductManagerListProps) {
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
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
            <tr className="bg-neutral-50/50 dark:bg-neutral-800/30 border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-6 py-4 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Precio</th>
                {mode === 'all' && (
                <th className="px-6 py-4 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Tipo</th>
                )}
                <th className="px-6 py-4 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Estado</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {loading ? (
                <tr>
                <td colSpan={mode === 'all' ? 5 : 4} className="px-6 py-20 text-center text-neutral-500">
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Cargando catálogo...</span>
                    </div>
                </td>
                </tr>
            ) : filteredProducts.length === 0 ? (
                <tr>
                <td colSpan={mode === 'all' ? 5 : 4} className="px-6 py-20 text-center text-neutral-500">
                    <div className="flex flex-col items-center gap-2">
                        <Package className="w-8 h-8 text-neutral-300" />
                        <p className="text-sm">No se encontraron productos</p>
                    </div>
                </td>
                </tr>
            ) : (
                filteredProducts.map((product) => (
                <tr 
                    key={product.id} 
                    className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    onClick={() => handleSingleClick(product)}
                    onDoubleClick={() => handleDoubleClick(product)}
                >
                    <td className="px-6 py-3">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700 flex-shrink-0 relative">
                            {product.images?.[0] ? (
                            <ProductImage
                                src={product.images.find(i => i.isPrimary)?.url || product.images[0].url}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <Package className="w-4 h-4" />
                            </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                <span className="truncate max-w-[200px]" title={product.name}>
                                    {product.name}
                                </span>
                                {product.isFeatured && (
                                    <span title="Destacado">
                                        <Star className="w-3 h-3 text-primary fill-primary" />
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                        {product.categoryName || 'Sin cat.'}
                    </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {product.kind === 'service' && (product as Service).customPriceDisplay 
                        ? (product as Service).customPriceDisplay
                        : `S/ ${product.price.toFixed(2)}`
                    }
                    </td>
                    {mode === 'all' && (
                    <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                        product.kind === 'service' 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900'
                            : 'bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-neutral-100 dark:border-neutral-800'
                        }`}>
                        {product.kind === 'service' ? 'Servicio' : 'Producto'}
                        </span>
                    </td>
                    )}
                    <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'}`} />
                            <span className={`text-xs ${product.isActive ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400'}`}>
                                {product.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    </div>
  );
}
