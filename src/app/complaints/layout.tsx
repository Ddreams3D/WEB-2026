import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Libro de Reclamaciones',
  description: 'Canal oficial para el registro de quejas y reclamos.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
