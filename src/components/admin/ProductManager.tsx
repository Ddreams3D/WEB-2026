'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Package, Eye, Filter } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastManager';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import ProductModal from './ProductModal';
import { Product } from '@/shared/types';
import { Service, StoreProduct } from '@/shared/types/domain';
import { ProductService } from '@/services/product.service';
import { ServiceService } from '@/services/service.service';
import { isFirebaseConfigured } from '@/lib/firebase';
import { generateSlug } from '@/lib/utils';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  material: string;
  price: number;
  stock: number;
  image_url: string;
  customPriceDisplay?: string;
  isService: boolean;
}

interface ProductManagerProps {
  mode?: 'product' | 'service' | 'all';
}

export default function ProductManager({ mode = 'all' }: ProductManagerProps) {
  const [products, setProducts] = useState<(Product | Service)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showSuccess, showError } = useToast();

  const loadProducts = useCallback(async () => {
    // Si queremos mock data aunque firebase no esté, quitamos el check estricto o lo manejamos dentro del servicio
    // Por ahora, asumimos que los servicios devuelven mocks si falla la conexión o no hay config
    
    try {
      setLoading(true);
      
      let allItems: (Product | Service)[] = [];

      if (mode === 'all' || mode === 'product') {
        const fetchedProducts = await ProductService.getAllProducts();
        allItems = [...allItems, ...fetchedProducts];
      }
      
      if (mode === 'all' || mode === 'service') {
        const fetchedServices = await ServiceService.getAllServices();
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

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;

    try {
      const productToDelete = products.find(p => p.id === id);
      if (!productToDelete) return;

      if (productToDelete.kind === 'service') {
        await ServiceService.deleteService(id);
      } else {
        await ProductService.deleteProduct(id);
      }
      
      const newProducts = products.filter(product => product.id !== id);
      setProducts(newProducts);
      showSuccess('Eliminado', 'Elemento eliminado correctamente');
    } catch (error) {
      console.error('Error deleting item:', error);
      showError('Error', 'Error al eliminar el elemento');
    }
  };

  const handleSaveProduct = async (formData: ProductFormData) => {
    try {
      // Determine kind based on formData.isService or current mode
      const isService = formData.isService || mode === 'service';

      if (selectedProduct) {
        // Actualizar existente
        const baseUpdate = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          categoryName: formData.category,
          images: selectedProduct.images.length > 0 
            ? [{ ...selectedProduct.images[0], url: formData.image_url }]
            : [{ 
                id: `img-${Date.now()}`, 
                productId: selectedProduct.id, 
                url: formData.image_url, 
                alt: formData.name, 
                isPrimary: true,
                createdAt: new Date(),
                updatedAt: new Date()
              }],
        };

        if (selectedProduct.kind === 'service' || isService) {
           const serviceUpdate: Partial<Service> = {
             ...baseUpdate,
             kind: 'service',
             customPriceDisplay: formData.customPriceDisplay
           };
           // @ts-ignore - ID mismatch in types sometimes
           await ServiceService.updateService(selectedProduct.id, serviceUpdate);
        } else {
           const productUpdate: Partial<StoreProduct> = {
             ...baseUpdate,
             stock: formData.stock,
             kind: 'product',
             materials: [formData.material]
           };
           // @ts-ignore
           await ProductService.updateProduct(selectedProduct.id, productUpdate);
        }
        await loadProducts();
        showSuccess('Actualizado', 'Elemento actualizado correctamente');
      } else {
        // Crear nuevo
        const commonData = {
          name: formData.name,
          slug: generateSlug(formData.name),
          description: formData.description,
          price: formData.price,
          currency: 'PEN',
          categoryId: 'general',
          categoryName: formData.category,
          sellerId: 'admin',
          sellerName: 'Admin',
          images: [{
            id: `img-${Date.now()}`, 
            productId: 'temp-id', 
            url: formData.image_url, 
            alt: formData.name, 
            isPrimary: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }],
          specifications: [],
          tags: [],
          isActive: true,
          isFeatured: false,
          rating: 0,
          reviewCount: 0
        };

        if (isService) {
           await ServiceService.createService({
             ...commonData,
             kind: 'service',
             isService: true,
             customPriceDisplay: formData.customPriceDisplay || 'A cotizar',
             displayOrder: 0,
             shortDescription: formData.description.substring(0, 150)
           } as Partial<Service>);
        } else {
           await ProductService.createProduct({
             ...commonData,
             stock: formData.stock,
             kind: 'product',
             materials: [formData.material]
           } as Partial<StoreProduct>);
        }
        await loadProducts();
        showSuccess('Creado', 'Elemento creado correctamente');
      }
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving item:', error);
      showError('Error', 'Error al guardar los cambios');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Buscar ${mode === 'service' ? 'servicios' : mode === 'product' ? 'productos' : 'items'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground transition-all duration-200 outline-none"
          />
        </div>
        <Button onClick={handleAddProduct} variant="gradient" className="gap-2">
          <Plus className="w-5 h-5" />
          {mode === 'service' ? 'Nuevo Servicio' : mode === 'product' ? 'Nuevo Producto' : 'Nuevo Item'}
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Imagen</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Categoría</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Precio</th>
                {mode !== 'service' && <th className="px-6 py-4 text-sm font-semibold text-foreground">Stock</th>}
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Tipo</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Cargando datos...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No se encontraron elementos</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden border border-border">
                        {product.images?.[0] ? (
                          <ProductImage
                            src={product.images[0].url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {product.categoryName}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {product.kind === 'service' 
                        ? (product.customPriceDisplay || 'Cotización') 
                        : `S/ ${product.price.toFixed(2)}`}
                    </td>
                    {mode !== 'service' && (
                      <td className="px-6 py-4 text-muted-foreground">
                        {product.kind === 'product' ? product.stock : '-'}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.kind === 'service'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        {product.kind === 'service' ? 'Servicio' : 'Producto'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        // Force type if mode is strict
        forcedType={mode === 'all' ? undefined : mode}
      />
    </div>
  );
}
