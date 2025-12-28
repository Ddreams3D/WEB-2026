import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ProductService } from '@/services/product.service';
import ProductDetailClient from '@/features/marketplace/ProductDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  return await ProductService.getProductById(id);
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com';

  const description = product.shortDescription 
    ? `${product.shortDescription} Personaliza este diseño o cotiza uno nuevo en Arequipa. Envíos a todo el Perú.`
    : `${product.description.substring(0, 150)}... Regalo personalizado en Arequipa. Compra online en Ddreams 3D.`;

  return {
    title: `${product.name} | Ddreams 3D Arequipa`,
    description: description,
    keywords: [...product.tags, ...(product.seoKeywords || [])],
    alternates: {
      canonical: `${baseUrl}/marketplace/product/${product.slug || product.id}`,
    },
    openGraph: {
      title: `${product.name} | Ddreams 3D Arequipa`,
      description: description,
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

  // Redirect to slug URL if accessing by ID or different slug
  if (product.slug && id !== product.slug) {
    redirect(`/marketplace/product/${product.slug}`);
  }

  // Fetch related products
  const allProducts = await ProductService.getAllProducts();
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.categoryId === product.categoryId || p.tags?.some(tag => product.tags?.includes(tag))))
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map(img => img.url),
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Ddreams 3D'
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com'}/marketplace/product/${product.slug || product.id}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    },
    ...(product.rating && product.reviewCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount
      }
    } : {})
  };

  const breadcrumbItems = [
    { name: 'Inicio', item: process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com' },
    { name: 'Marketplace', item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com'}/marketplace` },
    { name: product.name, item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com'}/marketplace/product/${product.slug || product.id}` },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
