import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SeasonalLanding from '@/features/seasonal/components/SeasonalLanding';
import OutOfSeasonLanding from '@/features/seasonal/components/OutOfSeasonLanding';
import { getSeasonalThemes, isDateInRange } from '@/lib/seasonal-service';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';

interface PageProps {
  params: {
    slug: string;
  };
}

// Allow static generation for known themes if possible, or dynamic for new ones
// revalidate = 3600 (1 hour)
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const themes = await getSeasonalThemes();
  const theme = themes.find(t => t.id === params.slug);

  if (!theme) {
    return {
      title: 'Campaña No Encontrada | Ddreams 3D',
    };
  }

  return {
    title: `${theme.landing.heroTitle} | Ddreams 3D`,
    description: theme.landing.heroDescription,
  };
}

export async function generateStaticParams() {
  const themes = await getSeasonalThemes();
  return themes.map((theme) => ({
    slug: theme.id,
  }));
}

export default async function CampaignPage({ params }: PageProps) {
  const themes = await getSeasonalThemes();
  const theme = themes.find(t => t.id === params.slug);

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

  const isActive = isActiveManual || isActiveDate;

  if (!isActive) {
    return <OutOfSeasonLanding />;
  }

  return <SeasonalLanding config={theme} />;
}
