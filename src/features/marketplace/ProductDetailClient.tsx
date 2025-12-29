'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, CartItemCustomization } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/ToastManager';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Star, Share2, Heart, Check, MessageSquare, Maximize2, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { ProductTabs } from './ProductTabs';

interface Props {
  product: Product | Service;
  relatedProducts?: (Product | Service)[];
}

export default function ProductDetailClient({ product: initialProduct, relatedProducts = [] }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSource = searchParams.get('from');

  const [product, setProduct] = useState<Product | Service>(initialProduct);

  // Sync with localStorage for Admin Panel updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProducts = localStorage.getItem('marketplace_products');
      if (storedProducts) {
        try {
          const parsed = JSON.parse(storedProducts);
          const found = parsed.find((p: Product | Service) => p.id === initialProduct.id);
          if (found) {
             const foundUpdatedAt = new Date(found.updatedAt);
             // Solo usar datos de localStorage si son más recientes que los datos iniciales (del servidor/mock)
             if (!initialProduct.updatedAt || foundUpdatedAt > initialProduct.updatedAt) {
               // Hydrate dates
               const hydrated = {
                 ...found,
                 createdAt: new Date(found.createdAt),
                 updatedAt: foundUpdatedAt,
                 images: found.images?.map((img: any) => ({
                   ...img,
                   createdAt: img.createdAt ? new Date(img.createdAt) : undefined,
                   updatedAt: img.updatedAt ? new Date(img.updatedAt) : undefined
                 })),
                 // Ensure new fields like tabs are preserved if missing in storage
                 tabs: found.tabs || initialProduct.tabs,
                 tabsTitle: found.tabsTitle || initialProduct.tabsTitle
               };
               setProduct(hydrated);
             }
          }
        } catch (e) {
          console.error('Error parsing stored products:', e);
        }
      }
    }
  }, [initialProduct]);

  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [selectedImageId, setSelectedImageId] = useState<string>(
    product.images.find(img => img.isPrimary)?.id || product.images[0]?.id
  );
  
  // Estado para las Tabs (usa la primera tab disponible o 'b2c' por defecto)
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialProduct.tabs && initialProduct.tabs.length > 0) {
      return initialProduct.tabs[0].id;
    }
    return 'b2c';
  });
  
  // Update selectedImageId if product changes (e.g. from storage sync)
  useEffect(() => {
     setSelectedImageId(product.images.find(img => img.isPrimary)?.id || product.images[0]?.id);
  }, [product]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    // Inicializar opciones por defecto
    const defaults: Record<string, string> = {};
    if (initialProduct.kind === 'product' && initialProduct.options) {
      initialProduct.options.forEach(option => {
        const defaultVal = option.values.find(v => v.isDefault);
        if (defaultVal) {
          defaults[option.id] = defaultVal.id;
        }
      });
    }
    return defaults;
  });
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedImage = product.images.find(img => img.id === selectedImageId) || product.images[0];

  // Helper para ajustar el encuadre de imágenes específicas
  const getImageClassName = (imageId: string | undefined, isThumbnail: boolean = false) => {
    const baseClass = "object-cover";
    
    // Fix para product-2-b que está muy alejada (zoomed out)
    if (imageId === '2-b') {
       // Aplicar escala para hacer zoom
       if (isThumbnail) {
         return `${baseClass} scale-125`;
       }
       return `${baseClass} transition-transform duration-500 scale-125 hover:scale-[1.35]`;
    }
    
    if (isThumbnail) {
      return baseClass;
    }
    
    return `${baseClass} transition-transform duration-500 hover:scale-105`;
  };

  // Calcular precio total incluyendo opciones
  const currentPrice = product.price + Object.entries(selectedOptions).reduce((total, [optionId, valueId]) => {
    if (product.kind !== 'product' || !product.options) return total;
    const option = product.options.find(o => o.id === optionId);
    const value = option?.values.find(v => v.id === valueId);
    return total + (value?.priceModifier || 0);
  }, 0);

  const handleOptionChange = (optionId: string, valueId: string, checked: boolean) => {
    setSelectedOptions(prev => {
      const next = { ...prev };
      if (checked) {
        next[optionId] = valueId;
      } else {
        delete next[optionId];
      }
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (product.kind !== 'product') return;

    try {
      // Validar inputs personalizados requeridos
      for (const [optionId, valueId] of Object.entries(selectedOptions)) {
        const option = product.options?.find(o => o.id === optionId);
        const value = option?.values.find(v => v.id === valueId);
        
        if (value?.hasInput && (!customInputs[optionId] || customInputs[optionId].trim() === '')) {
          showError('Faltan datos', `Por favor especifica tu ${option?.name.toLowerCase()}.`);
          return;
        }
      }

      setIsAdding(true);
      
      // Crear producto con precio actualizado y metadatos de opciones
      const productWithOptions = {
        ...product,
        price: currentPrice
      };

      // Preparar lista de customizaciones para el carrito
      const customizations: CartItemCustomization[] = Object.entries(selectedOptions).map(([optionId, valueId]) => {
        const option = product.options?.find(o => o.id === optionId);
        const value = option?.values.find(v => v.id === valueId);
        
        let displayValue = value?.name || '';
        // Si la opción tiene input personalizado (como "Otro color"), agregarlo al valor
        if (value?.hasInput && customInputs[optionId]) {
          displayValue = `${value.name}: ${customInputs[optionId]}`;
        }

        return {
          id: optionId,
          name: option?.name || '',
          value: displayValue,
          priceModifier: value?.priceModifier
        };
      });

      await addToCart(productWithOptions as Product, 1, customizations);
      showSuccess('Producto agregado', `${product.name} se añadió al carrito correctamente.`);
    } catch (error) {
      showError('Error', 'No se pudo agregar el producto al carrito.');
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAction = () => {
    if (product.kind === 'product' && product.price > 0) {
      handleAddToCart();
    } else {
      router.push('/contact');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    // Optionally redirect to checkout or open cart drawer
    // For now, we'll just add to cart as per standard behavior
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.shortDescription || `Mira este producto: ${product.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess('Enlace copiado', 'El enlace del producto ha sido copiado al portapapeles.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleNextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const currentIndex = product.images.findIndex(img => img.id === selectedImageId);
    const nextIndex = (currentIndex + 1) % product.images.length;
    setSelectedImageId(product.images[nextIndex].id);
  }, [product.images, selectedImageId]);

  const handlePrevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const currentIndex = product.images.findIndex(img => img.id === selectedImageId);
    const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    setSelectedImageId(product.images[prevIndex].id);
  }, [product.images, selectedImageId]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isModalOpen) return;
    if (e.key === 'Escape') setIsModalOpen(false);
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'ArrowLeft') handlePrevImage();
  }, [isModalOpen, handleNextImage, handlePrevImage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 lg:pt-32 lg:pb-20 max-w-7xl font-sans text-foreground">
      <Button 
        asChild
        variant="outline"
        className="rounded-full mb-8 h-auto py-2 px-4 backdrop-blur-sm hover:border-primary hover:text-primary hover:bg-primary/5"
      >
        <Link 
          href={fromSource === 'services' ? '/services' : '/marketplace'} 
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {fromSource === 'services' ? 'Volver a Servicios' : 'Volver al Marketplace'}
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 lg:gap-16 items-start">
        {/* Product Images Section */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div 
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-sm cursor-zoom-in group",
              "bg-muted/30"
            )}
            onClick={() => setIsModalOpen(true)}
          >
            <ProductImage
              src={selectedImage?.url}
              alt={selectedImage?.alt || product.name}
              fill
              className={getImageClassName(selectedImage?.id)}
              priority
            />
            
            {/* Zoom Indicator - Bottom Right Corner */}
            <div className="absolute bottom-4 right-4 z-20 transition-all duration-300 transform group-hover:scale-110">
              <div className="bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md shadow-lg border border-white/10 hover:bg-black/80 transition-colors">
                 <Maximize2 className="w-5 h-5" />
              </div>
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image) => (
                <div 
                  key={image.id} 
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                    selectedImageId === image.id 
                      ? 'border-primary ring-2 ring-primary/20 ring-offset-2 dark:ring-offset-background' 
                      : 'border-transparent hover:border-border'
                  }`}
                  onClick={() => setSelectedImageId(image.id)}
                >
                  <ProductImage
                    src={image.url}
                    alt={image.alt}
                    fill
                    className={getImageClassName(image.id, true)}
                    sizes="(max-width: 768px) 25vw, 15vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-sm font-medium px-3 py-1 border-primary/20 text-primary bg-primary/5">
                {product.categoryName}
              </Badge>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleShare}
                  variant="outline" 
                  size="icon" 
                  title="Compartir" 
                  className="h-8 w-8 rounded-full border-border hover:bg-muted hover:text-primary transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1.5 text-sm font-semibold text-foreground">
                    {product.rating} <span className="text-muted-foreground font-normal">({product.reviewCount} reseñas)</span>
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-3 tracking-tight leading-tight">
              {product.name}
            </h1>
            {/* Subtítulo reforzado */}
            {product.shortDescription && (
              <h2 className="text-lg lg:text-xl font-medium text-muted-foreground mb-4 leading-relaxed">
                {product.shortDescription}
              </h2>
            )}
            {product.kind === 'product' && product.sellerName && (
              <p className="text-muted-foreground text-base lg:text-lg flex items-center gap-2">
                Vendido por <span className="font-semibold text-primary underline decoration-primary/30 underline-offset-4">{product.sellerName}</span>
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-3">
              {/* SKU - Ocultar para servicios */}
              {product.kind === 'product' && product.sku && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium mr-2">SKU:</span>
                  {product.sku}
                </div>
              )}

              {/* Stock Status - Ocultar para servicios */}
              {product.kind !== 'service' && (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full mr-2 bg-success animate-pulse" />
                  <span className="text-success font-medium">
                    Fabricación bajo pedido
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Se oculta la sección de precio si el precio es 0 y no hay texto personalizado (para servicios) */}
          {((product.price > 0 && product.kind !== 'service') || product.customPriceDisplay) && (
            <div className="flex items-center justify-between py-6 border-y border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">
                  {product.price > 0 && product.kind !== 'service' ? 'Precio Total' : 'Precio'}
                </p>
                <div className="text-3xl lg:text-4xl font-bold text-foreground flex items-baseline gap-1">
                  {product.price > 0 && product.kind !== 'service' ? (
                    <>
                      <span className="text-lg text-muted-foreground font-normal self-start mt-1">S/</span>
                      {product.price.toFixed(2)}
                    </>
                  ) : (
                    <span className="text-2xl lg:text-3xl">{product.customPriceDisplay || 'Cotización'}</span>
                  )}
                </div>
                {product.price > 0 && product.kind !== 'service' && (
                  <p className="text-xs text-muted-foreground mt-2 font-medium bg-muted inline-block px-2 py-0.5 rounded">IGV incluido</p>
                )}
              </div>
            </div>
          )}

          {/* Sistema de Tabs B2C / B2B */}
          {product.tabs ? (
            <ProductTabs product={product} activeTab={activeTab} setActiveTab={setActiveTab} />
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Opciones del Producto */}
          {product.kind === 'product' && product.options && product.options.length > 0 && (
            <div className={cn(
              "space-y-4 rounded-xl p-5 border border-border",
              "bg-muted/30"
            )}>
              <h3 className="font-bold text-foreground">Opciones de Personalización</h3>
              <div className="space-y-4">
                {product.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    {option.name && (
                      <label className="text-sm font-medium text-foreground block mb-1">
                        {option.name} {option.required && <span className="text-destructive">*</span>}
                      </label>
                    )}
                    
                    {option.type === 'select' && (
                      <div className="relative">
                        <select
                          className={cn(
                            "w-full p-2.5 rounded-lg border border-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer",
                            "bg-background"
                          )}
                          value={selectedOptions[option.id] || ''}
                          onChange={(e) => handleOptionChange(option.id, e.target.value, true)}
                        >
                          <option value="" disabled>Seleccionar {option.name}</option>
                          {option.values.map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.name} {value.priceModifier > 0 ? `(+ S/ ${value.priceModifier.toFixed(2)})` : ''}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    )}

                    {option.type === 'radio' && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => (
                            <label key={value.id} className={cn(
                              "cursor-pointer rounded-lg border px-3 py-2 transition-all duration-200 flex items-center gap-2",
                              selectedOptions[option.id] === value.id 
                                ? cn("border-transparent shadow-md transform scale-[1.02]", "bg-primary text-primary-foreground")
                                : cn("border-border hover:border-primary/50 text-muted-foreground", "hover:bg-muted/50")
                            )}>
                              <input
                                type="radio"
                                name={`option-${option.id}`}
                                className="sr-only"
                                checked={selectedOptions[option.id] === value.id}
                                onChange={() => handleOptionChange(option.id, value.id, true)}
                              />
                              <span className="font-medium text-sm">{value.name}</span>
                              {value.priceModifier > 0 && (
                                <span className={cn(
                                  "text-xs font-bold px-1.5 py-0.5 rounded",
                                  selectedOptions[option.id] === value.id 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-primary/10 text-primary'
                                )}>
                                  +S/{value.priceModifier}
                                </span>
                              )}
                            </label>
                          ))}
                        </div>
                        
                        {/* Input para opción personalizada (ej: Otro color) */}
                        {(() => {
                          const selectedValueId = selectedOptions[option.id];
                          const selectedValue = option.values.find(v => v.id === selectedValueId);
                          
                          if (selectedValue?.hasInput) {
                            const limit = selectedValue.maxLength || 30;
                            return (
                              <div className="mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5 ml-1 flex justify-between">
                                  <span>Especificar {option.name.toLowerCase()}:</span>
                                  <span className="text-xs text-gray-400">
                                    {(customInputs[option.id] || '').length}/{limit}
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  className={cn(
                                    "w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400",
                                    "bg-background"
                                  )}
                                  placeholder={selectedValue.inputPlaceholder || `Escribe tu ${option.name.toLowerCase()} aquí (máx. ${limit} caracteres)...`}
                                  value={customInputs[option.id] || ''}
                                  onChange={(e) => setCustomInputs(prev => ({ ...prev, [option.id]: e.target.value }))}
                                  maxLength={limit}
                                  autoFocus
                                />
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}

                    {option.type === 'checkbox' && option.values.map((value) => (
                      <div key={value.id} className="flex flex-col">
                        <label className={cn(
                          "flex items-start space-x-3 cursor-pointer group p-2 rounded-lg transition-colors",
                          "hover:bg-muted/50"
                        )}>
                          <div className="relative flex items-center mt-0.5">
                            <input
                              type="checkbox"
                              className="peer h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                              checked={selectedOptions[option.id] === value.id}
                              onChange={(e) => handleOptionChange(option.id, value.id, e.target.checked)}
                            />
                          </div>
                          <div className="flex-1 text-sm">
                            <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                              {value.name}
                            </span>
                            {value.priceModifier > 0 && (
                              <span className="ml-2 text-primary font-bold">
                                + S/ {value.priceModifier.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </label>
                        
                        {selectedOptions[option.id] === value.id && value.hasInput && (
                          <div className="ml-10 mr-2 mb-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5 flex justify-between">
                              <span>Detalles:</span>
                              <span className="text-xs text-gray-400">
                                {(customInputs[option.id] || '').length}/{value.maxLength || 30}
                              </span>
                            </label>
                            <input
                              type="text"
                              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                              placeholder={value.inputPlaceholder || `Escribe los detalles aquí (máx. ${value.maxLength || 30} caracteres)...`}
                              value={customInputs[option.id] || ''}
                              onChange={(e) => setCustomInputs(prev => ({ ...prev, [option.id]: e.target.value }))}
                              maxLength={value.maxLength || 30}
                              autoFocus
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications?.map((spec, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-800 col-span-1 md:col-span-2 hover:border-primary/20 transition-colors">
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-bold">{spec.name}</p>
                <div className="font-medium text-gray-900 dark:text-white whitespace-pre-line leading-relaxed text-base">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-border">
            <Button 
              size="lg" 
              variant="gradient"
              className="w-full text-lg h-14 rounded-xl font-bold shadow-lg hover:shadow-xl"
              onClick={handleAction}
              disabled={isAdding}
            >
              {isAdding ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Procesando...
                </span>
              ) : (
                <>
                  {product.kind !== 'service' && product.price > 0 ? (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2.5" />
                      Añadir al Carrito
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5 mr-2.5" />
                      {product.tabs ? (product.tabs.find(t => t.id === activeTab)?.ctaText || 'Solicitar Cotización') : 'Solicitar Cotización'}
                    </>
                  )}
                </>
              )}
            </Button>
            {product.kind !== 'service' && product.price > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-success/10 py-2 rounded-lg">
                <Check className="w-4 h-4 text-success" />
                <span className="font-medium">Compra 100% segura garantizada por Ddreams 3D</span>
              </div>
            )}
          </div>
          
          {product.id !== '7' && product.id !== '8' && (
            <div className="pt-8 mt-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Etiquetas Relacionadas</h3>
              <div className="flex flex-wrap gap-2.5">
                {product.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="px-3.5 py-1.5 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-primary transition-colors text-sm font-medium rounded-full cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Productos Relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard 
                key={relatedProduct.id} 
                product={relatedProduct} 
              />
            ))}
          </div>
        </div>
      )}
      {/* Image Modal - Vitrina Técnica */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button - Consistent hierarchy, semi-transparent */}
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-6 right-6 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 z-[60] rounded-full h-12 w-12 backdrop-blur-md transition-all duration-300 border border-white/10 hover:rotate-90"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Main Stage Container - Adaptive frame */}
          <div 
            className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
             {/* Interactive Zone Container - Captures pointer events for navigation */}
             <div className="relative w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center pointer-events-auto group/stage">
               
               {/* Navigation - Large hit areas, subtle feedback */}
               {product.images.length > 1 && (
                 <>
                   <div className="absolute inset-y-0 left-0 w-[15%] flex items-center justify-start z-50 hover:bg-gradient-to-r hover:from-black/20 hover:to-transparent transition-all duration-500 group/nav-left cursor-pointer" onClick={handlePrevImage}>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="ml-4 md:ml-8 text-white/30 group-hover/nav-left:text-white/90 group-hover/nav-left:bg-black/40 group-hover/nav-left:scale-110 rounded-full h-12 w-12 md:h-16 md:w-16 transition-all duration-300"
                     >
                        <ChevronLeft className="w-10 h-10" />
                     </Button>
                   </div>
                   
                   <div className="absolute inset-y-0 right-0 w-[15%] flex items-center justify-end z-50 hover:bg-gradient-to-l hover:from-black/20 hover:to-transparent transition-all duration-500 group/nav-right cursor-pointer" onClick={handleNextImage}>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="mr-4 md:mr-8 text-white/30 group-hover/nav-right:text-white/90 group-hover/nav-right:bg-black/40 group-hover/nav-right:scale-110 rounded-full h-12 w-12 md:h-16 md:w-16 transition-all duration-300"
                     >
                        <ChevronRight className="w-10 h-10" />
                     </Button>
                   </div>
                 </>
               )}

               {/* Image Container - "Vitrina" with Auto-hide UI logic and Smart Mat */}
               <div className="relative w-full h-full flex items-center justify-center p-0">
                  {/* Smart Vignette / Mat: Only visible if image doesn't fill width (usually vertical images) */}
                  {/* We use a CSS trick: a radial gradient background that acts as a "vignette" behind the image */}
                  {/* Adjusted opacity to 0.02 to avoid washing out edges, creating a subtle spotlight effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none"></div>

                  <ProductImage
                    src={selectedImage?.url}
                    alt={selectedImage?.alt || product.name}
                    fill
                    className="object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10"
                    priority
                    sizes="95vw"
                  />
                  
                  {/* Caption / Counter - Auto-hide on idle, move away from content */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/stage:opacity-100 transition-opacity duration-500 delay-150 flex items-center gap-3 text-xs font-medium px-4 py-2 bg-black/60 rounded-full backdrop-blur-xl border border-white/10 shadow-2xl whitespace-nowrap max-w-[80%] overflow-hidden pointer-events-none z-20">
                      <span className="truncate max-w-[300px] text-white/90 tracking-wide">{selectedImage?.alt || product.name}</span>
                      <span className="w-px h-3 bg-white/20 shrink-0"></span>
                      <span className="shrink-0 text-white/50">{product.images.findIndex(img => img.id === selectedImageId) + 1} <span className="text-white/30 text-[10px] mx-0.5">/</span> {product.images.length}</span>
                  </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

