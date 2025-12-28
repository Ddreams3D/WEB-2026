import React from 'react';
import { JsonLd } from './JsonLd';
import { getAppUrl } from '@/lib/url-utils';
import { PHONE_DISPLAY } from '@/shared/constants/contactInfo';

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ddreams 3D',
    url: getAppUrl(),
    logo: `${getAppUrl()}/logo-ddreams-3d.jpg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: PHONE_DISPLAY, // Replace with actual number if available
      contactType: 'customer service',
      areaServed: 'PE',
      availableLanguage: 'es'
    },
    sameAs: [
      'https://www.facebook.com/ddreams3d', // Replace with actual social links
      'https://www.instagram.com/ddreams3d',
      'https://www.tiktok.com/@ddreams3d'
    ]
  };

  return <JsonLd data={data} />;
}
