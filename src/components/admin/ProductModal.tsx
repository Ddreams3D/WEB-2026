'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, ImageIcon } from '@/lib/icons';
import { useToast } from '@/components/ui/ToastManager';
import ImageUpload from './ImageUpload';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';

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

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
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
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    material: '',
    price: 0,
    stock: 999, // Valor por defecto alto ya que es fabricación bajo pedido
    image_url: '',
    isService: false,
    customPriceDisplay: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.categoryName || '',
        material: (product.kind === 'product' && product.materials?.[0]) || '',
        price: product.price,
        stock: 999, // Ignoramos stock real, siempre disponible
        image_url: product.images?.[0]?.url || '',
        isService: product.kind === 'service',
        customPriceDisplay: product.customPriceDisplay || ''
      });
    } else {
      // Si estamos creando uno nuevo y hay un tipo forzado, lo usamos
      const initialIsService = forcedType === 'service' ? true : forcedType === 'product' ? false : false;
      
      setFormData({
        name: '',
        description: '',
        category: '',
        material: '',
        price: 0,
        stock: 999, // Valor por defecto alto
        image_url: '',
        isService: initialIsService,
        customPriceDisplay: ''
      });
    }
    setErrors({});
  }, [product, isOpen, forcedType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }
    if (!formData.image_url) {
      newErrors.image_url = 'La imagen es requerida';
    }
    
    // Validaciones específicas
    if (!formData.isService) {
      if (formData.price <= 0) {
        newErrors.price = 'El precio debe ser mayor a 0';
      }
      // Eliminada validación de stock
      if (!formData.material) {
        newErrors.material = 'El material es requerido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Aseguramos que stock siempre se envíe
      await onSave({
        ...formData,
        stock: 999
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
    if (errors.image_url) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image_url;
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  // Determinar si podemos cambiar el tipo
  const canChangeType = !product && !forcedType;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {product ? 'Editar' : 'Nuevo'} {formData.isService ? 'Servicio' : 'Producto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Item (Solo si es nuevo y no está forzado) */}
          {canChangeType && (
            <div className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={!formData.isService}
                  onChange={() => setFormData(prev => ({ ...prev, isService: false }))}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-white">Producto Físico</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={formData.isService}
                  onChange={() => setFormData(prev => ({ ...prev, isService: true }))}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-white">Servicio</span>
              </label>
            </div>
          )}

          {/* Imagen */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Imagen Principal
            </label>
            <ImageUpload
              value={formData.image_url}
              onChange={handleImageUploaded}
              onRemove={() => setFormData(prev => ({ ...prev, image_url: '' }))}
            />
            {errors.image_url && (
              <p className="text-sm text-red-500">{errors.image_url}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                placeholder="Ej: Modelo Anatómico..."
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-white resize-none"
              placeholder="Descripción detallada..."
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Campos Específicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Precio (S/)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            {formData.isService ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Texto de Precio (Opcional)
                </label>
                <input
                  type="text"
                  name="customPriceDisplay"
                  value={formData.customPriceDisplay}
                  onChange={handleChange}
                  placeholder="Ej: A cotizar, Desde S/ 50"
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                />
              </div>
            ) : (
              // Para productos físicos, ocultamos el input de stock pero mostramos el material
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Material
                </label>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                >
                  <option value="">Seleccionar material</option>
                  {materials.map(mat => (
                    <option key={mat} value={mat}>{mat}</option>
                  ))}
                </select>
                {errors.material && <p className="text-sm text-red-500">{errors.material}</p>}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
