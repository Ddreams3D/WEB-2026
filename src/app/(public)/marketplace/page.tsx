import { Suspense } from 'react';
import { Metadata } from 'next';
import MarketplacePageClient from '@/features/marketplace/MarketplacePageClient';
import { ProductService } from '@/services/product.service';
import { ServiceService } from '@/services/service.service';
import { MarketplaceProvider } from '@/contexts/MarketplaceContext';
import { StoreProduct, Service, CatalogItem, getCatalogSortDate } from '@/shared/types/catalog';
import { Category } from '@/shared/types';

export const metadata: Metadata = {
  title: 'Catálogo de Productos 3D | Ddreams 3D',
  description: 'Explora nuestra amplia variedad de productos impresos en 3D. Desde figuras coleccionables hasta repuestos técnicos y decoración personalizada.',
  keywords: 'catálogo impresión 3d, productos 3d arequipa, venta figuras 3d, tienda impresión 3d peru, repuestos 3d, decoración 3d',
  openGraph: {
    title: 'Catálogo de Productos 3D | Ddreams 3D',
    description: 'Encuentra el regalo o solución perfecta en nuestro catálogo de impresión 3D.',
    type: 'website',
  },
};

export default async function MarketplacePage() {
  try {
    // 1. Cargar datos en paralelo (Server Side)
    const [fetchedProducts, fetchedCategories, fetchedServices] = await Promise.all([
      ProductService.getAllProducts(),
      ProductService.getCategories(),
      ServiceService.getAllServices()
    ]);

    // 2. Normalizar y combinar
    const normalizedProducts: StoreProduct[] = fetchedProducts.map(p => ({
      ...p,
      kind: 'product'
    } as StoreProduct));

    const normalizedServices: Service[] = fetchedServices.map(s => ({
      ...s,
      kind: 'service'
    } as Service));

    const marketplaceItems: CatalogItem[] = [...normalizedProducts, ...normalizedServices].sort((a, b) =>
      getCatalogSortDate(b) - getCatalogSortDate(a)
    );
    
    // 3. Calcular conteos para categorías
    const categoriesWithCounts = fetchedCategories.map(cat => {
        const count = marketplaceItems.filter(p => p.categoryId === cat.id).length;
        return { ...cat, productCount: count };
    });

    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando catálogo...</div>}>
        <MarketplaceProvider initialItems={marketplaceItems} initialCategories={categoriesWithCounts}>
          <MarketplacePageClient />
        </MarketplaceProvider>
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading marketplace data on server:", error);
    // Fallback vacio o manejo de error
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando catálogo...</div>}>
        <MarketplaceProvider initialItems={[]} initialCategories={[]}>
          <MarketplacePageClient />
        </MarketplaceProvider>
      </Suspense>
    );
  }
}
