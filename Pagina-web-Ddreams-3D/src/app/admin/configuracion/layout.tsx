import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administración - Configuración | Ddreams 3D',
  description: 'Configuración general del sistema.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
