import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/shared/data/mockData';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  return mockProducts.find((p) => p.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  return {
    title: `${product.name} | Marketplace Ddreams 3D`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: primaryImage ? [primaryImage.url] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
