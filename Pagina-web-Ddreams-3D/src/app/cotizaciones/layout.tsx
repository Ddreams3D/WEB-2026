import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Cotizaciones',
  description: 'Gestiona y da seguimiento a tus solicitudes de cotización.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
