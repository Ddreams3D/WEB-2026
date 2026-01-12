import { MetadataRoute } from 'next';
import { ProductService } from '@/services/product.service';
import { SERVICE_LANDINGS_DATA } from '@/shared/data/service-landings-data';
import seasonalThemes from '@/data/seasonal-themes.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com';
  const currentDate = new Date();

  // Helper para asegurar trailing slash
  const getUrlWithSlash = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // Si es home ('/'), no duplicar slash, pero baseUrl no suele tener slash final.
    // Si route es '', cleanPath es '/'.
    // baseUrl 'https://...' + '/' = 'https://.../'
    if (cleanPath === '/') return `${baseUrl}/`;
    return `${baseUrl}${cleanPath}/`;
  };

  // 1. Rutas Estáticas Principales (Solo las que queremos indexar y priorizar)
  // Las legales (privacy, terms) están en noindex, follow, así que NO van en sitemap.
  const staticRoutes = [
    '', // Home
    '/catalogo-impresion-3d', // Tienda Principal
    '/services', // Hub de Servicios
    '/contact', // Contacto
    '/about', // Nosotros
    '/process', // Nuestro Proceso
    '/impresion-3d-arequipa', // Landing SEO Local
  ].map((route) => ({
    url: getUrlWithSlash(route),
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Rutas Dinámicas: Productos
  // Fetch real de productos desde Firestore/Service
  let products: MetadataRoute.Sitemap = [];
  try {
    const productsData = await ProductService.getAllProducts();
    products = productsData.map((product) => {
      // Ensure category slug fallback matches page logic
      const categorySlug = product.category?.slug || product.categoryId || 'general';
      return {
        url: getUrlWithSlash(`catalogo-impresion-3d/${categorySlug}/${product.slug || product.id}`),
        lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.9, // Alta prioridad para productos
      };
    });
  } catch (error) {
    console.error('Error generando sitemap de productos:', error);
  }

  // 3. Rutas Dinámicas: Servicios (Landings Generadas)
  const services = SERVICE_LANDINGS_DATA
    .filter(service => service.isActive)
    .map((service) => ({
      url: getUrlWithSlash(`servicios/${service.slug}`),
      lastModified: currentDate, // Podríamos mejorar esto si tuviéramos fecha de actualización por servicio
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  // 4. Rutas Dinámicas: Campañas Estacionales
  const campaigns = seasonalThemes.map((theme) => ({
    url: getUrlWithSlash(`campanas/${theme.id}`),
    lastModified: currentDate,
    changeFrequency: 'weekly' as const, // 'seasonal' no es estándar válido
    priority: 0.7,
  }));

  return [...staticRoutes, ...products, ...services, ...campaigns];
}
