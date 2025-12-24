import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Ddreams 3D - Impresión 3D Profesional | Prototipado y Fabricación Digital',
  description: 'Servicios profesionales de impresión 3D, prototipado rápido y fabricación digital. Transformamos tus ideas en realidad con la más alta calidad y tecnología de vanguardia.',
  keywords: 'impresión 3D, prototipado, fabricación digital, diseño 3D, modelado, prototipado rápido, manufactura aditiva',
  authors: [{ name: 'Ddreams 3D' }],
  creator: 'Ddreams 3D',
  publisher: 'Ddreams 3D',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Ddreams 3D - Impresión 3D Profesional',
    description: 'Servicios profesionales de impresión 3D, prototipado rápido y fabricación digital. Transformamos tus ideas en realidad.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Ddreams 3D',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ddreams 3D - Impresión 3D Profesional',
    description: 'Servicios profesionales de impresión 3D, prototipado rápido y fabricación digital.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};



export default function HomePage() {
  return <HomePageClient />;
}
