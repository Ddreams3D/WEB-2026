import React, { useRef } from 'react';
import { Edit, Trash2, Package, Star } from '@/lib/icons';
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
    const clickTimer = useRef<number | null>(null);
    const lastClickedId = useRef<string | null>(null);

    const handleSingleClick = (service: Service) => {
        lastClickedId.current = service.id;
        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
        }
        clickTimer.current = window.setTimeout(() => {
            if (lastClickedId.current === service.id) {
                handleEditService(service);
            }
            lastClickedId.current = null;
            clickTimer.current = null;
        }, 220);
    };

    const handleDoubleClick = (service: Service) => {
        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
        }
        lastClickedId.current = null;
        handleDeleteService(service.id);
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-neutral-50/50 dark:bg-neutral-800/30 border-b border-neutral-200 dark:border-neutral-800">
                            <th className="px-6 py-4 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Servicio</th>
                            <th className="px-6 py-4 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Orden</th>
                            <th className="px-6 py-4 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-4 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-4 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-neutral-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm">Cargando servicios...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-neutral-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Package className="w-8 h-8 text-neutral-300" />
                                        <p className="text-sm">No se encontraron servicios</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredServices.map((service) => (
                                <tr 
                                    key={service.id} 
                                    className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                                    onClick={() => handleSingleClick(service)}
                                    onDoubleClick={() => handleDoubleClick(service)}
                                >
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700 flex-shrink-0 relative">
                                                {service.images?.[0] ? (
                                                    <ProductImage
                                                        src={service.images[0].url}
                                                        alt={service.name}
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
                                                    <span className="truncate max-w-[200px]" title={service.name}>
                                                        {service.name}
                                                    </span>
                                                    {service.isFeatured && (
                                                        <span title="Destacado">
                                                            <Star className="w-3 h-3 text-primary fill-primary" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-sm font-mono text-neutral-600 dark:text-neutral-300">
                                        {service.displayOrder}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                                            {service.categoryName || 'Sin cat.'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                        {service.customPriceDisplay || 'Cotización'}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'}`} />
                                            <span className={`text-xs ${service.isActive ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400'}`}>
                                                {service.isActive ? 'Activo' : 'Inactivo'}
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
