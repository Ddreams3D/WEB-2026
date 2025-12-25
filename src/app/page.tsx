import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Ddreams 3D | Impresión 3D y Regalos Personalizados en Arequipa',
  description: 'Especialistas en regalos personalizados y servicios de impresión 3D en Arequipa. Creamos piezas únicas, trofeos, maquetas y prototipos con la mejor calidad.',
  keywords: 'impresión 3D arequipa, regalos personalizados, trofeos 3d, maquetas, prototipado rápido, diseño 3D, regalos corporativos',
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
    description: 'Especialistas en regalos personalizados y servicios de impresión 3D en Arequipa. Creamos piezas únicas, trofeos, maquetas y prototipos con la mejor calidad.',
    type: 'website',
    locale: 'es_PE',
    siteName: 'Ddreams 3D',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ddreams 3D | Regalos Personalizados e Impresión 3D en Arequipa',
    description: 'Especialistas en regalos personalizados y servicios de impresión 3D en Arequipa.',
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
