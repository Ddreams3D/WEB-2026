import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace de Diseños 3D | Ddreams 3D',
  description: 'Explora nuestra colección exclusiva de diseños 3D listos para imprimir. Encuentra modelos únicos para decoración, cosplay, utilitarios y más.',
  openGraph: {
    title: 'Marketplace de Diseños 3D | Ddreams 3D',
    description: 'Explora nuestra colección exclusiva de diseños 3D listos para imprimir. Encuentra modelos únicos para decoración, cosplay, utilitarios y más.',
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
