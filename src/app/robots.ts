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
        '/api/',
        '/protegido/',
        '/profile/',
        '/settings/',
        '/cotizaciones/',
        '/facturacion/',
        '/pedidos/',
        '/cart/',
        '/checkout/',
        '/order-confirmation/',
        '/login/',
        '/logout/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
