import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Legal',
  description: 'Gestión de documentos legales y contratos.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
