import { MetadataRoute } from 'next';
import { ProductService } from '@/services/product.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Usar variable de entorno o fallback a producción para evitar hardcoding directo
  // pero asegurar que se use la URL correcta en el sitemap final
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com';

  // Rutas estáticas
  const routes = [
    '',
    '/catalogo-impresion-3d',
    '/services',
    '/contact',
    '/impresion-3d-arequipa',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Rutas dinámicas de productos
  const productsData = await ProductService.getAllProducts();
  const products = productsData.map((product) => ({
    url: `${baseUrl}/catalogo-impresion-3d/product/${product.slug || product.id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...products];
}
