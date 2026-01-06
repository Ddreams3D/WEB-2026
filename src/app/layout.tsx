import type { Metadata } from 'next';
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
    <html lang="es" className={`${inter.variable} ${montserrat.variable} ${montserratAlternates.variable}`} suppressHydrationWarning>
      <head>
        <Script id="theme-analytics-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var gaId = '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''}';
                if (gaId && localStorage.getItem('ddreams_exclude_analytics') === 'true') {
                  window['ga-disable-' + gaId] = true;
                }
              } catch(e) {}
              try {
                var darkMode = localStorage.getItem('darkMode');
                if (darkMode && JSON.parse(darkMode)) {
                  document.documentElement.classList.add('dark');
                }
                
                // Cargar tema inmediatamente para evitar parpadeo (excepto en /impresion-3d-arequipa)
                var theme = localStorage.getItem('theme');
                var path = (typeof location !== 'undefined' && location.pathname) || '';
                if (theme && path !== '/impresion-3d-arequipa') {
                  document.documentElement.setAttribute('data-theme', theme);
                } else {
                  // Asegurar tema estándar desde el inicio en esa landing
                  document.documentElement.setAttribute('data-theme', 'standard');
                }
              } catch (e) {}
            })()
          `}
        </Script>
      </head>
      <body 
        className="antialiased text-foreground dark:text-white"
        suppressHydrationWarning
      >
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
        <LocalBusinessJsonLd />
        <AnalyticsTracker />
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
