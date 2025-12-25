import { MetadataRoute } from 'next';
import { mockProducts } from '@/shared/data/mockData';
import { getAppUrl } from '@/lib/url-utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppUrl();

  // Rutas estáticas
  const routes = [
    '',
    '/marketplace',
    '/services',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Rutas dinámicas de productos
  const products = mockProducts.map((product) => ({
    url: `${baseUrl}/marketplace/product/${product.id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...products];
}
