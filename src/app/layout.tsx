import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { Providers } from '../contexts/Providers';
import ConditionalNavbar from '../shared/components/layout/ConditionalNavbar';
import ConditionalFooter from '../shared/components/layout/ConditionalFooter';
import WhatsAppFloatingButton from '../shared/components/layout/WhatsAppFloatingButton';
import PageTransition from '../shared/components/ui/PageTransition';
import { getAppUrl } from '@/lib/url-utils';
import { CookieBanner } from '@/components/ui';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';

export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

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
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      )}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var darkMode = localStorage.getItem('darkMode');
                  if (darkMode && JSON.parse(darkMode)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="antialiased text-foreground dark:text-white">
        <OrganizationJsonLd />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <ConditionalNavbar />
            <main className="flex-grow">
              <PageTransition>{children}</PageTransition>
            </main>
            <ConditionalFooter />
            <WhatsAppFloatingButton />
            <CookieBanner />
          </div>
        </Providers>
      </body>
    </html>
  );
}
