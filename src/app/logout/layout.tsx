import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cerrando Sesión | Ddreams 3D',
  description: 'Cerrando tu sesión de forma segura.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
