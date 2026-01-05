'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product, Service } from '@/shared/types/domain';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useProductDetail } from './hooks/useProductDetail';

// Components
import { ProductImageGallery } from './components/product-detail/ProductImageGallery';
import { ProductInfo } from './components/product-detail/ProductInfo';
import { ProductPrice } from './components/product-detail/ProductPrice';
import { ProductTabs } from './components/product-detail/ProductTabs';
import { ProductOptions } from './components/product-detail/ProductOptions';
import { ProductSpecifications } from './components/product-detail/ProductSpecifications';
import { ProductActions } from './components/product-detail/ProductActions';
import { ProductTags } from './components/product-detail/ProductTags';
import { ProductRelated } from './components/product-detail/ProductRelated';
import { ProductImageModal } from './components/product-detail/ProductImageModal';

interface Props {
  product: Product | Service;
  relatedProducts?: (Product | Service)[];
}

export default function ProductDetailClient({ product: initialProduct, relatedProducts = [] }: Props) {
  const searchParams = useSearchParams();
  const fromSource = searchParams.get('from');

  const {
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
    isFavorite, // Note: isFavorite logic seems to be just local state in original, not persisted or used much
    setIsModalOpen,
    setActiveTab,
    setSelectedImageId,
    setIsFavorite,
    handleOptionChange,
    handleCustomInputChange,
    handleAction,
    handleShare,
    handleNextImage,
    handlePrevImage
  } = useProductDetail(initialProduct);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') setIsModalOpen(false);
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleNextImage, handlePrevImage, setIsModalOpen]);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 lg:pt-32 lg:pb-20 max-w-7xl font-sans text-foreground">
      {/* Back Button */}
      <Button 
        asChild
        variant="outline"
        className="rounded-full mb-8 h-auto py-2 px-4 backdrop-blur-sm hover:border-primary hover:text-primary hover:bg-primary/5"
      >
        <Link 
          href={fromSource === 'services' ? '/services' : '/catalogo-impresion-3d'} 
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {fromSource === 'services' ? 'Volver a Servicios' : 'Volver al Catálogo'}
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 lg:gap-16 items-start">
        {/* Product Images Section */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <ProductImageGallery
            images={product.images}
            selectedImageId={selectedImageId}
            selectedImage={selectedImage}
            productName={product.name}
            onImageSelect={setSelectedImageId}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>

        {/* Product Details Section */}
        <div className="space-y-8">
          <ProductInfo 
            product={product} 
            onShare={handleShare} 
          />

          <ProductPrice 
            product={product} 
            currentPrice={currentPrice} 
          />

          {/* Tabs System B2C / B2B */}
          {product.tabs ? (
            <ProductTabs 
              product={product} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          <ProductOptions
            product={product}
            selectedOptions={selectedOptions}
            customInputs={customInputs}
            handleOptionChange={handleOptionChange}
            setCustomInputs={setCustomInputs}
          />

          <ProductSpecifications product={product} />

          <ProductActions
            product={product}
            activeTab={activeTab}
            isAdding={isAdding}
            handleAction={handleAction}
          />
          
          <ProductTags product={product} />
        </div>
      </div>

      <ProductRelated relatedProducts={relatedProducts} />

      <ProductImageModal
        product={product}
        selectedImage={selectedImage}
        selectedImageId={selectedImageId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNext={(e) => handleNextImage(e)}
        onPrev={(e) => handlePrevImage(e)}
      />
    </div>
  );
}
