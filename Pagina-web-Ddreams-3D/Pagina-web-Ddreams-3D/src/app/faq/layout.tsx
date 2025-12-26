import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes',
  description: 'Respuestas a las dudas más comunes sobre nuestros servicios de impresión 3D.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
