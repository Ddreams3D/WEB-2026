import { useState, useEffect, useCallback } from 'react';
import { Product, ProductImage, ProductTab } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { generateSlug } from '@/lib/utils';
import { productSchema, serviceSchema, productDraftSchema, serviceDraftSchema } from '@/lib/validators/catalog.schema';
import { useToast } from '@/components/ui/ToastManager';
import { generateProductContent } from '@/actions/ai-product-generator';

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
    isActive: false, // Default to false (draft)
    status: 'draft', // Default status
    isFeatured: false,
    tags: [],
    seoKeywords: [],
    specifications: [
      { name: 'Stock', value: 'Fabricación bajo pedido' },
      { name: 'Tiempo de fabricación', value: '2-4 días hábiles' }
    ],
    tabs: [],
    tabsTitle: '',
    materials: [],
    options: [],
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  // Default: Editable only if new product (no ID yet)
  const [slugEditable, setSlugEditable] = useState(!product?.id);
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
        status: product.status || (product.isActive ? 'published' : 'draft'),
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
        specifications: [
          { name: 'Stock', value: 'Fabricación bajo pedido' },
          { name: 'Tiempo de fabricación', value: '2-4 días hábiles' }
        ],
        tabs: [], tabsTitle: '', materials: [], kind: initialKind,
        status: 'draft'
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
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Allow free typing (spaces, accents, case) to act as a "Seed" for generation
    setFormData(prev => ({ ...prev, slug: rawValue }));
    setIsDirty(true);
  };

  const handleLockSlug = async () => {
    if (!slugEditable) {
        setSlugEditable(true);
        return;
    }

    // When locking, just normalize the slug
    const rawInput = formData.slug || '';
    const finalSlug = generateSlug(rawInput);
    
    setFormData(prev => ({ ...prev, slug: finalSlug }));
    setSlugEditable(false);
  };

  const handleGenerateAI = async () => {
    const rawInput = formData.slug || formData.name || '';
    if (rawInput.length <= 3) {
        showError('Info insuficiente', 'Escribe un nombre o slug más largo para generar contenido.');
        return;
    }

    setIsGenerating(true);
    let aiData = null;
    
    try {
        // Race between AI and a 15s Timeout
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Tiempo de espera agotado (15s)")), 15000)
        );
        
        // Try to get image context if available
        let imageBase64: string | undefined = undefined;
        if (formData.images && formData.images.length > 0 && formData.images[0].url) {
            try {
                const imageUrl = formData.images[0].url;
                // Fetch the image
                const response = await fetch(imageUrl);
                if (response.ok) {
                    const blob = await response.blob();
                    // Convert to base64
                    const base64Data = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const res = reader.result as string;
                            // Remove data:image/...;base64, prefix to get raw base64
                            resolve(res.split(',')[1]);
                        };
                        reader.readAsDataURL(blob);
                    });
                    imageBase64 = base64Data;
                }
            } catch (e) {
                console.warn("Could not fetch image for AI context:", e);
            }
        }
        
        const aiPromise = generateProductContent(rawInput, {
            validMaterials: availableMaterials,
            validCategories: availableCategories,
            imageBase64: imageBase64
        });

        aiData = await Promise.race([aiPromise, timeoutPromise]) as any;

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        if (error.message !== "Tiempo de espera agotado (15s)") {
             showError('Error IA', `Fallo al generar: ${error.message || 'Error desconocido'}`);
        } else {
             console.warn("AI Timeout");
             showError('Timeout IA', 'La IA tardó demasiado. Intenta de nuevo.');
        }
    }
    
    setIsGenerating(false);

    if (aiData) {
        setFormData(prev => ({
            ...prev,
            // Only update fields that are present in AI response
            name: aiData.name || prev.name,
            description: aiData.description || prev.description,
            shortDescription: aiData.shortDescription || prev.shortDescription,
            metaTitle: aiData.metaTitle || prev.metaTitle,
            metaDescription: aiData.metaDescription || prev.metaDescription,
            // Convert string "keywords" from AI to array
            seoKeywords: typeof aiData.keywords === 'string' 
                ? aiData.keywords.split(',').map((k: string) => k.trim()) 
                : (Array.isArray(aiData.keywords) ? aiData.keywords : prev.seoKeywords),
            
            categoryName: aiData.categorySuggestion || prev.categoryName,
            // Add material if it's a product and not already set
            materials: (prev.kind === 'product') 
                ? (aiData.materialSuggestion ? [aiData.materialSuggestion] : prev.materials)
                : undefined
        }));
        showSuccess('IA: Contenido Generado', 'La inteligencia artificial ha completado los detalles del producto.');
    }
  };

  const handleSubmit = async (e?: React.FormEvent, asDraft: boolean = false) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      // Ensure strict normalization on save
      const finalSlug = generateSlug(formData.slug || formData.name || '');
      
      // Update status and isActive based on save mode
      const targetStatus: 'draft' | 'published' | 'archived' = asDraft ? 'draft' : 'published';
      const targetIsActive = !asDraft; // Draft = inactive, Published = active

      // Auto-populate SEO if missing (Draft or Publish)
      const humanReadable = formData.name || finalSlug;

      const autoMetaTitle = humanReadable;
      const autoMetaDesc = `Descubre ${humanReadable} en Ddreams 3D. Calidad y precisión garantizada.`;

      const baseData = { 
        ...formData, 
        slug: finalSlug,
        status: targetStatus,
        isActive: targetIsActive,
        metaTitle: formData.metaTitle || autoMetaTitle,
        metaDescription: formData.metaDescription || autoMetaDesc
      };
      
      const dataToSave = formData.kind === 'product' 
        ? { ...baseData, materials: (formData as Product).materials || [] }
        : baseData;

      // Select schema based on save mode
      let schema;
      if (asDraft) {
        schema = formData.kind === 'service' ? serviceDraftSchema : productDraftSchema;
      } else {
        schema = formData.kind === 'service' ? serviceSchema : productSchema;
      }
      
      const result = schema.safeParse(dataToSave);

      if (!result.success) {
        const firstError = result.error.issues[0];
        showError('Error de validación', `${firstError.path.join('.')}: ${firstError.message}`);
        setIsSubmitting(false);
        return;
      }

      onSave(dataToSave);
      
      // Update local state to reflect the save
      setFormData(prev => ({
        ...prev,
        status: targetStatus,
        isActive: targetIsActive,
        slug: finalSlug,
        name: prev.name || humanReadable, // Ensure UI updates with auto-generated name
        metaTitle: prev.metaTitle || autoMetaTitle,
        metaDescription: prev.metaDescription || autoMetaDesc
      }));

      // Only close if it's a full save, otherwise keep editing
      if (!asDraft) {
        onClose();
      } else {
        showSuccess('Borrador guardado', 'El producto se ha guardado como borrador. Puedes continuar editando.');
      }
      
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

  const handleDiscard = () => {
    // Clear draft from storage
    try { localStorage.removeItem(getDraftKey()); } catch {}
    
    // Reset form state to clean state (optional, but good practice)
    setIsDirty(false);
    
    // Close modal
    onClose();
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
    isGenerating,
    isImageUploading,
    setIsImageUploading,
    isDirty,
    lastSavedAt,
    slugEditable,
    setSlugEditable,
    handleLockSlug,
    handleGenerateAI,
    editingBlock,
    setEditingBlock,
    newCategoryName,
    setNewCategoryName,
    isAddingCategory,
    setIsAddingCategory,
    handleSubmit,
    handleChange,
    handleSlugChange,
    handleCheckboxChange,
    handleImageUploaded,
    handleEsc,
    requestClose,
    handleDiscard
  };
}
