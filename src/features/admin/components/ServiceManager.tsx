'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Package, RefreshCw } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastManager';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import ServiceModal from './ServiceModal';
import { Service } from '@/shared/types/domain';
import { ServiceService } from '@/services/service.service';
import ConnectionStatus from './ConnectionStatus';

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showSuccess, showError } = useToast();

  const loadServices = useCallback(async (force = false) => {
    try {
      setLoading(true);
      const fetchedServices = await ServiceService.getAllServices(force);
      setServices(fetchedServices);
    } catch (error) {
      console.error('Error loading services:', error);
      showError('Error', 'Error al cargar los servicios');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleAddService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    try {
      await ServiceService.deleteService(id);
      await loadServices(true);
      showSuccess('Eliminado', 'Servicio eliminado correctamente');
    } catch (error) {
      console.error('Error deleting service:', error);
      showError('Error', 'Error al eliminar el servicio');
    }
  };

  const handleSeedServices = async () => {
    if (!confirm('¿Estás seguro de reiniciar la base de datos con los servicios por defecto? Esto solo funcionará si la colección está vacía o si se fuerza (actualmente solo si está vacía).')) return;
    
    try {
      setLoading(true);
      await ServiceService.seedServices();
      await loadServices(true);
      showSuccess('Reiniciado', 'Servicios inicializados correctamente');
    } catch (error) {
      console.error('Error seeding services:', error);
      showError('Error', 'Error al inicializar servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (serviceData: Partial<Service>) => {
    try {
      if (selectedService) {
        // Update
        await ServiceService.updateService(selectedService.id, serviceData);
        showSuccess('Actualizado', 'Servicio actualizado correctamente');
      } else {
        // Create
        await ServiceService.createService(serviceData);
        showSuccess('Creado', 'Servicio creado correctamente');
      }
      setIsModalOpen(false);
      setSelectedService(null);
      loadServices(true);
    } catch (error) {
      console.error('Error saving service:', error);
      showError('Error', 'Error al guardar el servicio');
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <h2 className="text-xl font-bold">Servicios</h2>
           <ConnectionStatus />
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground transition-all duration-200 outline-none"
          />
        </div>
        <div className="flex gap-2">
            <Button onClick={() => loadServices(true)} variant="outline" size="icon" title="Recargar">
                <RefreshCw className="w-4 h-4" />
            </Button>
            {services.length === 0 && (
                <Button onClick={handleSeedServices} variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Inicializar DB
                </Button>
            )}
            <Button onClick={handleAddService} variant="gradient" className="gap-2">
                <Plus className="w-5 h-5" />
                Nuevo Servicio
            </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Imagen</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Orden</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Categoría</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Precio Display</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Cargando servicios...</td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No se encontraron servicios</td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden border border-border">
                        {service.images?.[0] ? (
                          <ProductImage
                            src={service.images[0].url}
                            alt={service.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                        {service.displayOrder}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{service.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {service.shortDescription || service.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {service.categoryName}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {service.customPriceDisplay || 'Cotización'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[4/3] relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                {service.images && service.images.length > 0 ? (
                   <img 
                      src={service.images.find(i => i.isPrimary)?.url || service.images[0].url} 
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
      )}

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
        service={selectedService}
      />
    </div>
  );
}
