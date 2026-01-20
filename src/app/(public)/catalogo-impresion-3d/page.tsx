import { Suspense } from 'react';
import { Metadata } from 'next';
import CatalogPageClient from '@/features/catalog/CatalogPageClient';
import { getCachedProducts, getCachedCategories, getCachedServices } from '@/services/data-access.server';
import { CatalogProvider } from '@/contexts/CatalogContext';
import { StoreProduct, Service, CatalogItem, getCatalogSortDate } from '@/shared/types/catalog';
import { Category } from '@/shared/types';

// Use standard ISR (1 hour) or rely on Data Cache revalidation
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Catálogo de productos bajo pedido | Ddreams 3D',
  description: 'Explora nuestra amplia variedad de productos impresos en 3D. Elige un diseño base y lo fabricamos a medida en Arequipa.',
  keywords: 'catálogo impresión 3d, productos 3d arequipa, venta figuras 3d, tienda impresión 3d peru, repuestos 3d, decoración 3d',
  openGraph: {
    title: 'Catálogo de productos bajo pedido | Ddreams 3D',
    description: 'Encuentra el regalo o solución perfecta en nuestro catálogo de impresión 3D.',
    type: 'website',
    url: '/catalogo-impresion-3d',
  },
  alternates: {
    canonical: '/catalogo-impresion-3d',
  },
};

export default async function CatalogPage() {
  try {
    // 1. Cargar datos en paralelo (Server Side - Cached)
    const [fetchedProducts, fetchedCategories, fetchedServices] = await Promise.all([
      getCachedProducts(),
      getCachedCategories(),
      getCachedServices()
    ]);

    // 2. Normalizar y combinar
    const normalizedProducts: StoreProduct[] = fetchedProducts
      .filter(p => {
         const tags = (p.tags || []).map(t => t.toLowerCase());
         return p.isActive && 
                tags.includes('scope:global') && 
                !tags.includes('scope:hidden') && 
                !tags.includes('oculto');
      })
      .map(p => ({
        ...p,
        kind: 'product'
      } as StoreProduct));

    const normalizedServices: Service[] = fetchedServices
      .filter(s => {
         const tags = (s.tags || []).map(t => t.toLowerCase());
         return s.isActive && 
                tags.includes('scope:global') && 
                !tags.includes('scope:hidden') && 
                !tags.includes('oculto');
      })
      .map(s => ({
        ...s,
        kind: 'service'
      } as Service));

    const catalogItems: CatalogItem[] = [...normalizedProducts, ...normalizedServices].sort((a, b) =>
      getCatalogSortDate(b) - getCatalogSortDate(a)
    );
    
    // 3. Calcular conteos para categorías
    const categoriesWithCounts = fetchedCategories.map(cat => {
        const count = catalogItems.filter(p => p.categoryId === cat.id).length;
        return { ...cat, productCount: count };
    });

    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando catálogo...</div>}>
        <CatalogProvider initialItems={catalogItems} initialCategories={categoriesWithCounts}>
          <CatalogPageClient />
        </CatalogProvider>
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading catalog data on server:", error);
    // Fallback vacio o manejo de error
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando catálogo...</div>}>
        <CatalogProvider initialItems={[]} initialCategories={[]}>
          <CatalogPageClient />
        </CatalogProvider>
      </Suspense>
    );
  }
}
