import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ServiceService } from '@/services/service.service';
import ProductDetailClient from '@/features/catalog/ProductDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';

interface Props {
  params: Promise<{ id: string }>;
}

async function getService(id: string) {
  return await ServiceService.getServiceById(id);
}

// Adaptador para convertir Service (domain) a Product (types/index)
function adaptServiceToProduct(service: Service): Product {
  // Aseguramos que el servicio tenga las propiedades mínimas requeridas por Product
  return {
    ...service,
    kind: 'service', // Forzamos el discriminador para seguridad
    price: service.price || 0,
    isActive: service.isActive,
    isFeatured: service.isFeatured,
    rating: service.rating || 0,
    reviewCount: service.reviewCount || 0,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    // Propiedades adicionales que pueden faltar
    stock: 999, // Servicios "siempre en stock" para permitir cotización
    minQuantity: 1,
    maxQuantity: 100,
    specifications: service.specifications || [],
    options: [],
    tags: service.tags || [],
    // Forzar el tipo para satisfacer la interfaz Product
  } as unknown as Product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    return {
      title: 'Servicio no encontrado',
    };
  }

  const primaryImage = service.images.find(img => img.isPrimary) || service.images[0];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com';

  const description = service.shortDescription 
    ? `${service.shortDescription} Cotiza este servicio en Arequipa. Ddreams 3D.`
    : `${service.description.substring(0, 150)}... Cotización personalizada en Ddreams 3D.`;

  return {
    title: `${service.name} | Servicios Ddreams 3D`,
    description: description,
    keywords: [...service.tags],
    alternates: {
      canonical: `${baseUrl}/services/${service.slug || service.id}`,
    },
    openGraph: {
      title: `${service.name} | Servicios Ddreams 3D`,
      description: description,
      images: primaryImage ? [primaryImage.url] : [],
      type: 'website',
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  // Redirect to slug URL if accessing by ID or different slug
  if (service.slug && id !== service.slug) {
    redirect(`/services/${service.slug}`);
  }

  // Convertir a Product para reutilizar el componente
  const productAdapter = adaptServiceToProduct(service);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    image: service.images.map(img => img.url),
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Ddreams 3D'
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com'}/services/${service.slug || service.id}`,
      priceCurrency: service.currency,
      price: service.price || 0,
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Casteamos a any temporalmente para resolver el conflicto de tipos entre domain.ts e index.ts */}
      <ProductDetailClient product={productAdapter as any} />
    </>
  );
}
