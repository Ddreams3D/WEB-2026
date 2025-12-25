import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace de Regalos e Impresión 3D | Ddreams 3D',
  description: 'Explora nuestra colección exclusiva de regalos personalizados, trofeos y productos impresos en 3D. Diseños únicos hechos en Arequipa.',
  openGraph: {
    title: 'Marketplace de Regalos e Impresión 3D | Ddreams 3D',
    description: 'Explora nuestra colección exclusiva de regalos personalizados, trofeos y productos impresos en 3D. Diseños únicos hechos en Arequipa.',
    type: 'website',
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
