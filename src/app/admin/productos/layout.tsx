import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administración - Productos | Ddreams 3D',
  description: 'Gestión de productos del catálogo.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
