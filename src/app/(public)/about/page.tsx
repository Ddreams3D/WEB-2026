import AboutPageClient from '@/features/about/AboutPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nosotros | Ddreams 3D Arequipa',
  description: 'Conoce a Ddreams 3D, empresa arequipeña líder en servicios de impresión 3D y regalos personalizados. Descubre nuestra visión y compromiso con la calidad.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
