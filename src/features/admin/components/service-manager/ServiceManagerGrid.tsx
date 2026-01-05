import React from 'react';
import { Edit, Trash2, Package } from '@/lib/icons';
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
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
                <div
                    key={service.id}
                    className="group bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                    <div className="aspect-[4/3] relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                        {service.images && service.images.length > 0 ? (
                            <ProductImage 
                                src={service.images.find(i => i.isPrimary)?.url || service.images[0].url} 
                                alt={service.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <Package className="w-12 h-12" />
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-white hover:bg-white/20"
                                onClick={() => handleEditService(service)}
                            >
                                <Edit className="w-5 h-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-white hover:bg-red-500/80 hover:text-white"
                                onClick={() => handleDeleteService(service.id)}
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                Servicio
                            </span>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
                                {service.name}
                            </h3>
                            <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
                                {service.customPriceDisplay || 'Cotización'}
                            </span>
                        </div>
                        
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 h-10">
                            {service.shortDescription || service.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {service.categoryName}
                            </span>
                            <span className={`flex items-center gap-1.5 text-xs font-medium ${
                                service.isActive ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                    service.isActive ? 'bg-green-500' : 'bg-amber-500'
                                }`} />
                                {service.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
