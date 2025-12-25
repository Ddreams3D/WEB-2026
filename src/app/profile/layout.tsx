import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Perfil | Ddreams 3D',
  description: 'Gestiona tu información personal y preferencias.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
