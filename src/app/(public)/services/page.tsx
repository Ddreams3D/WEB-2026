import { Metadata } from 'next';
import ServicesPageClient from '@/features/services/ServicesPageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { PHONE_BUSINESS, ADDRESS_BUSINESS, PHONE_DISPLAY } from '@/shared/constants/contactInfo';
import { ServiceService } from '@/services/service.service';
import { Service } from '@/shared/types/domain';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

export const revalidate = 3600; // Revalidar cada hora (ISR)

export const metadata: Metadata = {
  title: 'Servicios de Impresión 3D y Diseño CAD en Arequipa | Ddreams 3D',
  description: 'Servicios profesionales de impresión 3D FDM y resina, modelado 3D, prototipado de ingeniería y consultoría técnica en Arequipa. Calidad industrial para tus proyectos.',
  keywords: ['impresión 3d arequipa', 'servicio impresión 3d', 'modelado 3d', 'diseño cad', 'prototipado rápido', 'piezas ingeniería', 'impresión resina', 'impresión filamento', 'ddreams 3d'],
  openGraph: {
    title: 'Servicios de Impresión 3D y Diseño CAD | Ddreams 3D',
    description: 'Transformamos tus ideas en realidad con tecnología de impresión 3D avanzada. Servicios de prototipado, diseño y producción en Arequipa.',
    url: 'https://ddreams3d.com/servicios',
    siteName: 'Ddreams 3D',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: `/${StoragePathBuilder.ui.banners()}/servicios-diseno-modelado-impresion-3d-ddreams-3d.png`, // Asegurarse de tener una imagen por defecto o usar una genérica si no existe
        width: 1200,
        height: 630,
        alt: 'Servicios de Impresión 3D Ddreams 3D',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicios de Impresión 3D y Diseño CAD | Ddreams 3D',
    description: 'Servicios profesionales de impresión 3D y diseño en Arequipa. Cotiza tu proyecto hoy.',
  },
  alternates: {
    canonical: 'https://ddreams3d.com/servicios',
  },
};

export default async function ServicesPage() {
  // Fetch services on the server (ISR)
  // This removes the need for client-side fetching and loading states
  let services: Service[] = [];
  try {
    const allServices = await ServiceService.getAllServices();
    services = allServices.filter(s => 
      s.tags && (s.tags.includes('general-service') || s.tags.includes('business-service'))
    );
  } catch (error) {
    console.error('Error pre-fetching services:', error);
    // Fallback handled by empty array passed to client
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Ddreams 3D Servicios de Impresión',
    'image': `https://ddreams3d.com/${StoragePathBuilder.ui.brand()}/logo-ddreams-3d.jpg`,
    '@id': 'https://ddreams3d.com/servicios',
    'url': 'https://ddreams3d.com/servicios',
    'telephone': PHONE_DISPLAY,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': ADDRESS_BUSINESS,
      'addressLocality': 'Arequipa',
      'postalCode': '04001',
      'addressCountry': 'PE'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': -16.3956,
      'longitude': -71.5247
    },
    'priceRange': '$$',
    'areaServed': [
      {
        '@type': 'City',
        'name': 'Arequipa'
      },
      {
        '@type': 'Country',
        'name': 'Peru'
      }
    ],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Servicios de Impresión 3D',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Impresión 3D FDM',
            'description': 'Impresión en filamento para prototipos y piezas funcionales.'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Impresión 3D Resina',
            'description': 'Alta precisión para joyería, dental y miniaturas.'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Modelado 3D CAD',
            'description': 'Diseño técnico y artístico para impresión 3D.'
          }
        },
         {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Prototipado de Ingeniería',
            'description': 'Desarrollo de prototipos funcionales y piezas técnicas.'
          }
        }
      ]
    }
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <ServicesPageClient initialServices={services} />
    </>
  );
}
