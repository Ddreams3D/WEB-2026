import React from 'react';
import { Edit, Trash2, Package } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { Service } from '@/shared/types/domain';

interface ServiceManagerListProps {
    loading: boolean;
    filteredServices: Service[];
    handleEditService: (service: Service) => void;
    handleDeleteService: (id: string) => void;
}

export function ServiceManagerList({
    loading,
    filteredServices,
    handleEditService,
    handleDeleteService
}: ServiceManagerListProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Servicio</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Orden</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Precio Display</th>
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
                                        Cargando servicios...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Package className="w-8 h-8 text-neutral-300" />
                                        <p>No se encontraron servicios</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredServices.map((service) => (
                                <tr key={service.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                                                {service.images?.[0] ? (
                                                    <ProductImage
                                                        src={service.images[0].url}
                                                        alt={service.name}
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
                                                <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]" title={service.name}>
                                                    {service.name}
                                                </div>
                                                <div className="text-xs text-neutral-500 truncate max-w-[200px]">
                                                    {service.shortDescription || service.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-neutral-600 dark:text-neutral-300">
                                        {service.displayOrder}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                                            {service.categoryName || 'Sin categoría'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                        {service.customPriceDisplay || 'Cotización'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            service.isActive 
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-amber-500'}`} />
                                            {service.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-neutral-500 hover:text-primary hover:bg-primary/10"
                                                onClick={() => handleEditService(service)}
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-neutral-500 hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDeleteService(service.id)}
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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
