import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Conoce cómo protegemos y utilizamos tus datos personales.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
