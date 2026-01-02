import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/ToastManager';
import ImageUpload from './ImageUpload';
import { Service } from '@/shared/types/domain';
import { ProductTab, ProductSpecification, ProductImageViewType } from '@/shared/types';
import { generateSlug } from '@/lib/utils';
import { TabEditor, SpecificationsEditor, StringListEditor } from './AdminEditors';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Service>) => void;
  service?: Service | null;
}

const categories = [
  { id: 'ingenieria', name: 'Ingeniería' },
  { id: 'arte-diseno', name: 'Arte y Diseño' },
  { id: 'educacion', name: 'Educación' },
  { id: 'medicina', name: 'Medicina' },
  { id: 'general', name: 'General' }
];

export default function ServiceModal({ isOpen, onClose, onSave, service }: ServiceModalProps) {
  const { showError, showSuccess } = useToast();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

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
  }, [service, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name || '')
      };
      await onSave(dataToSave);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'categoryId') {
        const category = categories.find(c => c.id === value);
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
    const newImage = {
        id: `img-${Date.now()}`,
        productId: service?.id || 'temp',
        url: url,
        alt: formData.name || 'Service Image',
        isPrimary: formData.images && formData.images.length === 0,
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage]
    }));

    showError('Imagen Agregada', 'La imagen se ha subido y agregado correctamente.');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {service ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="info">Info Básica</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="content">Contenido (Tabs)</TabsTrigger>
                <TabsTrigger value="images">Imágenes</TabsTrigger>
                <TabsTrigger value="seo">SEO y Tags</TabsTrigger>
              </TabsList>

              {/* TAB: INFO BÁSICA */}
              <TabsContent value="info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre del Servicio</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Texto de Precio</label>
                    <input
                      type="text"
                      name="customPriceDisplay"
                      value={formData.customPriceDisplay}
                      onChange={handleChange}
                      placeholder="Ej. Cotización personalizada"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Orden de Visualización</label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción Corta (Subtítulo)</label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                  />
                </div>

                <div className="flex gap-6 p-4 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg border">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="font-medium">Activo (Visible al público)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="font-medium">Destacado (Home page)</span>
                  </label>
                </div>
              </TabsContent>

              {/* TAB: DETALLES */}
              <TabsContent value="details" className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción Principal (Fallback)</label>
                  <p className="text-xs text-muted-foreground mb-1">
                    Esta descripción se muestra si no hay pestañas configuradas.
                  </p>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700 font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Especificaciones Técnicas</label>
                  <div className="p-4 border rounded-lg dark:border-neutral-700">
                    <SpecificationsEditor 
                      specs={formData.specifications || []} 
                      onChange={updateSpecs} 
                    />
                  </div>
                </div>
              </TabsContent>

              {/* TAB: CONTENIDO (TABS) */}
              <TabsContent value="content" className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">Título de las Pestañas</label>
                    <input
                      type="text"
                      name="tabsTitle"
                      value={formData.tabsTitle || ''}
                      onChange={handleChange}
                      placeholder="Ej. Selecciona tu perfil"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                  <Button type="button" onClick={addTab} className="mt-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Pestaña
                  </Button>
                </div>

                <div className="space-y-4 mt-4">
                  {formData.tabs?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      No hay pestañas configuradas. Agrega una para mostrar contenido segmentado (B2B/B2C).
                    </div>
                  )}
                  
                  {formData.tabs?.map((tab) => (
                    <TabEditor
                      key={tab.id}
                      tab={tab}
                      isOpen={activeTabId === tab.id}
                      onToggle={() => setActiveTabId(activeTabId === tab.id ? null : tab.id)}
                      onChange={updateTab}
                      onRemove={() => removeTab(tab.id)}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* TAB: IMÁGENES */}
              <TabsContent value="images" className="space-y-6">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
                  <h3 className="text-sm font-medium mb-4">Subir Nueva Imagen</h3>
                  <ImageUpload
                    value=""
                    onChange={handleImageUploaded}
                    onRemove={() => {}}
                    onUploadStatusChange={setIsImageUploading}
                    defaultName={formData.name}
                    existingImages={formData.images || []}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images?.map((img, idx) => (
                    <div key={idx} className="relative group border rounded-lg overflow-hidden bg-white dark:bg-neutral-800 shadow-sm">
                      <div className="aspect-square relative">
                         <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      </div>

                      {/* File Info Overlay - Always visible at bottom */}
                      <div className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 border-t dark:border-neutral-700 text-[10px] leading-tight">
                        <div className="font-semibold text-neutral-700 dark:text-neutral-300">
                            {img.viewType ? img.viewType.toUpperCase() : 'SIN TIPO'}
                        </div>
                        <div className="text-neutral-500 truncate" title={decodeURIComponent(img.url.split('/').pop()?.split('?')[0] || '')}>
                            {(() => {
                                 const full = decodeURIComponent(img.url.split('/').pop()?.split('?')[0] || '');
                                 const underscoreIndex = full.indexOf('_');
                                 return underscoreIndex !== -1 ? full.substring(underscoreIndex + 1) : full;
                            })()}
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 top-0 bottom-[36px]">
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {img.isPrimary && (
                        <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded shadow-sm">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* TAB: SEO */}
              <TabsContent value="seo" className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Slug (URL)</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug || ''}
                        onChange={handleChange}
                        placeholder="Generado automáticamente si se deja vacío"
                        className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                    />
                    <p className="text-xs text-muted-foreground">
                        Identificador único para la URL. Ej: impresion-3d-resina
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Etiquetas (Tags)</label>
                    <div className="p-4 border rounded-lg dark:border-neutral-700">
                        <StringListEditor
                            items={formData.tags || []}
                            onChange={updateTags}
                            placeholder="Ej. impresión 3d, diseño..."
                            addButtonText="Agregar Tag"
                        />
                    </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 rounded-b-2xl flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="service-form"
            disabled={isSubmitting || isImageUploading}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Guardando...' : isImageUploading ? 'Subiendo imagen...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}
