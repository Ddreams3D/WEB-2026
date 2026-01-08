import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Administración - Estadísticas | Ddreams 3D',
  description: 'Estadísticas y reportes del sistema.',
};

export default function EstadisticasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
