'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/ToastManager';
import ImageUpload from './ImageUpload';
import { Product, ProductTab, ProductSpecification, ProductImage } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { generateSlug } from '@/lib/utils';
import { TabEditor, SpecificationsEditor, StringListEditor, OptionsEditor } from './AdminEditors';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Product | Service>) => void;
  product?: Product | Service | null;
  forcedType?: 'product' | 'service';
}

const categories = [
  'Prototipado',
  'Arquitectura',
  'Medicina',
  'Arte',
  'Educación',
  'Decoración',
  'Juguetes',
  'Herramientas',
  'Otros'
];

const materials = [
  'PLA',
  'PETG',
  'ABS',
  'TPU',
  'Resina',
  'WOOD',
  'Metal',
  'Otros'
];

export default function ProductModal({ isOpen, onClose, onSave, product, forcedType }: ProductModalProps) {
  // Estado inicial extendido para cubrir todas las propiedades de Product y Service
  const [formData, setFormData] = useState<Partial<Product | Service>>({
    name: '',
    description: '',
    shortDescription: '',
    categoryName: '',
    categoryId: 'general',
    price: 0,
    stock: 999,
    images: [],
    isActive: true,
    isFeatured: false,
    tags: [],
    seoKeywords: [],
    specifications: [],
    tabs: [],
    tabsTitle: '',
    materials: [],
    kind: 'product',
    displayOrder: 0
  });

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const { showError } = useToast();

  useEffect(() => {
    if (product) {
      // Mapeo seguro de propiedades
      setFormData({
        ...product,
        // Asegurar arrays
        images: product.images || [],
        tags: product.tags || [],
        specifications: product.specifications || [],
        tabs: product.tabs || [],
        // @ts-ignore - seoKeywords might not be in Service
        seoKeywords: product.seoKeywords || [],
        // @ts-ignore - materials handling
        materials: product.kind === 'product' ? product.materials || [] : [],
        categoryName: product.categoryName || '',
      });
      
      // Set initial selected material if exists
      if (product.kind === 'product' && product.materials && product.materials.length > 0) {
        setSelectedMaterial(product.materials[0]);
      }
    } else {
      // Reset para nuevo producto
      const initialKind = forcedType === 'service' ? 'service' : 'product';
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        categoryName: '',
        categoryId: 'general',
        price: 0,
        stock: 999,
        images: [],
        isActive: true,
        isFeatured: false,
        tags: [],
        seoKeywords: [],
        specifications: [],
        tabs: [],
        tabsTitle: '',
        materials: [],
        kind: initialKind
      });
      setSelectedMaterial('');
    }
  }, [product, isOpen, forcedType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación manual
    if (!formData.name?.trim()) {
        showError('Error', 'El nombre es obligatorio');
        setActiveMainTab('info');
        return;
    }

    if (!formData.categoryName) {
        showError('Error', 'La categoría es obligatoria');
        setActiveMainTab('info');
        return;
    }

    setIsSubmitting(true);
    try {
      const baseData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name || ''),
      };

      // Handle product-specific fields safely
      const dataToSave = formData.kind === 'product' 
        ? { ...baseData, materials: selectedMaterial ? [selectedMaterial] : (formData as any).materials }
        : baseData;

      await onSave(dataToSave);
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      showError('Error al guardar', error.message || 'Ha ocurrido un error inesperado al guardar el producto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'selectedMaterial') {
        setSelectedMaterial(value);
        setFormData(prev => ({
            ...prev,
            materials: [value]
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
        productId: product?.id || 'temp',
        url: url,
        alt: formData.name || 'Product Image',
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
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const setPrimaryImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images?.map((img, i) => ({
            ...img,
            isPrimary: i === index
        }))
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
      ctaText: 'Solicitar',
      ctaAction: 'cart'
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

  const updateSeoKeywords = (keywords: string[]) => {
    setFormData(prev => ({ ...prev, seoKeywords: keywords }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {product ? 'Editar' : 'Nuevo'} {formData.kind === 'service' ? 'Servicio' : 'Producto'}
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
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="info">Info Básica</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="content">Pestañas</TabsTrigger>
                <TabsTrigger value="images">Imágenes</TabsTrigger>
                <TabsTrigger value="seo">SEO y Tags</TabsTrigger>
              </TabsList>

              {/* TAB: INFO BÁSICA */}
              <TabsContent value="info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <select
                      name="categoryName"
                      value={formData.categoryName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                    >
                      <option value="">Seleccionar...</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Precio</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Orden de Visualización</label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                    />
                  </div>

                  {formData.kind === 'product' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Stock</label>
                        <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                        min="0"
                        />
                    </div>
                  )}

                  {formData.kind === 'product' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Material Principal</label>
                        <select
                        name="selectedMaterial"
                        value={selectedMaterial}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                        >
                        <option value="">Seleccionar...</option>
                        {materials.map(mat => (
                            <option key={mat} value={mat}>{mat}</option>
                        ))}
                        </select>
                    </div>
                   )}
                   
                   {formData.kind === 'service' && (
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
                   )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción Corta (Subtítulo)</label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
                    placeholder="Breve resumen para listados"
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
                    <span className="font-medium">Activo (Visible)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="font-medium">Destacado (Home)</span>
                  </label>
                </div>
              </TabsContent>

              {/* TAB: DETALLES */}
              <TabsContent value="details" className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción Completa</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={8}
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

                {formData.kind === 'product' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Opciones del Producto (Color, Personalización, etc.)</label>
                    <div className="p-4 border rounded-lg dark:border-neutral-700">
                      <OptionsEditor 
                        options={(formData as any).options || []} 
                        onChange={(options) => setFormData(prev => ({ ...prev, options } as any))} 
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* TAB: CONTENIDO (TABS) */}
              <TabsContent value="content" className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">Título de la sección de pestañas</label>
                    <input
                      type="text"
                      name="tabsTitle"
                      value={formData.tabsTitle || ''}
                      onChange={handleChange}
                      placeholder="Ej. Opciones Disponibles"
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
                      No hay pestañas adicionales.
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
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images?.map((img, idx) => (
                    <div key={idx} className={`relative group border rounded-lg overflow-hidden bg-white dark:bg-neutral-800 shadow-sm ${img.isPrimary ? 'ring-2 ring-primary' : ''}`}>
                      <div className="aspect-square relative">
                         <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(idx)}
                          className="bg-primary text-white rounded-full p-2 hover:bg-primary/90 transition-colors text-xs"
                          title="Hacer Principal"
                        >
                          ★
                        </button>
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

              {/* TAB: SEO Y TAGS */}
              <TabsContent value="seo" className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Etiquetas (Tags)</label>
                        <StringListEditor 
                            items={formData.tags || []}
                            onChange={updateTags}
                            placeholder="Ej. nuevo, oferta"
                            addButtonText="Agregar Tag"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Keywords SEO</label>
                        <StringListEditor 
                            items={formData.seoKeywords || []}
                            onChange={updateSeoKeywords}
                            placeholder="Ej. impresion 3d, figuras"
                            addButtonText="Agregar Keyword"
                        />
                    </div>
                 </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-6 border-t dark:border-neutral-700">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
