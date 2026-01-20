import React from 'react';
import { JsonLd } from './JsonLd';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';
import { getAppUrl } from '@/lib/url-utils';
import { 
  PHONE_DISPLAY, 
  ADDRESS_BUSINESS, 
  EMAIL_BUSINESS 
} from '@/shared/constants/contactInfo';

export function LocalBusinessJsonLd() {
  const appUrl = getAppUrl();
  
  // Parse address parts from the constant string or use hardcoded structure for precision
  // "Urb. Chapi Chico Mz. A Lt 5, Miraflores, Arequipa, Perú"
  const address = {
    '@type': 'PostalAddress',
    streetAddress: 'Urb. Chapi Chico Mz. A Lt 5',
    addressLocality: 'Miraflores',
    addressRegion: 'Arequipa',
    postalCode: '04004', // Código postal de Miraflores, Arequipa (aproximado)
    addressCountry: 'PE'
  };

  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService', // More specific than LocalBusiness
    '@id': `${appUrl}/#localbusiness`, // Stable ID
    name: 'Ddreams 3D',
    alternateName: 'Ddreams 3D Arequipa',
    url: appUrl,
    logo: `${appUrl}/logo/isotipo_DD_negro_V2.svg`,
    image: [
      `${appUrl}/${StoragePathBuilder.ui.brand()}/impresion-3d-arequipa-ddreams-v2.png`,
      `${appUrl}/logo-ddreams-3d.jpg`
    ],
    description: 'Servicios profesionales de impresión 3D, modelado, prototipado y diseño en Arequipa. Fabricación digital personalizada.',
    telephone: PHONE_DISPLAY,
    email: EMAIL_BUSINESS,
    address: address,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -16.39899, // Coordenadas aproximadas de Miraflores, Arequipa
      longitude: -71.53747 // TODO: Ajustar con GPS exacto del taller
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00'
      }
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Arequipa'
      },
      {
        '@type': 'Country',
        name: 'Peru'
      }
    ],
    priceRange: '$$',
    sameAs: [
      'https://www.facebook.com/ddreams3d',
      'https://www.instagram.com/ddreams3d',
      'https://www.tiktok.com/@ddreams3d'
    ],
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, Yape, Plin',
    currenciesAccepted: 'PEN'
  };

  return <JsonLd data={data} />;
}
