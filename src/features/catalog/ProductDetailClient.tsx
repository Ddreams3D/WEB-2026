'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product, Service } from '@/shared/types/domain';
import { Button, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label } from '@/components/ui';
import { ArrowLeft, MessageSquare } from 'lucide-react';
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
import { WHATSAPP_REDIRECT } from '@/shared/constants/contactInfo';
import { OrganicModelingServiceForm } from './components/organic-modeling/OrganicModelingServiceForm';

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
    isFavorite,
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

  const backHref = fromSource === 'services' ? '/services' : '/catalogo-impresion-3d';
  const backLabel = fromSource === 'services' ? 'Volver a Servicios' : 'Volver al Catálogo';

  if (product.kind === 'service') {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 lg:pt-32 lg:pb-20 max-w-7xl font-sans text-foreground">
        <Button
          asChild
          variant="outline"
          className="rounded-full mb-8 h-auto py-2 px-4 backdrop-blur-sm hover:border-primary hover:text-primary hover:bg-primary/5"
        >
          <Link href={backHref}>
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {backLabel}
          </Link>
        </Button>

        <div className="mb-10">
          <ProductInfo
            product={product}
            onShare={handleShare}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 lg:gap-16 items-start">
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

          <div className="space-y-10">
            {product.slug === 'modelado-3d-personalizado' && (
              <div className="space-y-3">
                <Link
                  href="/servicios/modelado-3d-personalizado"
                  className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Conocer más sobre este servicio
                </Link>
                <div className="space-y-2">
                  <p className="text-base lg:text-lg font-semibold text-foreground">
                    Configura tu proyecto de modelado 3D
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Cuéntanos tu idea en pasos simples y la cotizamos.
                  </p>
                </div>
              </div>
            )}

            {product.slug === 'modelado-3d-personalizado' ? (
              <OrganicModelingServiceForm productSlug={product.slug} />
            ) : (
              <section id="cotizar" className="space-y-6 rounded-2xl border border-border bg-card/60 p-5 lg:p-6 shadow-sm">
                <ProductTabs
                  product={product}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                <ProductActions
                  product={product}
                  activeTab={activeTab}
                  isAdding={isAdding}
                  handleAction={handleAction}
                />
              </section>
            )}

            {product.slug !== 'modelado-3d-personalizado' && (
              <ProductPrice
                product={product}
                currentPrice={currentPrice}
              />
            )}

            <ProductOptions
              product={product}
              selectedOptions={selectedOptions}
              customInputs={customInputs}
              handleOptionChange={handleOptionChange}
              setCustomInputs={setCustomInputs}
            />

            {product.slug !== 'modelado-3d-personalizado' && (
              <ProductSpecifications product={product} />
            )}

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

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 lg:pt-32 lg:pb-20 max-w-7xl font-sans text-foreground">
      <Button
        asChild
        variant="outline"
        className="rounded-full mb-8 h-auto py-2 px-4 backdrop-blur-sm hover:border-primary hover:text-primary hover:bg-primary/5"
      >
        <Link href={backHref}>
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 lg:gap-16 items-start">
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

        <div className="space-y-8">
          <ProductInfo
            product={product}
            onShare={handleShare}
          />

          <ProductPrice
            product={product}
            currentPrice={currentPrice}
          />

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
