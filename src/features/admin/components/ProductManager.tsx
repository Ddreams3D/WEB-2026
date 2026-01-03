'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package } from '@/lib/icons';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastManager';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import ProductModal from './ProductModal';
import { ViewToggle } from './ViewToggle';
import ConnectionStatus from './ConnectionStatus';
import ConfirmationModal from './ConfirmationModal';
import { Product } from '@/shared/types';
import { Service, StoreProduct } from '@/shared/types/domain';
import { ProductService } from '@/services/product.service';
import { ServiceService } from '@/services/service.service';
import { LocalStorageService } from '@/services/local-storage.service';
import { isFirebaseConfigured } from '@/lib/firebase';
import { generateSlug } from '@/lib/utils';
import { revalidateCatalog } from '@/app/actions/revalidate';

interface ProductManagerProps {
  mode?: 'product' | 'service' | 'all';
}

export default function ProductManager({ mode = 'all' }: ProductManagerProps) {
  const [products, setProducts] = useState<(Product | Service)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
    variant: 'warning' as 'warning' | 'danger' | 'info',
    isLoading: false
  });
  const { showSuccess, showError } = useToast();

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      let allItems: (Product | Service)[] = [];

      if (mode === 'all' || mode === 'product') {
        // Force refresh to ensure we get the latest data from Firestore
        const fetchedProducts = await ProductService.getAllProducts(true);
        allItems = [...allItems, ...fetchedProducts];
      }
      
      if (mode === 'all' || mode === 'service') {
        // Force refresh to ensure we get the latest data from Firestore
        const fetchedServices = await ServiceService.getAllServices(true);
        allItems = [...allItems, ...fetchedServices];
      }
      
      setProducts(allItems);
    } catch (error) {
      console.error('Error loading items:', error);
      showError('Error', 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [showError, mode]);

  useEffect(() => {
    loadProducts();
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
    // Usar window.confirm para confirmación síncrona
    if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
      (async () => {
        try {
          // setConfirmation({ ...prev, isLoading: true }) // No necesario con window.confirm
          const productToDelete = products.find(p => p.id === id);
          if (!productToDelete) return;

          if (productToDelete.kind === 'service') {
            await ServiceService.deleteService(id);
          } else {
            await ProductService.deleteProduct(id);
          }
          
          const newProducts = products.filter(product => product.id !== id);
          setProducts(newProducts);
          
          // Revalidate cache for public site
          await revalidateCatalog();
          
          showSuccess('Eliminado', 'Elemento eliminado correctamente');
        } catch (error) {
          console.error('Error deleting item:', error);
          showError('Error', 'Error al eliminar el elemento');
        }
      })();
    }
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

        // VERIFICACIÓN INMEDIATA (Self-Correction)
        console.log('[ProductManager] Verificando actualización...');
        let verifiedProduct;
        if (selectedProduct.kind === 'service') {
            verifiedProduct = await ServiceService.getServiceById(selectedProduct.id);
        } else {
            verifiedProduct = await ProductService.getProductById(selectedProduct.id);
        }
        
        // Comparar imágenes
        const inputImages = formData.images || [];
        const savedImages = verifiedProduct?.images || [];
        
        if (inputImages.length !== savedImages.length) {
            console.error('[ProductManager] ¡ALERTA DE CONSISTENCIA! Las imágenes guardadas no coinciden con las enviadas.', {
                enviadas: inputImages.length,
                guardadas: savedImages.length
            });
            showError('Advertencia', 'El producto se guardó pero hay una discrepancia en las imágenes. Por favor verifica.');
        } else {
            console.log('[ProductManager] Verificación exitosa: Datos consistentes.');
        }

        showSuccess('Actualizado', 'Elemento actualizado correctamente');
      } else {
        // CREATE
        const newProduct = {
            ...formData,
            // Defaults
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
      
      // Revalidate cache for public site
      await revalidateCatalog();
      
      await loadProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving item:', error);
      showError('Error', 'Error al guardar el elemento');
    }
  };

  const handleSeed = (force = false) => {
    const message = force 
      ? '¿Estás seguro de recargar los datos estáticos? Esto sobrescribirá los productos existentes con los datos originales.' 
      : '¿Importar productos desde el archivo estático? Esto creará documentos en Firestore.';
      
    if (window.confirm(message)) {
      (async () => {
        try {
          setIsSeeding(true);

          // 1. Forzar siembra en DB
          if (mode === 'all' || mode === 'product') {
            await ProductService.seedProducts(force);
          }
          if (mode === 'all' || mode === 'service') {
            await ServiceService.seedServices(force);
          }
          
          // 2. Revalidar caché de Next.js
          await revalidateCatalog();

          // 3. Recargar datos frescos
          await loadProducts();
          
          showSuccess('Sincronización Completa', 'El catálogo se ha alineado correctamente con el sistema base.');
        } catch (error) {
          console.error('Error syncing catalog:', error);
          showError('Error', 'Falló la sincronización. Revisa la consola.');
        } finally {
          setIsSeeding(false);
        }
      })();
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        variant={confirmation.variant}
        isLoading={confirmation.isLoading}
      />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Gestión de Catálogo</h1>
            <ConnectionStatus />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-800 border rounded-lg dark:border-neutral-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
           <ViewToggle view={viewMode} onViewChange={setViewMode} />
           <Button variant="outline" onClick={() => handleSeed(true)} disabled={isSeeding}>
            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Sincronizar Datos Estáticos
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button onClick={handleAddProduct} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Nuevo {mode === 'service' ? 'Servicio' : mode === 'product' ? 'Producto' : 'Elemento'}
          </Button>
        </div>
      </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                        <div className="flex justify-center items-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            Cargando catálogo...
                        </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                        <div className="flex flex-col items-center gap-2">
                            <Package className="w-8 h-8 text-neutral-300" />
                            <p>No se encontraron productos</p>
                        </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                              {product.images?.[0] ? (
                                <ProductImage
                                  src={product.images.find(i => i.isPrimary)?.url || product.images[0].url}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                                <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]" title={product.name}>
                                    {product.name}
                                </div>
                                <div className="text-xs text-neutral-500 truncate max-w-[200px]">
                                    {product.description}
                                </div>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                            {product.categoryName || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {product.kind === 'service' && (product as Service).customPriceDisplay 
                            ? (product as Service).customPriceDisplay
                            : `S/ ${product.price.toFixed(2)}`
                        }
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                          product.kind === 'service' 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                        }`}>
                          {product.kind === 'service' ? 'Servicio' : 'Producto'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.isActive 
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-amber-500'}`} />
                            {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-neutral-500 hover:text-primary hover:bg-primary/10"
                            onClick={() => handleEditProduct(product)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-neutral-500 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-[4/3] relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                 <ProductImage 
                    src={product.images.find(i => i.isPrimary)?.url || product.images[0].url} 
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                 />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <Package className="w-12 h-12" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => handleEditProduct(product)}
                >
                  <Edit className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-red-500/80 hover:text-white"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.kind === 'service' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                }`}>
                  {product.kind === 'service' ? 'Servicio' : 'Producto'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
                  {product.name}
                </h3>
                <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
                    {product.kind === 'service' && (product as Service).customPriceDisplay 
                        ? (product as Service).customPriceDisplay
                        : `S/ ${product.price.toFixed(2)}`
                    }
                </span>
              </div>
              
              <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 h-10">
                {product.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {product.categoryName}
                </span>
                <span className={`flex items-center gap-1.5 text-xs font-medium ${
                    product.isActive ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                      product.isActive ? 'bg-green-500' : 'bg-amber-500'
                  }`} />
                  {product.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
      
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        forcedType={mode === 'service' ? 'service' : mode === 'product' ? 'product' : undefined}
      />
    </div>
  );
}
