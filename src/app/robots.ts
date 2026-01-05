import { MetadataRoute } from 'next';
import { getAppUrl } from '@/lib/url-utils';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppUrl();
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dev/',
        '/api/',
        '/protegido/',
        '/profile/',
        '/settings/',
        '/cotizaciones/',
        '/pedidos/',
        '/checkout/',
        '/order-confirmation/',
        '/cart/',
        '/logout/',
        '/seed-data/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
