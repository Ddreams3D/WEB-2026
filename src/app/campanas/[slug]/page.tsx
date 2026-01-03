import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SeasonalLanding from '@/features/seasonal/components/SeasonalLanding';
import OutOfSeasonLanding from '@/features/seasonal/components/OutOfSeasonLanding';
import { getSeasonalThemes, isDateInRange } from '@/lib/seasonal-service';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { getAppUrl } from '@/lib/url-utils';
import { JsonLd } from '@/components/seo/JsonLd';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Allow static generation for known themes if possible, or dynamic for new ones
// revalidate = 3600 (1 hour)
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const themes = await getSeasonalThemes();
  const theme = themes.find(t => t.id === slug);

  if (!theme) {
    return {
      title: 'Campaña No Encontrada | Ddreams 3D',
    };
  }

  const baseUrl = getAppUrl();
  const url = `${baseUrl}/campanas/${theme.id}`;
  // Ensure absolute URL for image
  const imageUrl = theme.landing.heroImage?.startsWith('http') 
    ? theme.landing.heroImage 
    : `${baseUrl}${theme.landing.heroImage || '/images/og-default.jpg'}`;

  return {
    title: `${theme.landing.heroTitle} | Regalos Personalizados | Ddreams 3D`,
    description: theme.landing.heroDescription,
    keywords: [theme.landing.heroTitle, 'regalos personalizados', 'impresión 3d', 'ddreams 3d', theme.name, theme.landing.featuredTag],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: theme.landing.heroTitle,
      description: theme.landing.heroDescription,
      url: url,
      siteName: 'Ddreams 3D',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: theme.landing.heroTitle,
        },
      ],
      locale: 'es_PE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: theme.landing.heroTitle,
      description: theme.landing.heroDescription,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const themes = await getSeasonalThemes();
  return themes.map((theme) => ({
    slug: theme.id,
  }));
}

export default async function CampaignPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const themes = await getSeasonalThemes();
  const theme = themes.find(t => t.id === slug);

  if (!theme) {
    notFound();
  }

  // Check if theme is active
  const now = new Date();
  
  // Manual override check
  const isActiveManual = theme.isActive === true;
  
  // Date range check
  const isActiveDate = theme.dateRanges.some(range => 
    isDateInRange(now, range.start, range.end)
  );
  
  // Preview mode check (allow if preview=true)
  const isPreview = preview === 'true';

  const isActive = isActiveManual || isActiveDate || isPreview;

  // Structured Data (JSON-LD)
  const baseUrl = getAppUrl();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: theme.landing.heroTitle,
    description: theme.landing.heroDescription,
    url: `${baseUrl}/campanas/${theme.id}`,
    image: theme.landing.heroImage?.startsWith('http') 
      ? theme.landing.heroImage 
      : `${baseUrl}${theme.landing.heroImage || '/images/og-default.jpg'}`,
    publisher: {
      '@type': 'Organization',
      name: 'Ddreams 3D',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo/isotipo_DD_negro_V2.svg`
      }
    },
    about: {
      '@type': 'Thing',
      name: theme.name
    }
  };

  if (!isActive) {
    // Find next start date
    // Sort dates, find first one in future
    // Assuming simple ranges for now
    let nextDate: Date | undefined;
    
    // Naive next date finder
    const sortedRanges = [...theme.dateRanges].sort((a, b) => {
        const dateA = new Date(now.getFullYear(), a.start.month - 1, a.start.day);
        const dateB = new Date(now.getFullYear(), b.start.month - 1, b.start.day);
        return dateA.getTime() - dateB.getTime();
    });

    for (const range of sortedRanges) {
        let start = new Date(now.getFullYear(), range.start.month - 1, range.start.day);
        if (start < now) {
            // Check next year if passed
            start = new Date(now.getFullYear() + 1, range.start.month - 1, range.start.day);
        }
        if (!nextDate || start < nextDate) {
            nextDate = start;
        }
    }

    return (
      <>
        <JsonLd data={jsonLd} />
        <OutOfSeasonLanding themeName={theme.name} nextStartDate={nextDate} />
      </>
    );
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <SeasonalLanding config={theme} />
    </>
  );
}
