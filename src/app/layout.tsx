import type { Metadata } from 'next';
import React from 'react';
import { Inter, Montserrat, Montserrat_Alternates, Playfair_Display, Oswald, Roboto, Open_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import './globals.css';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';
import { Providers } from '@/contexts/Providers';
import { getAppUrl } from '@/lib/url-utils';
import { CookieBanner } from '@/components/ui';
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';
import { ServerThemeStyle } from '@/components/seasonal/ServerThemeStyle';
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

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com'),
  alternates: {
    canonical: './',
  },
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
        url: `/${StoragePathBuilder.ui.brand()}/logo-ddreams-3d.jpg`,
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
    images: [`/${StoragePathBuilder.ui.brand()}/logo-ddreams-3d.jpg`],
  },
  icons: {
    icon: '/logo/isotipo_DD_negro_V2.svg',
    shortcut: '/logo/isotipo_DD_negro_V2.svg',
    apple: '/logo/isotipo_DD_negro_V2.svg',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable} ${montserratAlternates.variable} ${playfair.variable} ${oswald.variable} ${roboto.variable} ${openSans.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body 
        className="antialiased text-foreground dark:text-white"
        suppressHydrationWarning
      >
        <ServerThemeStyle />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedDarkMode = localStorage.getItem('darkMode');
                  var initialDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (initialDarkMode) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme) {
                    document.documentElement.setAttribute('data-theme', savedTheme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Script para excluir analytics si es necesario */}
        <Script
          id="analytics-exclusion-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function () {
              try {
                var gaId = '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''}';
                if (!gaId) return;
                if (localStorage.getItem('ddreams_exclude_analytics') === 'true') {
                  window['ga-disable-' + gaId] = true;
                }
              } catch (e) {}
            })();
          `,
          }}
        />
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
