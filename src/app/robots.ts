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
        '/cart/',
        '/checkout/',
        '/order-confirmation/',
        '/login/',
        '/logout/',
        '/terms/',
        '/privacy/',
        '/about/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
