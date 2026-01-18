import React, { useRef } from 'react';
import { Edit, Trash2, Package, Star } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { Service } from '@/shared/types/domain';

interface ServiceManagerGridProps {
    filteredServices: Service[];
    handleEditService: (service: Service) => void;
    handleDeleteService: (id: string) => void;
}

export function ServiceManagerGrid({
    filteredServices,
    handleEditService,
    handleDeleteService
}: ServiceManagerGridProps) {
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredServices.map((service) => {
                const hasLandingAndForm =
                    service.slug === 'modelado-3d-personalizado' ||
                    service.slug === 'merchandising-3d-personalizado' ||
                    service.slug === 'trofeos-medallas-3d-personalizados' ||
                    service.slug === 'maquetas-didacticas-material-educativo-3d' ||
                    service.slug === 'proyectos-anatomicos-3d-personalizados';

                return (
                <div
                    key={service.id}
                    className="group bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-300 overflow-hidden relative cursor-pointer flex flex-col h-full"
                    onClick={() => handleSingleClick(service)}
                    onDoubleClick={() => handleDoubleClick(service)}
                >
                    <div className="aspect-square relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                        {service.images && service.images.length > 0 ? (
                            <ProductImage 
                                src={service.images.find(i => i.isPrimary)?.url || service.images[0].url} 
                                alt={service.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <Package className="w-10 h-10 opacity-20" />
                            </div>
                        )}
                        
                        {/* Featured Badge */}
                        {service.isFeatured && (
                            <div className="absolute top-2 left-2 z-10">
                                <div className="bg-primary text-primary-foreground p-1 rounded-full shadow-sm backdrop-blur-sm">
                                    <Star className="w-3 h-3 fill-current" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 flex flex-col justify-between flex-1">
                        <div className="mb-1">
                            <h3
                                className="font-medium text-sm text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-3 break-words"
                                title={service.name}
                            >
                                {service.name}
                            </h3>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 truncate max-w-[60%]">
                                {service.categoryName || 'Sin categoría'}
                            </span>
                            
                            <div className="flex items-center gap-1.5" title={service.isActive ? 'Activo' : 'Inactivo'}>
                                <div
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        service.isActive ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]' : 'bg-neutral-300 dark:bg-neutral-600'
                                    }`}
                                />
                                <span
                                    className={`text-[10px] font-semibold px-1.5 py-[1px] rounded-sm border ${
                                        hasLandingAndForm
                                            ? 'bg-green-100 text-green-700 border-green-300'
                                            : 'bg-red-100 text-red-700 border-red-300'
                                    }`}
                                >
                                    L
                                </span>
                                <span
                                    className={`text-xs ${
                                        service.isActive ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400'
                                    }`}
                                >
                                    {service.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
    );
}
