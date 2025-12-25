'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/shared/types';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/ToastManager';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Star, Share2, Heart, Check, MessageSquare } from 'lucide-react';

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [selectedImageId, setSelectedImageId] = useState<string>(
    product.images.find(img => img.isPrimary)?.id || product.images[0]?.id
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);

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
    const option = product.options?.find(o => o.id === optionId);
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
    try {
      // Validar inputs personalizados requeridos
      for (const [optionId, valueId] of Object.entries(selectedOptions)) {
        const option = product.options?.find(o => o.id === optionId);
        const value = option?.values.find(v => v.id === valueId);
        
        if (value?.hasInput && (!customInputs[optionId] || customInputs[optionId].trim() === '')) {
          showToast('error', 'Faltan datos', `Por favor especifica tu ${option?.name.toLowerCase()}.`);
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
      const customizations = Object.entries(selectedOptions).map(([optionId, valueId]) => {
        const option = product.options?.find(o => o.id === optionId);
        const value = option?.values.find(v => v.id === valueId);
        
        let displayValue = value?.name;
        // Si la opción tiene input personalizado (como "Otro color"), agregarlo al valor
        if (value?.hasInput && customInputs[optionId]) {
          displayValue = `${value.name}: ${customInputs[optionId]}`;
        }

        return {
          id: optionId,
          name: option?.name,
          value: displayValue,
          priceModifier: value?.priceModifier
        };
      });

      await addToCart(productWithOptions, 1, customizations);
      showToast('success', 'Producto agregado', `${product.name} se añadió al carrito correctamente.`);
    } catch (error) {
      showToast('error', 'Error', 'No se pudo agregar el producto al carrito.');
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAction = () => {
    if (product.price > 0) {
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

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 max-w-7xl font-sans text-gray-900 dark:text-gray-100 min-h-screen">
      <Link 
        href="/marketplace" 
        className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Volver al Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 lg:gap-16 items-start">
        {/* Product Images Section */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm">
            <ProductImage
              src={selectedImage?.url}
              alt={selectedImage?.alt || product.name}
              fill
              className={getImageClassName(selectedImage?.id)}
              priority
            />
            {product.isFeatured && (
              <Badge className="absolute top-4 right-4 bg-primary/90 hover:bg-primary text-primary-foreground z-10 backdrop-blur-sm shadow-md">
                Destacado
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image) => (
                <div 
                  key={image.id} 
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                    selectedImageId === image.id 
                      ? 'border-primary ring-2 ring-primary/20 ring-offset-2 dark:ring-offset-gray-950' 
                      : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
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
              <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {product.rating} <span className="text-gray-400 font-normal">({product.reviewCount} reseñas)</span>
                </span>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base lg:text-lg flex items-center gap-2">
              Vendido por <span className="font-semibold text-primary underline decoration-primary/30 underline-offset-4">{product.sellerName}</span>
            </p>
          </div>

          <div className="flex items-center justify-between py-6 border-y border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Precio Total</p>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-baseline gap-1">
                {product.price > 0 
                  ? (
                    <>
                      <span className="text-lg text-gray-500 font-normal self-start mt-1">S/</span>
                      {product.price.toFixed(2)}
                    </>
                  )
                  : <span className="text-primary">{product.customPriceDisplay || 'Consultar'}</span>
                }
              </div>
              {product.price > 0 && (
                <p className="text-xs text-gray-400 mt-2 font-medium bg-gray-100 dark:bg-gray-800 inline-block px-2 py-0.5 rounded">IGV incluido</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" title="Guardar en favoritos" className="h-12 w-12 rounded-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" title="Compartir" className="h-12 w-12 rounded-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
            <p className="whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Opciones del Producto */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white">Opciones de Personalización</h3>
              <div className="space-y-4">
                {product.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      {option.name} {option.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {option.type === 'select' && (
                      <div className="relative">
                        <select
                          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
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
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    )}

                    {option.type === 'radio' && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => (
                            <label key={value.id} className={`
                              cursor-pointer rounded-lg border px-3 py-2 transition-all duration-200 flex items-center gap-2
                              ${selectedOptions[option.id] === value.id 
                                ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-600 dark:text-gray-300'}
                            `}>
                              <input
                                type="radio"
                                name={`option-${option.id}`}
                                className="sr-only"
                                checked={selectedOptions[option.id] === value.id}
                                onChange={() => handleOptionChange(option.id, value.id, true)}
                              />
                              <span className="font-medium text-sm">{value.name}</span>
                              {value.priceModifier > 0 && (
                                <span className="text-xs font-bold bg-primary/10 px-1.5 py-0.5 rounded text-primary">
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
                                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
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
                        <label className="flex items-start space-x-3 cursor-pointer group p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
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

          <div className="flex flex-col gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button 
              size="lg" 
              className={
                'w-full text-lg h-14 ' +
                'bg-gradient-to-r from-primary-500 to-secondary-500 ' +
                'hover:from-secondary-500 hover:to-primary-500 ' +
                'text-white ' +
                'rounded-xl font-bold transition-all duration-300 transform ' +
                'hover:scale-105 shadow-lg hover:shadow-xl'
              }
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
                  {product.price > 0 ? (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2.5" />
                      Añadir al Carrito
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5 mr-2.5" />
                      Solicitar Cotización
                    </>
                  )}
                </>
              )}
            </Button>
            {product.price > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/10 py-2 rounded-lg">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium">Compra 100% segura garantizada por Ddreams 3D</span>
              </div>
            )}
          </div>
          
          <div className="pt-8 mt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Etiquetas Relacionadas</h3>
            <div className="flex flex-wrap gap-2.5">
              {product.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary transition-colors text-sm font-medium rounded-full cursor-pointer"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
