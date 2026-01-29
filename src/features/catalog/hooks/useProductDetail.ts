import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product, CartItemCustomization, ProductOption } from '@/shared/types';
import { Service, ProductImage as ProductImageType } from '@/shared/types/domain';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/ToastManager';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';
import { WHATSAPP_REDIRECT } from '@/shared/constants/contactInfo';

export function useProductDetail(initialProduct: Product | Service) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();

  const [product, setProduct] = useState<Product | Service>(initialProduct);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Images
  const [selectedImageId, setSelectedImageId] = useState<string>(() => {
    const images = initialProduct.images || [];
    if (images.length === 0) return '';
    return images.find(img => img.isPrimary)?.id || images[0].id || '';
  });

  // Tabs
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialProduct.tabs && initialProduct.tabs.length > 0) {
      return initialProduct.tabs[0].id;
    }
    return 'b2c';
  });

  // Options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    if (initialProduct.kind === 'product' && initialProduct.options) {
      initialProduct.options.forEach(option => {
        const defaultVal = option.values?.find(v => v.isDefault);
        if (defaultVal) {
          defaults[option.id] = defaultVal.id;
        }
      });
    }
    return defaults;
  });
  
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  // Sync with localStorage
  useEffect(() => {
    // Track view event
    if (initialProduct.kind === 'product') {
      trackEvent(AnalyticsEvents.VIEW_PRODUCT_DETAIL, { 
        id: initialProduct.id, 
        name: initialProduct.name, 
        category: typeof initialProduct.category === 'string' 
          ? initialProduct.category 
          : (initialProduct.category?.id || initialProduct.categoryId),
        location: AnalyticsLocations.PRODUCT_PAGE,
        page_type: 'product'
      });
    } else if (initialProduct.kind === 'service') {
      trackEvent(AnalyticsEvents.VIEW_SERVICE_DETAIL, { 
        id: initialProduct.id, 
        name: initialProduct.name, 
        category: initialProduct.categoryName,
        location: AnalyticsLocations.SERVICE_PAGE,
        page_type: 'service'
      });
    }

    if (typeof window !== 'undefined') {
      const storedProducts = localStorage.getItem('catalog_products_v2');
      if (storedProducts) {
        try {
          const parsed = JSON.parse(storedProducts);
          if (Array.isArray(parsed)) {
             const found = parsed.find((p: Product | Service) => p.id === initialProduct.id);
             if (found) {
                const foundUpdatedAt = new Date(found.updatedAt);
                if (!initialProduct.updatedAt || foundUpdatedAt > initialProduct.updatedAt) {
                  const hydrated = {
                    ...found,
                    createdAt: new Date(found.createdAt),
                    updatedAt: foundUpdatedAt,
                    images: (found.images || []).map((img: ProductImageType) => ({
                      ...img,
                      createdAt: img.createdAt ? new Date(img.createdAt) : undefined,
                      updatedAt: img.updatedAt ? new Date(img.updatedAt) : undefined
                    })),
                    tabs: (found.tabs && found.tabs.length > 0) ? found.tabs : initialProduct.tabs,
                    tabsTitle: found.tabsTitle || initialProduct.tabsTitle
                  };
                  setProduct(hydrated);
                }
             }
          }
        } catch (e) {
          console.error('Error parsing stored products:', e);
        }
      }
    }
  }, [initialProduct]);

  // Update selectedImageId if product changes
  useEffect(() => {
     const images = product.images || [];
     if (images.length > 0) {
       setSelectedImageId(images.find(img => img.isPrimary)?.id || images[0].id || '');
     }
  }, [product]);

  // Derived state
  const selectedImage = (product.images || []).find(img => img.id === selectedImageId) || (product.images || [])[0];
  
  const currentPrice = product.price + Object.entries(selectedOptions).reduce((total, [optionId, valueId]) => {
    if (product.kind !== 'product' || !product.options) return total;
    const options = product.options as ProductOption[];
    const option = options.find(o => o.id === optionId);
    const value = option?.values.find(v => v.id === valueId);
    return total + (value?.priceModifier || 0);
  }, 0);

  // Handlers
  const handleOptionChange = (optionId: string, valueId: string, checked: boolean = true) => {
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

  const handleCustomInputChange = (optionId: string, value: string) => {
    setCustomInputs(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const handleAddToCart = async () => {
    if (product.kind !== 'product' && product.kind !== 'service') return;

    try {
      if (product.kind === 'product' && product.options) {
        for (const [optionId, valueId] of Object.entries(selectedOptions)) {
          const option = product.options.find(o => o.id === optionId);
          const value = option?.values.find(v => v.id === valueId);
          
          if (value?.hasInput && (!customInputs[optionId] || customInputs[optionId].trim() === '')) {
            showError('Faltan datos', `Por favor especifica tu ${option?.name.toLowerCase()}.`);
            return;
          }
        }
      }

      setIsAdding(true);
      
      const productWithOptions = {
        ...product,
        price: currentPrice
      };

      const customizations: CartItemCustomization[] = [];
      
      if (product.kind === 'product' && product.options) {
        Object.entries(selectedOptions).forEach(([optionId, valueId]) => {
          const option = product.options?.find(o => o.id === optionId);
          const value = option?.values.find(v => v.id === valueId);
          
          let displayValue = value?.name || '';
          if (value?.hasInput && customInputs[optionId]) {
            displayValue = `${value.name}: ${customInputs[optionId]}`;
          }

          customizations.push({
            id: optionId,
            name: option?.name || '',
            value: displayValue,
            priceModifier: value?.priceModifier
          });
        });
      }

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
    if ((product.kind === 'product' && product.price > 0)) {
      handleAddToCart();
    } else {
      const currentTab = product.tabs?.find(t => t.id === activeTab);
      
      // Override de mensajes de WhatsApp para servicios específicos (ej. modelado orgánico)
      let overrideWhatsappMessage = currentTab?.whatsappMessage;

      // Si no hay mensaje específico pero la acción es WhatsApp/Cotizar, generar mensaje default
      if (!overrideWhatsappMessage && (currentTab?.ctaAction === 'whatsapp' || currentTab?.ctaAction === 'quote')) {
        overrideWhatsappMessage = `Hola Ddreams 3D, estoy viendo el producto "${product.name}" (Opción: ${currentTab.label}) y me gustaría solicitar una cotización o más información.`;
      }

      if (product.kind === 'service' && product.slug === 'modelado-3d-personalizado' && currentTab) {
        if (currentTab.id === 'b2c') {
          overrideWhatsappMessage =
            'Hola, quiero un modelo 3D orgánico personalizado para mí o como regalo.\n\n' +
            'Para quién es el modelo (para ti, regalo, grupo/equipo)\n' +
            'Motivo o contexto (cumpleaños, logro, decoración, etc.)\n' +
            'Qué quieres que representemos (persona, personaje, animal, objeto, etc.)\n' +
            'Estilo deseado (realista, caricatura, minimalista, no estoy seguro)\n' +
            'Tamaño aproximado del modelo (en cm)\n' +
            'Solo archivo 3D o archivo + impresión física\n' +
            'Cantidad de unidades\n' +
            'Si tienes referencias visuales (fotos, links, bocetos)\n' +
            'Colores o acabado que te gustaría\n' +
            'Plazo ideal de entrega\n' +
            'Presupuesto aproximado (opcional)';
        }

        if (currentTab.id === 'b2b') {
          overrideWhatsappMessage =
            'Hola, quiero solicitar un modelo 3D orgánico para mi marca o evento.\n\n' +
            'Nombre de la marca o evento\n' +
            'Tipo de proyecto (trofeos, mascota de marca, figura para vitrina, etc.)\n' +
            'Rol del modelo (premio principal, regalo, exhibición, etc.)\n' +
            'Qué debe transmitir la figura (valores, tono, estilo)\n' +
            'Elementos obligatorios (logo, texto, colores de marca, otros)\n' +
            'Cantidad estimada de unidades y tamaño aproximado (en cm)\n' +
            'Entregables que necesitas (solo archivo 3D o archivo + impresión)\n' +
            'Fecha del evento y fecha límite para aprobar el modelo\n' +
            'Presupuesto estimado o rango\n' +
            'Quién tomará la decisión final';
        }
      }

      if ((currentTab?.ctaAction === 'whatsapp' || currentTab?.ctaAction === 'quote') && overrideWhatsappMessage) {
         trackEvent(AnalyticsEvents.WHATSAPP_CLICK, {
          location: product.kind === 'service' ? AnalyticsLocations.SERVICE_PAGE : AnalyticsLocations.PRODUCT_PAGE,
          name: product.name,
          tab: currentTab.label
        });
        
        const message = encodeURIComponent(overrideWhatsappMessage);
        window.open(`${WHATSAPP_REDIRECT}?text=${message}`, '_blank');
        return;
      }

      if (product.kind === 'service') {
        trackEvent(AnalyticsEvents.QUOTE_SERVICE_CLICK, {
          location: AnalyticsLocations.SERVICE_PAGE,
          name: product.name
        });
        handleAddToCart();
        return;
      } else {
        trackEvent(AnalyticsEvents.REQUEST_QUOTE_CLICK, {
          location: AnalyticsLocations.PRODUCT_PAGE,
          name: product.name
        });
      }
      router.push('/contact');
    }
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
    const images = product.images || [];
    if (images.length === 0) return;
    const currentIndex = images.findIndex(img => img.id === selectedImageId);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImageId(images[nextIndex].id);
  }, [product.images, selectedImageId]);

  const handlePrevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const images = product.images || [];
    if (images.length === 0) return;
    const currentIndex = images.findIndex(img => img.id === selectedImageId);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImageId(images[prevIndex].id);
  }, [product.images, selectedImageId]);

  return {
    product,
    selectedImage,
    selectedImageId,
    activeTab,
    selectedOptions,
    customInputs,
    setCustomInputs,
    currentPrice,
    isAdding,
    isModalOpen,
    isFavorite,
    setIsModalOpen,
    setActiveTab,
    setSelectedImageId,
    setIsFavorite,
    handleOptionChange,
    handleCustomInputChange,
    handleAddToCart,
    handleAction,
    handleShare,
    handleNextImage,
    handlePrevImage
  };
}
