'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Package, Eye } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastManager';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import ProductModal from './ProductModal';
import { Product } from '@/shared/types';
import { ProductService } from '@/services/product.service';
import { isFirebaseConfigured } from '@/lib/firebase';

// Definimos la estructura de datos que devuelve el formulario
interface ProductFormData {
  name: string;
  description: string;
  category: string;
  material: string;
  price: number;
  stock: number;
  image_url: string;
  customPriceDisplay?: string; // Para servicios
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showSuccess, showError } = useToast();

  const loadProducts = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedProducts = await ProductService.getAllProducts();
      
      // Mostrar todos los productos, incluidos los servicios (que tienen customPriceDisplay)
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      showError('Error', 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await ProductService.deleteProduct(id);
      
      const newProducts = products.filter(product => product.id !== id);
      setProducts(newProducts);
      showSuccess('Producto eliminado', 'Producto eliminado correctamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Error', 'Error al eliminar el producto');
    }
  };

  const handleSaveProduct = async (formData: ProductFormData) => {
    try {
      if (selectedProduct) {
        // Actualizar producto existente
        const updatedData: Partial<Product> = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          categoryName: formData.category,
          materials: [formData.material],
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
              }]
        };

        await ProductService.updateProduct(selectedProduct.id, updatedData);
        await loadProducts(); // Recargar para obtener datos actualizados
        showSuccess('Producto actualizado', 'Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        const newProductData: Partial<Product> = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          currency: 'PEN',
          categoryId: 'general', // Default category ID if not mapped
          categoryName: formData.category,
          customPriceDisplay: formData.customPriceDisplay, // Guardar campo de servicio
          sellerId: 'admin',
          sellerName: 'Admin',
          images: [{
            id: `img-${Date.now()}`, 
            productId: 'temp-id', // Will be replaced in service
            url: formData.image_url, 
            alt: formData.name, 
            isPrimary: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }],
          specifications: [],
          tags: [],
          stock: formData.stock,
          materials: [formData.material],
          isActive: true,
          isFeatured: false,
          rating: 0,
          reviewCount: 0
        };
        
        await ProductService.createProduct(newProductData);
        await loadProducts(); // Recargar para obtener el nuevo producto con su ID real
        showSuccess('Producto creado', 'Producto creado correctamente');
      }

      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      showError('Error', 'Error al guardar el producto');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Productos
          </h1>
        </div>
        <Button
          onClick={handleAddProduct}
          variant="gradient"
          className="flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nuevo Producto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {products.reduce((sum, product) => sum + (product.stock || 0), 0)}
              </p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor Inventario</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                S/. {products.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0).toFixed(2)}
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">S/.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No se encontraron productos' : 'No hay productos'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer producto'}
          </p>
          {!searchTerm && (
            <Button
              onClick={handleAddProduct}
              variant="gradient"
            >
              Agregar Producto
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 relative h-48">
                <ProductImage
                  src={product.images?.[0]?.url || ''}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 text-sm">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-primary">
                    S/. {product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Stock: {product.stock || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                    {product.categoryName || 'General'}
                  </span>
                  <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs font-medium text-blue-700 dark:text-blue-300">
                    {product.materials?.[0] || 'N/A'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditProduct(product)}
                    variant="ghost"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg transition-colors text-sm font-medium h-auto"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteProduct(product.id)}
                    variant="ghost"
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg transition-colors text-sm font-medium h-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
    </div>
  );
}
