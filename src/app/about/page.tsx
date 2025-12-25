import AboutPageClient from '@/features/about/AboutPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Ddreams 3D - Innovación en Impresión 3D',
  description: 'Conoce a Ddreams 3D, líderes en servicios de impresión 3D y prototipado. Descubre nuestra visión, misión y el equipo detrás de la innovación.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
