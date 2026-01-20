import React from 'react';
import { Metadata } from 'next';
import LandingMainPageClient from '@/features/landing-main/LandingMainPageClient';
import { fetchLandingMain } from '@/services/landing.service';
import { ProductService } from '@/services/product.service';
import { ServiceService } from '@/services/service.service';
import { CatalogItem } from '@/shared/types/catalog';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

export const metadata: Metadata = {
  title: {
    absolute: 'Impresión 3D en Arequipa | Servicio Profesional a Medida',
  },
  description: 'Convierte tus ideas en realidad con Ddreams 3D. Servicio de impresión 3D en Arequipa, diseño CAD, prototipado y regalos personalizados. Calidad y rapidez garantizada.',
  keywords: ['impresión 3d arequipa', 'servicio impresión 3d', 'regalos personalizados arequipa', 'diseño 3d', 'prototipado rápido', 'maquetas arquitectura', 'trofeos personalizados', 'ddreams 3d'],
  alternates: {
    canonical: 'https://ddreams3d.com/impresion-3d-arequipa',
  },
  openGraph: {
    title: 'Impresión 3D en Arequipa | Calidad y Rapidez',
    description: 'Servicio líder de impresión 3D y diseño en Arequipa. Cotiza tu proyecto hoy mismo.',
    url: 'https://ddreams3d.com/impresion-3d-arequipa',
    siteName: 'Ddreams 3D',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: `/${StoragePathBuilder.ui.brand()}/impresion-3d-arequipa-ddreams-v2.png`,
        width: 1200,
        height: 630,
        alt: 'Servicio de Impresión 3D en Arequipa - Ddreams 3D',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Impresión 3D en Arequipa | Servicio Profesional a Medida',
    description: 'Servicio profesional de impresión 3D. Calidad, rapidez y atención personalizada.',
    images: [`/${StoragePathBuilder.ui.brand()}/impresion-3d-arequipa-ddreams-v2.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function LandingImpresion3DArequipaPage() {
  // 1. Fetch data on the server
  const [initialConfig, featuredProducts, services] = await Promise.all([
    fetchLandingMain(),
    ProductService.getFeaturedProducts(),
    ServiceService.getFeaturedServices()
  ]);

  // 2. Prepare bubble images (from featured products or default)
  const bubbleImages = featuredProducts
    .map(p => p.images && p.images.length > 0 ? p.images[0].url : '')
    .filter(url => url !== '')
    .slice(0, 15); // Limit to reasonable amount

  return (
    <LandingMainPageClient 
      initialConfig={initialConfig}
      featuredProducts={featuredProducts as CatalogItem[]}
      services={services as CatalogItem[]}
      bubbleImages={bubbleImages}
    />
  );
}
