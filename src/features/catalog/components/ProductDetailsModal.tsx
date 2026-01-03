import React, { useState } from 'react';
import Link from 'next/link';
import { X, ShoppingCart, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/ToastManager';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductDetailsModalProps {
  product: Product | Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when product changes or modal opens
  React.useEffect(() => {
    if (isOpen && product) {
      const primaryIndex = product.images.findIndex(img => img.isPrimary);
      setCurrentImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
    }
  }, [isOpen, product]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!product || product.kind !== 'product') return;
    addToCart(product as Product, 1);
    showSuccess('Producto agregado', `${product.name} agregado al carrito`);
    onClose();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const currentImage = product.images[currentImageIndex] || product.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={cn(
        "rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in",
        "bg-card text-card-foreground"
      )}>
        <Button
          onClick={onClose}
          variant="overlay"
          size="icon"
          className="absolute top-4 right-4 rounded-full z-10 opacity-70 hover:opacity-100"
          aria-label="Cerrar detalles"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="relative h-48 sm:h-64 w-full group">
          <ProductImage
            src={currentImage?.url}
            alt={currentImage?.alt || product.name}
            fill
            className="object-contain bg-muted"
          />
          
          {/* Navigation Arrows */}
          {product.images.length > 1 && (
            <>
              <Button
                onClick={prevImage}
                variant="overlay"
                size="icon"
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 rounded-full",
                  "opacity-0 group-hover:opacity-100 transition-all duration-200"
                )}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                onClick={nextImage}
                variant="overlay"
                size="icon"
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 rounded-full",
                  "opacity-0 group-hover:opacity-100 transition-all duration-200"
                )}
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
              
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === currentImageIndex 
                        ? "w-4 bg-primary" 
                        : "bg-muted-foreground/50 hover:bg-muted-foreground"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute top-4 left-4">
            <span className={cn(
              "text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg",
              "bg-primary"
            )}>
              {product.categoryName}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              {product.name}
            </h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                S/ {product.price.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                IGV incluido
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-muted-foreground text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications / Details */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="rounded-xl p-4 mb-6 space-y-3 bg-muted/50">
              {product.specifications.map((spec) => (
                <div key={spec.id || spec.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-foreground min-w-[120px]">
                    {spec.name}:
                  </span>
                  <span className="text-muted-foreground whitespace-pre-line">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            {product.kind !== 'service' && product.price > 0 ? (
              <Button
                onClick={handleAddToCart}
                variant="gradient"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Agregar al carrito
              </Button>
            ) : (
              <Button
                asChild
                variant="gradient"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Link href="/contact">
                  <MessageSquare className="w-5 h-5" />
                  Cotizar
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
