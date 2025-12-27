import { Metadata } from 'next';
import MarketplacePageClient from '@/features/marketplace/MarketplacePageClient';

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

export default function MarketplacePage() {
  return <MarketplacePageClient />;
}
