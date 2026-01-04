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
        '/facturacion/',
        '/pedidos/',
        '/checkout/',
        '/order-confirmation/',
        '/logout/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
