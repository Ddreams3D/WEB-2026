import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Ddreams 3D | Impresión 3D y Regalos Personalizados en Arequipa',
  description: 'Especialistas en impresión 3D y regalos personalizados en Arequipa. Creamos trofeos, prototipos y maquetas con envíos a todo el Perú.',
  keywords: 'impresión 3D arequipa, regalos personalizados, trofeos 3d, maquetas, prototipado rápido, diseño 3D, regalos corporativos, envíos a todo el perú',
  authors: [{ name: 'Ddreams 3D' }],
  creator: 'Ddreams 3D',
  publisher: 'Ddreams 3D',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Ddreams 3D | Impresión 3D y Regalos Personalizados en Arequipa',
    description: 'Especialistas en impresión 3D y regalos personalizados en Arequipa. Creamos trofeos, prototipos y maquetas con envíos a todo el Perú.',
    type: 'website',
    locale: 'es_PE',
    siteName: 'Ddreams 3D',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ddreams 3D | Regalos Personalizados e Impresión 3D en Arequipa',
    description: 'Especialistas en impresión 3D y regalos personalizados en Arequipa. Envíos a todo el Perú.',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Ddreams 3D',
  image: 'https://ddreams3d.com/logo-ddreams-3d.jpg',
  description: 'Servicios de impresión 3D, modelado y prototipado en Arequipa. Envíos a todo el Perú.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Arequipa',
    addressRegion: 'Arequipa',
    addressCountry: 'PE',
  },
  url: 'https://ddreams3d.com',
  telephone: '+51901843288',
  priceRange: '$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -16.409047, // Coordinates for Arequipa (approximate, can be refined if user provides specific address)
    longitude: -71.537451,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient />
    </>
  );
}
