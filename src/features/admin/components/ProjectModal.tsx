'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastManager';
import ImageUpload from './ImageUpload';
import { PortfolioItem } from '@/shared/types/domain';
import { generateSlug } from '@/lib/utils';
import { StringListEditor } from './AdminEditors';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PortfolioItem>) => void;
  project?: PortfolioItem | null;
}

const CATEGORIES = [
  'Prototipado',
  'Ingeniería',
  'Cosplay',
  'Arte',
  'Arquitectura',
  'Medicina',
  'Educación',
  'Otros'
];

export default function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    title: '',
    description: '',
    clientName: '',
    category: CATEGORIES[0],
    projectDate: new Date(),
    coverImage: '',
    galleryImages: [],
    tags: [],
    isFeatured: false,
    applications: '',
    ctaText: 'Solicitar cotización similar'
  });

  const [activeTab, setActiveTab] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        galleryImages: project.galleryImages || [],
        tags: project.tags || [],
        projectDate: new Date(project.projectDate)
      });
    } else {
      setFormData({
        title: '',
        description: '',
        clientName: '',
        category: CATEGORIES[0],
        projectDate: new Date(),
        coverImage: '',
        galleryImages: [],
        tags: [],
        isFeatured: false,
        applications: '',
        ctaText: 'Solicitar cotización similar'
      });
    }
  }, [project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.coverImage) {
      showError('El título y la imagen de portada son obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      // Auto-generate slug if not present or title changed (simple logic)
      const slug = formData.slug || generateSlug(formData.title);
      
      await onSave({
        ...formData,
        slug
      });
      onClose();
    } catch (error) {
      console.error(error);
      showError('Error al guardar el proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof PortfolioItem, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGalleryAdd = () => {
    setFormData(prev => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), '']
    }));
  };

  const handleGalleryUpdate = (index: number, url: string) => {
    const newGallery = [...(formData.galleryImages || [])];
    newGallery[index] = url;
    setFormData(prev => ({ ...prev, galleryImages: newGallery }));
  };

  const handleGalleryRemove = (index: number) => {
    const newGallery = [...(formData.galleryImages || [])];
    newGallery.splice(index, 1);
    setFormData(prev => ({ ...prev, galleryImages: newGallery }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="info">Información General</TabsTrigger>
              <TabsTrigger value="media">Imágenes</TabsTrigger>
              <TabsTrigger value="details">Detalles y SEO</TabsTrigger>
            </TabsList>

            {/* General Info */}
            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Proyecto</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ej. Prototipo de Motor V6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Cliente (Opcional)</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName || ''}
                    onChange={(e) => handleChange('clientName', e.target.value)}
                    placeholder="Ej. Empresa SAC"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDate">Fecha del Proyecto</Label>
                  <Input
                    id="projectDate"
                    type="date"
                    value={formData.projectDate ? new Date(formData.projectDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange('projectDate', new Date(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descripción detallada del proyecto..."
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="isFeatured" 
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleChange('isFeatured', checked)}
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">
                  Destacar este proyecto en la portada
                </Label>
              </div>
            </TabsContent>

            {/* Media */}
            <TabsContent value="media" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Imagen de Portada</h3>
                <div className="max-w-md">
                  <ImageUpload
                    value={formData.coverImage}
                    onChange={(url) => handleChange('coverImage', url)}
                    onRemove={() => handleChange('coverImage', '')}
                    defaultName={formData.title}
                    existingImages={[]} // Not strictly needed for cover
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">Galería Adicional</h3>
                  <Button onClick={handleGalleryAdd} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Agregar Imagen
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.galleryImages?.map((url, index) => (
                    <div key={index} className="relative group border rounded-lg p-2">
                      <ImageUpload
                        value={url}
                        onChange={(newUrl) => handleGalleryUpdate(index, newUrl)}
                        onRemove={() => handleGalleryRemove(index)}
                        defaultName={`${formData.title}-gallery-${index + 1}`}
                        existingImages={[]}
                      />
                      <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleGalleryRemove(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {formData.galleryImages?.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8 bg-accent/20 rounded-lg">
                    No hay imágenes adicionales. Agrega algunas para mostrar detalles.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Details & SEO */}
            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="applications">Aplicaciones / Usos</Label>
                <Textarea
                  id="applications"
                  value={formData.applications || ''}
                  onChange={(e) => handleChange('applications', e.target.value)}
                  placeholder="Ej. Prototipado, Validación, Producción final..."
                />
                <p className="text-xs text-muted-foreground">Separa conceptos importantes con puntos o comas.</p>
              </div>

              <div className="space-y-2">
                <Label>Etiquetas (Tags)</Label>
                <StringListEditor
                  items={formData.tags || []}
                  onChange={(tags) => handleChange('tags', tags)}
                  placeholder="Agregar etiqueta (Enter)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaText">Texto del Botón (CTA)</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText || ''}
                  onChange={(e) => handleChange('ctaText', e.target.value)}
                  placeholder="Ej. Solicitar cotización similar"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2 bg-muted/20">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Proyecto'}
          </Button>
        </div>
      </div>
    </div>
  );
}
