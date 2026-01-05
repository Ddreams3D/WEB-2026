import { useState, useEffect } from 'react';
import { Product, ProductImage, ProductTab } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { generateSlug } from '@/lib/utils';
import { productSchema, serviceSchema } from '@/lib/validators/catalog.schema';
import { useToast } from '@/components/ui/ToastManager';

interface UseProductFormProps {
  product?: Product | Service | null;
  forcedType?: 'product' | 'service';
  onSave: (data: Partial<Product | Service>) => void;
  onClose: () => void;
}

export function useProductForm({ product, forcedType, onSave, onClose }: UseProductFormProps) {
  const { showError, showSuccess } = useToast();
  
  // State
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

  const [availableCategories, setAvailableCategories] = useState<string[]>([
    'Prototipado', 'Arquitectura', 'Medicina', 'Arte', 'Educación',
    'Decoración', 'Juguetes', 'Herramientas', 'Otros'
  ]);
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([
    'PLA+', 'PLA', 'PETG', 'ABS', 'TPU', 'Resina', 'WOOD', 'Metal', 'Otros'
  ]);

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [slugEditable, setSlugEditable] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedCats = localStorage.getItem('catalog_categories');
        if (storedCats) {
            try { setAvailableCategories(JSON.parse(storedCats)); } catch(e) { console.error(e); }
        }
        const storedMats = localStorage.getItem('catalog_materials');
        if (storedMats) {
            try { setAvailableMaterials(JSON.parse(storedMats)); } catch(e) { console.error(e); }
        }
    }
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        images: product.images || [],
        tags: product.tags || [],
        specifications: product.specifications || [],
        tabs: product.tabs || [],
        // @ts-ignore
        seoKeywords: product.seoKeywords || [],
        // @ts-ignore
        materials: product.kind === 'product' ? product.materials || [] : [],
        categoryName: product.categoryName || '',
      });
      if (product.kind === 'product' && product.materials && product.materials.length > 0) {
        setSelectedMaterial(product.materials[0]);
      }
    } else {
      const initialKind = forcedType === 'service' ? 'service' : 'product';
      setFormData({
        name: '', description: '', shortDescription: '', categoryName: '', categoryId: 'general',
        price: 0, stock: 999, images: [], isActive: true, isFeatured: false, tags: [], seoKeywords: [],
        specifications: [], tabs: [], tabsTitle: '', materials: [], kind: initialKind
      });
      setSelectedMaterial('PLA+');
    }
  }, [product, forcedType]);

  // Handlers
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const baseData = { ...formData, slug: formData.slug || generateSlug(formData.name || '') };
      const dataToSave = formData.kind === 'product' 
        ? { ...baseData, materials: selectedMaterial ? [selectedMaterial] : (formData as Product).materials }
        : baseData;

      const schema = formData.kind === 'service' ? serviceSchema : productSchema;
      const result = schema.safeParse(dataToSave);

      if (!result.success) {
        const firstError = result.error.issues[0];
        showError('Error de validación', `${firstError.path.join('.')}: ${firstError.message}`);
        setIsSubmitting(false);
        return;
      }

      await onSave(dataToSave);
      onClose();
      setIsDirty(false);
      setLastSavedAt(new Date());
    } catch (error: any) {
      showError('Error al guardar', error.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'selectedMaterial') {
        setSelectedMaterial(value);
        setFormData(prev => ({ ...prev, materials: [value] }));
        setIsDirty(true);
        return;
    }
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    setIsDirty(true);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
    setIsDirty(true);
  };

  const handleImageUploaded = (url: string) => {
    if (!url) return;
    const newImage: ProductImage = {
        id: `img-${Date.now()}`,
        productId: product?.id || 'temp',
        url: url,
        alt: formData.name || 'Product Image',
        isPrimary: !!(formData.images && formData.images.length === 0),
        width: 800, height: 600, createdAt: new Date(), updatedAt: new Date()
    };
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), newImage] }));
    showSuccess('Imagen Agregada', 'La imagen se ha subido correctamente.');
    setIsDirty(true);
  };

  return {
    formData,
    setFormData,
    availableCategories,
    setAvailableCategories,
    availableMaterials,
    activeTabId,
    setActiveTabId,
    activeSection,
    setActiveSection,
    isSubmitting,
    isImageUploading,
    setIsImageUploading,
    selectedMaterial,
    setSelectedMaterial,
    isDirty,
    lastSavedAt,
    slugEditable,
    setSlugEditable,
    editingBlock,
    setEditingBlock,
    newCategoryName,
    setNewCategoryName,
    isAddingCategory,
    setIsAddingCategory,
    handleSubmit,
    handleChange,
    handleCheckboxChange,
    handleImageUploaded
  };
}
