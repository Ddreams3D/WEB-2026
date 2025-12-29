import { MetadataRoute } from 'next';
import { ProductService } from '@/services/product.service';
import { getAppUrl } from '@/lib/url-utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getAppUrl();

  // Rutas estáticas
  const routes = [
    '',
    '/marketplace',
    '/services',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Rutas dinámicas de productos
  const productsData = await ProductService.getAllProducts();
  const products = productsData.map((product) => ({
    url: `${baseUrl}/marketplace/product/${product.slug || product.id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...products];
}
