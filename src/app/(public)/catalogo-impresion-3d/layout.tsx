import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de productos bajo pedido | Ddreams 3D',
  description: 'Explora nuestra colección exclusiva de regalos personalizados, trofeos y productos impresos en 3D. Diseños únicos hechos en Arequipa.',
  openGraph: {
    title: 'Catálogo de productos bajo pedido | Ddreams 3D',
    description: 'Explora nuestra colección exclusiva de regalos personalizados, trofeos y productos impresos en 3D. Diseños únicos hechos en Arequipa.',
    type: 'website',
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
