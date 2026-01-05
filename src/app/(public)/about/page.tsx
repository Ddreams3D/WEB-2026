import AboutPageClient from '@/features/about/AboutPageClient';
import { Metadata } from 'next';
import { generateSeoMetadata } from '@/services/seo.service';

const defaultMetadata: Metadata = {
  title: 'Nosotros | Ddreams 3D Arequipa',
  description: 'Conoce a Ddreams 3D, empresa arequipeña líder en servicios de impresión 3D y regalos personalizados. Descubre nuestra visión y compromiso con la calidad.',
  robots: {
    index: true,
    follow: true,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata('/about', defaultMetadata);
}

export default function AboutPage() {
  return <AboutPageClient />;
}
