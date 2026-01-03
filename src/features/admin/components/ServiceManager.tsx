'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Package } from '@/lib/icons';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastManager';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import ServiceModal from './ServiceModal';
import { ViewToggle } from './ViewToggle';
import { Service } from '@/shared/types/domain';
import { ServiceService } from '@/services/service.service';
import ConnectionStatus from './ConnectionStatus';
import ConfirmationModal from './ConfirmationModal';

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
    variant: 'warning' as 'warning' | 'danger' | 'info',
    isLoading: false
  });
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

  const closeConfirmation = () => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleDeleteService = (id: string) => {
    setConfirmation({
      isOpen: true,
      title: 'Eliminar Servicio',
      message: '¿Estás seguro de eliminar este servicio?',
      variant: 'danger',
      isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmation(prev => ({ ...prev, isLoading: true }));
          await ServiceService.deleteService(id);
          await loadServices(true);
          showSuccess('Eliminado', 'Servicio eliminado correctamente');
          closeConfirmation();
        } catch (error) {
          console.error('Error deleting service:', error);
          showError('Error', 'Error al eliminar el servicio');
          setConfirmation(prev => ({ ...prev, isLoading: false }));
        }
      }
    });
  };

  const handleSeed = (force = false) => {
    const message = force 
      ? '¿Estás seguro de recargar los datos estáticos? Esto sobrescribirá los servicios existentes.' 
      : '¿Importar servicios desde el archivo estático?';
      
    setConfirmation({
      isOpen: true,
      title: force ? 'Reiniciar Servicios' : 'Importar Servicios',
      message,
      variant: force ? 'danger' : 'warning',
      isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmation(prev => ({ ...prev, isLoading: true }));
          setIsSeeding(true);
          await ServiceService.seedServices(force);
          await loadServices(true);
          showSuccess('Reiniciado', 'Servicios inicializados correctamente');
          closeConfirmation();
        } catch (error) {
          console.error('Error seeding services:', error);
          showError('Error', 'Error al inicializar servicios');
          setConfirmation(prev => ({ ...prev, isLoading: false }));
        } finally {
          setIsSeeding(false);
        }
      }
    });
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
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        variant={confirmation.variant}
        isLoading={confirmation.isLoading}
      />
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
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
            <Button variant="outline" onClick={() => handleSeed(true)} disabled={isSeeding}>
                {isSeeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Sincronizar Datos Estáticos
            </Button>
            <Button onClick={handleAddService} variant="gradient" className="gap-2">
                <Plus className="w-5 h-5" />
                Nuevo Servicio
            </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
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
      ) : (
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
