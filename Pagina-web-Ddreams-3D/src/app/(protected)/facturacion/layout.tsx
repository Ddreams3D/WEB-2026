import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facturación y Comprobantes',
  description: 'Gestión de facturas y comprobantes de pago.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
