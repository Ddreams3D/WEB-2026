import { useState, useEffect } from 'react';
import { Service } from '@/shared/types/domain';
import { ProductTab, ProductSpecification, ProductImage } from '@/shared/types';
import { generateSlug } from '@/lib/utils';
import { serviceSchema } from '@/lib/validators/catalog.schema';
import { useToast } from '@/components/ui/ToastManager';

interface UseServiceFormProps {
  service?: Service | null;
  onSave: (data: Partial<Service>) => void;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'ingenieria', name: 'Ingeniería' },
  { id: 'arte-diseno', name: 'Arte y Diseño' },
  { id: 'educacion', name: 'Educación' },
  { id: 'medicina', name: 'Medicina' },
  { id: 'general', name: 'General' }
];

export function useServiceForm({ service, onSave, onClose }: UseServiceFormProps) {
  const { showError, showSuccess } = useToast();
  
  // State
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    description: '',
    shortDescription: '',
    categoryId: 'general',
    categoryName: 'General',
    price: 0,
    customPriceDisplay: 'Cotización personalizada',
    displayOrder: 0,
    images: [],
    isActive: true,
    isFeatured: false,
    tags: [],
    specifications: [],
    tabs: [],
    tabsTitle: ''
  });

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Initialization
  useEffect(() => {
    if (service) {
      setFormData({
        ...service,
        tabs: service.tabs || [],
        specifications: service.specifications || [],
        tags: service.tags || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        categoryId: 'general',
        categoryName: 'General',
        price: 0,
        customPriceDisplay: 'Cotización personalizada',
        displayOrder: 0,
        images: [],
        isActive: true,
        isFeatured: false,
        tags: ['general-service'],
        specifications: [],
        tabs: [],
        tabsTitle: 'Selecciona tu perfil'
      });
    }
  }, [service]);

  // Handlers
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name || '')
      };

      // Zod Validation
      const result = serviceSchema.safeParse(dataToSave);
      if (!result.success) {
        console.warn('Validation failed:', result.error.issues);
        const firstError = result.error.issues[0];
        const errorMessage = `${firstError.path.join('.')}: ${firstError.message}`;
        showError('Error de validación', errorMessage);
        setIsSubmitting(false);
        return;
      }

      await onSave(dataToSave);
      onClose();
    } catch (error: any) {
      showError('Error al guardar', error.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'categoryId') {
        const category = CATEGORIES.find(c => c.id === value);
        setFormData(prev => ({
            ...prev,
            categoryId: value,
            categoryName: category ? category.name : 'General'
        }));
        return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Image Handlers
  const handleImageUploaded = (url: string) => {
    const newImage: ProductImage = {
        id: `img-${Date.now()}`,
        productId: service?.id || 'temp',
        url: url,
        alt: formData.name || 'Service Image',
        isPrimary: !!(formData.images && formData.images.length === 0),
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage]
    }));

    showSuccess('Imagen Agregada', 'La imagen se ha subido y agregado correctamente.');
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  // Tab Handlers
  const addTab = () => {
    const newTab: ProductTab = {
      id: `tab-${Date.now()}`,
      label: 'Nueva Pestaña',
      description: '',
      idealFor: [],
      conditions: [],
      ctaText: 'Solicitar Cotización',
      ctaAction: 'quote'
    };
    setFormData(prev => ({
      ...prev,
      tabs: [...(prev.tabs || []), newTab]
    }));
    setActiveTabId(newTab.id);
  };

  const updateTab = (updatedTab: ProductTab) => {
    setFormData(prev => ({
      ...prev,
      tabs: prev.tabs?.map(t => t.id === updatedTab.id ? updatedTab : t)
    }));
  };

  const removeTab = (tabId: string) => {
    setFormData(prev => ({
      ...prev,
      tabs: prev.tabs?.filter(t => t.id !== tabId)
    }));
    if (activeTabId === tabId) setActiveTabId(null);
  };

  // Specs Handlers
  const updateSpecs = (specs: ProductSpecification[]) => {
    setFormData(prev => ({ ...prev, specifications: specs }));
  };

  // Tags Handlers
  const updateTags = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };

  return {
    formData,
    setFormData,
    activeTabId,
    setActiveTabId,
    activeSection,
    setActiveSection,
    isSubmitting,
    isImageUploading,
    setIsImageUploading,
    handleSubmit,
    handleChange,
    handleCheckboxChange,
    handleImageUploaded,
    removeImage,
    addTab,
    updateTab,
    removeTab,
    updateSpecs,
    updateTags,
    categories: CATEGORIES
  };
}
