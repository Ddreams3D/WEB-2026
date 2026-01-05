import React from 'react';
import { Package, Star, RotateCcw, Trash2, Edit } from '@/lib/icons';
import { Button } from '@/components/ui/button';
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
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Precio</th>
                {mode === 'all' && (
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Tipo</th>
                )}
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Acciones</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {loading ? (
                <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Cargando catálogo...
                    </div>
                </td>
                </tr>
            ) : filteredProducts.length === 0 ? (
                <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    <div className="flex flex-col items-center gap-2">
                        <Package className="w-8 h-8 text-neutral-300" />
                        <p>No se encontraron productos</p>
                    </div>
                </td>
                </tr>
            ) : (
                filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                            {product.images?.[0] ? (
                            <ProductImage
                                src={product.images.find(i => i.isPrimary)?.url || product.images[0].url}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <Package className="w-5 h-5" />
                            </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                                <span className="truncate max-w-[200px]" title={product.name}>
                                    {product.name}
                                </span>
                                {product.isFeatured && (
                                    <span title="Destacado">
                                        <Star className="w-3 h-3 text-primary fill-primary" />
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-neutral-500 truncate max-w-[200px]">
                                {product.description}
                            </div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {product.categoryName || 'Sin categoría'}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {product.kind === 'service' && (product as Service).customPriceDisplay 
                        ? (product as Service).customPriceDisplay
                        : `S/ ${product.price.toFixed(2)}`
                    }
                    </td>
                    {mode === 'all' && (
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                        product.kind === 'service' 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                        }`}>
                        {product.kind === 'service' ? 'Servicio' : 'Producto'}
                        </span>
                    </td>
                    )}
                    <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.isActive 
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-amber-500'}`} />
                        {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {showDeleted ? (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-neutral-500 hover:text-green-600 hover:bg-green-50"
                                onClick={() => handleRestoreProduct(product.id)}
                                title="Restaurar"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-neutral-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handlePermanentDeleteProduct(product.id)}
                                title="Eliminar Definitivamente"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                        ) : (
                        <>
                            <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-neutral-500 hover:text-primary hover:bg-primary/10"
                            onClick={() => handleEditProduct(product)}
                            title="Editar"
                            >
                            <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-neutral-500 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Eliminar"
                            >
                            <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                        )}
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
