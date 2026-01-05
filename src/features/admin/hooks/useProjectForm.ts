import { useState, useEffect } from 'react';
import { PortfolioItem } from '@/shared/types/domain';
import { generateSlug } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastManager';

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

interface UseProjectFormProps {
  project?: PortfolioItem | null;
  onSave: (data: Partial<PortfolioItem>) => void;
  onClose: () => void;
}

export function useProjectForm({ project, onSave, onClose }: UseProjectFormProps) {
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
  }, [project]);

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

  return {
    formData,
    isSubmitting,
    handleChange,
    handleGalleryAdd,
    handleGalleryUpdate,
    handleGalleryRemove,
    handleSubmit,
    CATEGORIES
  };
}
