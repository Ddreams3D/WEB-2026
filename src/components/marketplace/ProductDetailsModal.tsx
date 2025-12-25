import React from 'react';
import Image from 'next/image';
import { X, ShoppingCart } from 'lucide-react';
import { Product } from '../../shared/types';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../ui/ToastManager';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, 1);
    showToast('success', 'Producto agregado', `${product.name} agregado al carrito`);
    onClose();
  };

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors z-10"
          aria-label="Cerrar detalles"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 sm:h-80 w-full">
          <Image
            src={primaryImage?.url || '/images/placeholder-product.svg'}
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              {product.categoryName}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              {product.name}
            </h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                S/ {product.price.toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                IGV incluido
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications / Details */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4 mb-6 space-y-3">
              {product.specifications.map((spec) => (
                <div key={spec.id || spec.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-neutral-900 dark:text-white min-w-[120px]">
                    {spec.name}:
                  </span>
                  <span className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto bg-primary-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-primary-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ShoppingCart className="w-5 h-5" />
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
