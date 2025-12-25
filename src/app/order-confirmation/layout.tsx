import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pedido Confirmado | Ddreams 3D',
  description: 'Tu pedido ha sido procesado exitosamente.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
