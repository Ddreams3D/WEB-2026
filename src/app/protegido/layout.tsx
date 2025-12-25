import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Área Protegida | Ddreams 3D',
  description: 'Acceso restringido a usuarios autenticados.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
