import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administración - Contenido | Ddreams 3D',
  description: 'Gestión de contenido web.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
