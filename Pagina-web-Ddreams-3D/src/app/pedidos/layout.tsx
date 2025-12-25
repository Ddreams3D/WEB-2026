import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Pedidos',
  description: 'Historial y seguimiento de tus pedidos de impresión 3D.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
