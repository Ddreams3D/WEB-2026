import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/ToastManager';
import { Service } from '@/shared/types/domain';
import { ServiceService } from '@/services/service.service';

export function useServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>('list');
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
    variant: 'warning' as 'warning' | 'danger' | 'info',
    isLoading: false
  });
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedView = localStorage.getItem('admin_services_view_mode');
    if (storedView === 'grid' || storedView === 'list') {
      setViewModeState(storedView);
    }
  }, []);

  const setViewMode = (mode: 'grid' | 'list') => {
    setViewModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_services_view_mode', mode);
    }
  };

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
      message: '¿Estás seguro de eliminar este servicio? Esta acción es irreversible.',
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

  return {
    services,
    loading,
    searchTerm,
    setSearchTerm,
    selectedService,
    isModalOpen,
    setIsModalOpen,
    viewMode,
    setViewMode,
    confirmation,
    closeConfirmation,
    handleAddService,
    handleEditService,
    handleDeleteService,
    handleSaveService,
    filteredServices
  };
}
