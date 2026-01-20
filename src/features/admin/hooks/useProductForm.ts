import { useState, useEffect, useCallback } from 'react';
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
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [slugEditable, setSlugEditable] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const getDraftKey = useCallback(() => {
    const base = product?.id ? `product_form_draft_${product.id}` : 'product_form_draft_new';
    const type = (formData.kind || forcedType || 'product');
    const sid = sessionId || 'session';
    return `${base}_${sid}_${type}`;
  }, [product?.id, formData.kind, forcedType, sessionId]);

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
    if (typeof window !== 'undefined') {
      let sid = sessionStorage.getItem('product_form_session_id');
      if (!sid) {
        try {
          // @ts-ignore
          sid = window.crypto && typeof window.crypto.randomUUID === 'function'
            // @ts-ignore
            ? window.crypto.randomUUID()
            : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
        } catch {
          sid = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
        }
        sessionStorage.setItem('product_form_session_id', sid);
      }
      setSessionId(sid);
    }
  }, [product?.id, forcedType]);

  // Persistence for Categories and Materials
  useEffect(() => {
    if (availableCategories.length > 0) {
        localStorage.setItem('catalog_categories', JSON.stringify(availableCategories));
    }
  }, [availableCategories]);

  useEffect(() => {
    if (availableMaterials.length > 0) {
        localStorage.setItem('catalog_materials', JSON.stringify(availableMaterials));
    }
  }, [availableMaterials]);

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
    } else {
      const initialKind = forcedType === 'service' ? 'service' : 'product';
      let tempId = '';
      try {
        const rnd = (typeof window !== 'undefined' && (window as any).crypto && typeof (window as any).crypto.randomUUID === 'function')
          ? (window as any).crypto.randomUUID()
          : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
        tempId = `prod-${rnd}`;
      } catch {
        tempId = `prod-${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
      }
      
      setFormData({
        id: tempId,
        name: '', description: '', shortDescription: '', categoryName: '', categoryId: 'general',
        price: 0, stock: 999, images: [], isActive: true, isFeatured: false, tags: [], seoKeywords: [],
        specifications: [], tabs: [], tabsTitle: '', materials: [], kind: initialKind
      });
    }
    if (typeof window !== 'undefined') {
      const storedDraft = localStorage.getItem(getDraftKey());
      if (storedDraft) {
        try {
          const parsed = JSON.parse(storedDraft);
          setFormData(prev => ({ ...prev, ...parsed }));
          setIsDirty(true);
        } catch {}
      }
    }
  }, [product, forcedType, getDraftKey]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isDirty) {
      try { localStorage.setItem(getDraftKey(), JSON.stringify(formData)); } catch {}
    }
  }, [formData, isDirty, getDraftKey]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handler);
      return () => window.removeEventListener('beforeunload', handler);
    }
  }, [isDirty]);

  // Handlers
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const baseData = { ...formData, slug: formData.slug || generateSlug(formData.name || '') };
      const dataToSave = formData.kind === 'product' 
        ? { ...baseData, materials: (formData as Product).materials || [] }
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
      try { localStorage.removeItem(getDraftKey()); } catch {}
    } catch (error: any) {
      showError('Error al guardar', error.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
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

  const validateNow = () => {
    const baseData = { ...formData, slug: formData.slug || generateSlug(formData.name || '') };
    const dataToValidate = formData.kind === 'product' 
      ? { ...baseData, materials: (formData as Product).materials || [] }
      : baseData;
    const schema = formData.kind === 'service' ? serviceSchema : productSchema;
    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      const firstError = result.error.issues[0];
      showError('Cambios sin guardar', `${firstError.path.join('.')}: ${firstError.message}`);
      return false;
    }
    return true;
  };

  const handleEsc = async () => {
    if (isSubmitting) return;
    if (validateNow()) {
      await handleSubmit();
    } else {
      showError('Advertencia', 'Completa los campos requeridos antes de cerrar con Esc');
    }
  };

  const requestClose = () => {
    if (isDirty) {
      showError('Cambios sin guardar', 'Guarda los cambios antes de cerrar');
      return;
    }
    onClose();
  };

  return {
    formData,
    setFormData,
    availableCategories,
    setAvailableCategories,
    availableMaterials,
    setAvailableMaterials,
    activeTabId,
    setActiveTabId,
    activeSection,
    setActiveSection,
    isSubmitting,
    isImageUploading,
    setIsImageUploading,
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
    handleImageUploaded,
    handleEsc,
    requestClose
  };
}
