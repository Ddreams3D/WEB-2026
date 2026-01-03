import { Metadata } from 'next';
import HomePageClient from '@/features/home/HomePageClient';
import SeasonalBanner from '@/features/seasonal/components/SeasonalBanner';
import { resolveActiveTheme } from '@/lib/seasonal-service';
import { getCachedFeaturedProjects } from '@/services/data-access.server';
import { PHONE_BUSINESS, PHONE_DISPLAY, ADDRESS_BUSINESS, SCHEDULE_BUSINESS } from '@/shared/constants/contactInfo';
import { JsonLd } from '@/components/seo/JsonLd';

// Revalidate every hour to check for seasonal changes automatically
// Note: Data Cache handles projects, this is for the page shell/seasonal theme
export const revalidate = 3600;

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

export default async function HomePage() {
  // Parallel fetching for performance
  const [activeTheme, featuredProjects] = await Promise.all([
    resolveActiveTheme(),
    getCachedFeaturedProjects(6)
  ]);

  return (
    <>
      {activeTheme && <SeasonalBanner config={activeTheme} />}
      <HomePageClient featuredProjects={featuredProjects} />
    </>
  );
}
