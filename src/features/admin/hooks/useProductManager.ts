import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/ToastManager';
import { Product } from '@/shared/types';
import { Service, StoreProduct } from '@/shared/types/domain';
import { ProductService } from '@/services/product.service';
import { ServiceService } from '@/services/service.service';
import { generateSlug } from '@/lib/utils';
import { revalidateCatalog } from '@/app/actions/revalidate';

interface UseProductManagerProps {
  mode: 'product' | 'service' | 'all';
}

export function useProductManager({ mode }: UseProductManagerProps) {
  const [products, setProducts] = useState<(Product | Service)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDeleted, setShowDeleted] = useState(false);
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'price' | 'category' | 'status'>('recent');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
    variant: 'warning' as 'warning' | 'danger' | 'info',
    isLoading: false
  });
  const { showSuccess, showError } = useToast();

  // Calculate category counts for ProductModal
  const categoryCounts = useMemo(() => {
    return products.reduce((acc, curr) => {
      if (curr.kind === 'product' && curr.categoryName) {
        acc[curr.categoryName] = (acc[curr.categoryName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const loadProducts = useCallback(async (force = false) => {
    try {
      setLoading(true);
      
      const fetchProductsPromise = (mode === 'all' || mode === 'product') 
        ? ProductService.getAllProducts(force, true) 
        : Promise.resolve([]);

      const fetchServicesPromise = (mode === 'all' || mode === 'service')
        ? ServiceService.getAllServices(force, true)
        : Promise.resolve([]);

      const [fetchedProducts, fetchedServices] = await Promise.all([
        fetchProductsPromise,
        fetchServicesPromise
      ]);
      
      setProducts([...fetchedProducts, ...fetchedServices]);
    } catch (error) {
      console.error('Error loading items:', error);
      showError('Error', 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [showError, mode]);

  useEffect(() => {
    loadProducts(false);
  }, [loadProducts]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product | Service) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeConfirmation = () => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleDeleteProduct = (id: string) => {
    setConfirmation({
      isOpen: true,
      title: 'Mover a Papelera',
      message: 'El elemento será movido a la papelera. Podrás restaurarlo después.',
      variant: 'warning',
      isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmation(prev => ({ ...prev, isLoading: true }));
          const productToDelete = products.find(p => p.id === id);
          if (!productToDelete) return;

          if (productToDelete.kind === 'service') {
            await ServiceService.deleteService(id);
          } else {
            await ProductService.deleteProduct(id);
          }
          
          setProducts(prev => prev.map(p => p.id === id ? { ...p, isDeleted: true, isActive: false } : p));
          
          await revalidateCatalog();
          
          showSuccess('Papelera', 'Elemento movido a la papelera');
          closeConfirmation();
        } catch (error) {
          console.error('Error deleting item:', error);
          showError('Error', 'Error al eliminar el elemento');
          setConfirmation(prev => ({ ...prev, isLoading: false }));
        }
      }
    });
  };

  const handleRestoreProduct = async (id: string) => {
    try {
        const productToRestore = products.find(p => p.id === id);
        if (!productToRestore) return;

        if (productToRestore.kind === 'service') {
            await ServiceService.restoreService(id);
        } else {
            await ProductService.restoreProduct(id);
        }

        setProducts(prev => prev.map(p => p.id === id ? { ...p, isDeleted: false } : p));
        await revalidateCatalog();
        showSuccess('Restaurado', 'Elemento restaurado correctamente');
    } catch (error) {
        console.error('Error restoring item:', error);
        showError('Error', 'Error al restaurar el elemento');
    }
  };

  const handlePermanentDeleteProduct = (id: string) => {
      setConfirmation({
        isOpen: true,
        title: 'Eliminar Definitivamente',
        message: '¿Estás seguro? Se eliminarán todas las imágenes y datos. NO SE PUEDE DESHACER.',
        variant: 'danger',
        isLoading: false,
        onConfirm: async () => {
          try {
            setConfirmation(prev => ({ ...prev, isLoading: true }));
            const productToDelete = products.find(p => p.id === id);
            if (!productToDelete) return;
  
            if (productToDelete.kind === 'service') {
              await ServiceService.permanentDeleteService(id);
            } else {
              await ProductService.permanentDeleteProduct(id);
            }
            
            setProducts(prev => prev.filter(p => p.id !== id));
            await revalidateCatalog();
            
            showSuccess('Eliminado', 'Elemento eliminado definitivamente');
            closeConfirmation();
          } catch (error) {
            console.error('Error permanently deleting item:', error);
            showError('Error', 'Error al eliminar el elemento');
            setConfirmation(prev => ({ ...prev, isLoading: false }));
          }
        }
      });
  };

  const handleSaveProduct = async (formData: Partial<Product | Service>) => {
    try {
      if (selectedProduct) {
        // UPDATE
        let success = false;
        // @ts-ignore - kind check is safe here
        if (selectedProduct.kind === 'service' || formData.kind === 'service') {
           const result = await ServiceService.updateService(selectedProduct.id, formData as unknown as Partial<Service>);
           success = !!result;
        } else {
           const result = await ProductService.updateProduct(selectedProduct.id, formData as unknown as Partial<StoreProduct>);
           success = !!result;
        }
        
        if (!success) {
           throw new Error('Error al actualizar: Producto no encontrado o error en la base de datos.');
        }

        // VERIFICACIÓN INMEDIATA
        let verifiedProduct;
        if (selectedProduct.kind === 'service') {
            verifiedProduct = await ServiceService.getServiceById(selectedProduct.id);
        } else {
            verifiedProduct = await ProductService.getProductById(selectedProduct.id);
        }
        
        const inputImages = formData.images || [];
        const savedImages = verifiedProduct?.images || [];
        
        if (inputImages.length !== savedImages.length) {
            console.error('[ProductManager] ¡ALERTA DE CONSISTENCIA! Las imágenes guardadas no coinciden con las enviadas.', {
                enviadas: inputImages.length,
                guardadas: savedImages.length
            });
            showError('Advertencia', 'El producto se guardó pero hay una discrepancia en las imágenes. Por favor verifica.');
        }

        showSuccess('Actualizado', 'Elemento actualizado correctamente');
      } else {
        // CREATE
        const newProduct = {
            ...formData,
            rating: 0,
            reviewCount: 0,
            sellerId: 'admin',
            sellerName: 'Admin',
            currency: 'PEN',
            createdAt: new Date(),
            updatedAt: new Date(),
            slug: formData.slug || generateSlug(formData.name || '')
        };

        // @ts-ignore - kind check is safe here
        if (formData.kind === 'service') {
           await ServiceService.createService(newProduct as unknown as Partial<Service>);
        } else {
           await ProductService.createProduct(newProduct as unknown as Partial<StoreProduct>);
        }
        showSuccess('Creado', 'Elemento creado correctamente');
      }
      
      await revalidateCatalog();
      await loadProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving item:', error);
      showError('Error', 'Error al guardar el elemento');
    }
  };

  const filteredProducts = products.filter(product => {
    if (showDeleted) {
        if (!product.isDeleted) return false;
    } else {
        if (product.isDeleted) return false;
    }

    if (filterActive !== 'all') {
      const isActive = !!product.isActive;
      if (filterActive === 'active' && !isActive) return false;
      if (filterActive === 'inactive' && isActive) return false;
    }

    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }).sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name) * dir;
      case 'price':
        return ((a as any).price ?? 0) > ((b as any).price ?? 0) ? dir : -dir;
      case 'category':
        return (a.categoryName || '').localeCompare(b.categoryName || '') * dir;
      case 'status':
        return (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1) * dir;
      case 'recent':
      default:
        const ad = (a as any).updatedAt ? new Date((a as any).updatedAt).getTime() : 0;
        const bd = (b as any).updatedAt ? new Date((b as any).updatedAt).getTime() : 0;
        return (ad - bd) * dir;
    }
  });

  return {
    products,
    loading,
    searchTerm,
    selectedProduct,
    isModalOpen,
    viewMode,
    showDeleted,
    filterActive,
    sortBy,
    sortDir,
    confirmation,
    categoryCounts,
    filteredProducts,
    isSeeding,
    setSearchTerm,
    setViewMode,
    setShowDeleted,
    setFilterActive,
    setSortBy,
    setSortDir,
    setIsModalOpen,
    setSelectedProduct,
    loadProducts,
    handleAddProduct,
    handleEditProduct,
    closeConfirmation,
    handleDeleteProduct,
    handleRestoreProduct,
    handlePermanentDeleteProduct,
    handleSaveProduct
  };
}
