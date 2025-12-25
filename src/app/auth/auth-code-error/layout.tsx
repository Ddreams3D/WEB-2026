import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Error de Autenticación | Ddreams 3D',
  description: 'Ha ocurrido un error durante el proceso de autenticación.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
