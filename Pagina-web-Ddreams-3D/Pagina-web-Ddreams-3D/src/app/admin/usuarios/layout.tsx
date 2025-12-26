import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administración - Usuarios | Ddreams 3D',
  description: 'Gestión de usuarios y permisos.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
