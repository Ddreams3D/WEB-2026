import AboutPageClient from '@/features/about/AboutPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nuestro Proceso - Ddreams 3D',
  description: 'Conoce nuestro vision y mision.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
