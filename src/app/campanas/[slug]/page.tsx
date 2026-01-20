import { Metadata } from 'next';
import SeasonalLanding from '@/features/seasonal/components/SeasonalLanding';
import OutOfSeasonLanding from '@/features/seasonal/components/OutOfSeasonLanding';
import { getSeasonalThemes, isDateInRange } from '@/lib/seasonal-service';
import { getAppUrl } from '@/lib/url-utils';
import { JsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const baseUrl = getAppUrl();
  const url = `${baseUrl}/campanas/${theme.id}`;
  // Ensure absolute URL for image
  const imageUrl = theme.landing.heroImage?.startsWith('http') 
    ? theme.landing.heroImage 
    : `${baseUrl}${theme.landing.heroImage || `/${StoragePathBuilder.ui.brand()}/impresion-3d-arequipa-ddreams-v2.png`}`;

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
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center space-y-3">
          <h1 className="text-2xl font-bold">Campaña no disponible</h1>
          <p className="text-muted-foreground">
            Esta URL no corresponde a una campaña activa o fue retirada.
          </p>
          <div className="pt-2">
            <Link href="/" className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    );
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
      : `${baseUrl}${theme.landing.heroImage || `/${StoragePathBuilder.ui.brand()}/impresion-3d-arequipa-ddreams-v2.png`}`,
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

  let specialJsonLd: Record<string, any> | null = null;
  try {
    const ranges = theme.dateRanges || [];
    const currentYear = now.getFullYear();
    const projectedRanges = ranges.map(r => ({
      startDate: new Date(currentYear, r.start.month - 1, r.start.day),
      endDate: new Date(currentYear, r.end.month - 1, r.end.day),
    }));
    const pickRange = () => {
      const active = projectedRanges.find(r => now >= r.startDate && now <= r.endDate);
      if (active) return active;
      const upcoming = projectedRanges
        .filter(r => r.startDate > now)
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
      if (upcoming) return upcoming;
      const past = projectedRanges
        .filter(r => r.endDate < now)
        .sort((a, b) => b.endDate.getTime() - a.endDate.getTime())[0];
      return past || projectedRanges[0];
    };
    const range = pickRange();
    if (range) {
      specialJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SpecialAnnouncement',
        name: theme.name,
        description: theme.landing.heroTitle,
        text: theme.landing.heroDescription,
        url: `${baseUrl}/campanas/${theme.id}`,
        startDate: range.startDate.toISOString(),
        endDate: range.endDate.toISOString(),
        datePosted: range.startDate.toISOString(),
        expires: range.endDate.toISOString(),
        category: 'https://schema.org/SpecialAnnouncement',
        publisher: {
          '@type': 'Organization',
          name: 'Ddreams 3D',
          url: baseUrl
        }
      };
    }
  } catch {}

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
        {specialJsonLd && <JsonLd data={specialJsonLd} />}
        <OutOfSeasonLanding themeName={theme.name} nextStartDate={nextDate} />
      </>
    );
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      {specialJsonLd && <JsonLd data={specialJsonLd} />}
      <SeasonalLanding config={theme} />
    </>
  );
}
