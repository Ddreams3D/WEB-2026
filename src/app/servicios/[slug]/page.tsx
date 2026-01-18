import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServiceLandingsService } from '@/services/service-landings.service';
import ServiceLandingRenderer from '@/features/service-landings/components/ServiceLandingRenderer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const landing = await ServiceLandingsService.getBySlug(slug);

  if (!landing) {
    return {
      title: 'Servicio no encontrado | DDream3D',
    };
  }

  const isNoIndex =
    slug === 'soportes-personalizados-dispositivos' ||
    slug === 'landings-web-personalizadas';

  return {
    title: `${landing.metaTitle} | DDream3D`,
    description: landing.metaDescription,
    openGraph: {
      title: landing.metaTitle,
      description: landing.metaDescription,
      images: landing.heroImage ? [landing.heroImage] : [],
    },
    robots: isNoIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

// Static Params for Static Site Generation (SSG) if we wanted to build them at compile time
export async function generateStaticParams() {
  const landings = await ServiceLandingsService.getAll();
  return landings.map((landing) => ({
    slug: landing.slug,
  }));
}

export default async function ServiceLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const landing = await ServiceLandingsService.getBySlug(slug);

  if (!landing) {
    notFound();
  }

  // Ensure config is fully populated with defaults if needed
  // (Though our data file is robust)

  return <ServiceLandingRenderer config={landing} />;
}
