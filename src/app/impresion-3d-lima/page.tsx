import React from 'react';
import { Metadata } from 'next';
import LandingMainPageClient from '@/features/landing-main/LandingMainPageClient';
import { fetchCityLanding } from '@/services/landing.service';
import { ProductService } from '@/services/product.service';
import { ServiceService } from '@/services/service.service';
import { CatalogItem } from '@/shared/types/catalog';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

// Force dynamic rendering to ensure fresh data from Firestore on every request
// This is critical for the Admin Editor to show changes immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: 'Impresión 3D en Lima | Servicio Profesional a Medida',
  },
  description: 'Convierte tus ideas en realidad con Ddreams 3D. Servicio de impresión 3D en Lima. Atención en Miraflores, San Isidro, La Molina y todo Lima Metropolitana. Diseño CAD y prototipado.',
  keywords: ['impresión 3d lima', 'servicio impresión 3d', 'regalos personalizados lima', 'diseño 3d', 'prototipado rápido', 'impresión 3d miraflores', 'impresión 3d san isidro', 'impresión 3d la molina', 'impresión 3d surco', 'maquetas arquitectura', 'trofeos personalizados', 'ddreams 3d'],
  alternates: {
    canonical: 'https://ddreams3d.com/impresion-3d-lima',
  },
  openGraph: {
    title: 'Impresión 3D en Lima | Calidad y Rapidez',
    description: 'Servicio líder de impresión 3D en Lima. Atendemos Miraflores, San Isidro, La Molina y todo Lima. Cotiza tu proyecto hoy mismo.',
    url: 'https://ddreams3d.com/impresion-3d-lima',
    siteName: 'Ddreams 3D',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: `/${StoragePathBuilder.ui.brand()}/impresion-3d-arequipa-ddreams-v2.png`, // Fallback to existing image
        width: 1200,
        height: 630,
        alt: 'Servicio de Impresión 3D en Lima - Ddreams 3D',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Impresión 3D en Lima | Servicio Profesional a Medida',
    description: 'Servicio profesional de impresión 3D en Lima. Atendemos Miraflores, San Isidro, La Molina. Calidad y rapidez.',
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

export default async function LandingImpresion3DLimaPage() {
  // 1. Fetch data on the server
  const [initialConfig, featuredProducts, services] = await Promise.all([
    fetchCityLanding('lima'),
    ProductService.getFeaturedProducts(['lima']),
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
      whatsappMessage="Hola, estoy interesado en sus servicios de impresión 3D en Lima."
      cityId="lima"
    />
  );
}
