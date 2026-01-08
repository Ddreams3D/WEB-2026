import type { Metadata } from 'next';
import React from 'react';
import { Inter, Montserrat, Montserrat_Alternates } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from '@/contexts/Providers';
import { getAppUrl } from '@/lib/url-utils';
import { CookieBanner } from '@/components/ui';
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';
import type { Viewport } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['300', '600'],
  variable: '--font-montserrat-alternates',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: 'Ddreams 3D - Servicios profesionales de impresión 3D',
    template: '%s | Ddreams 3D',
  },
  description:
    'Expertos en impresión 3D, modelado y prototipado rápido. Transformamos tus ideas en realidad con tecnología de vanguardia.',
  keywords: [
    'impresión 3D',
    'modelado 3D',
    'prototipado rápido',
    'fabricación digital',
    'diseño 3D',
    'Perú',
    'Arequipa',
  ],
  authors: [{ name: 'Ddreams 3D' }],
  creator: 'Ddreams 3D',
  publisher: 'Ddreams 3D',
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://ddreams3d.com',
    siteName: 'Ddreams 3D',
    title: 'Ddreams 3D - Servicios profesionales de impresión 3D',
    description:
      'Expertos en impresión 3D, modelado y prototipado rápido. Transformamos tus ideas en realidad con tecnología de vanguardia.',
    images: [
      {
        url: '/logo-ddreams-3d.jpg',
        width: 1200,
        height: 630,
        alt: 'Ddreams 3D Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ddreams 3D - Servicios profesionales de impresión 3D',
    description:
      'Expertos en impresión 3D, modelado y prototipado rápido. Transformamos tus ideas en realidad con tecnología de vanguardia.',
    images: ['/logo-ddreams-3d.jpg'],
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
  icons: {
    icon: [
      { url: '/logo/isotipo_DD_negro_V2.svg' },
    ],
    apple: [
      { url: '/logo/isotipo_DD_negro_V2.svg' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable} ${montserratAlternates.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body 
        className="antialiased text-foreground dark:text-white"
        suppressHydrationWarning
      >
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
        <LocalBusinessJsonLd />
        <React.StrictMode>
          <Providers>
            {children}
          </Providers>
        </React.StrictMode>
      </body>
    </html>
  );
}
