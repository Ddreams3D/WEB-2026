import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Empresarial B2B',
  description: 'Área exclusiva para clientes corporativos y gestión de servicios B2B.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
