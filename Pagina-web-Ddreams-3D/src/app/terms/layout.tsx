import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de nuestros servicios.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
