import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICE_LANDINGS_DATA } from '@/shared/data/service-landings-data';
import ServiceLandingRenderer from '@/features/service-landings/components/ServiceLandingRenderer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const landing = SERVICE_LANDINGS_DATA.find(l => l.slug === slug);

  if (!landing) {
    return {
      title: 'Servicio no encontrado | DDream3D',
    };
  }

  return {
    title: `${landing.metaTitle} | DDream3D`,
    description: landing.metaDescription,
    openGraph: {
      title: landing.metaTitle,
      description: landing.metaDescription,
      images: landing.heroImage ? [landing.heroImage] : [],
    },
  };
}

// Static Params for Static Site Generation (SSG) if we wanted to build them at compile time
export async function generateStaticParams() {
  return SERVICE_LANDINGS_DATA.map((landing) => ({
    slug: landing.slug,
  }));
}

export default async function ServiceLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const landing = SERVICE_LANDINGS_DATA.find(l => l.slug === slug);

  if (!landing) {
    notFound();
  }

  // Ensure config is fully populated with defaults if needed
  // (Though our data file is robust)

  return <ServiceLandingRenderer config={landing} />;
}
