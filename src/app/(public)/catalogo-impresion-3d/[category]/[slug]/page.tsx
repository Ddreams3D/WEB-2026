import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ProductService } from '@/services/product.service';
import ProductDetailClient from '@/features/catalog/ProductDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

async function getProduct(slug: string) {
  return await ProductService.getProductById(slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  const primaryImage = product.images?.find(img => img.isPrimary) || (product.images || [])[0];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com';
  const categorySlug = product.category?.slug || product.categoryId || category;

  const description = product.shortDescription 
    ? `${product.shortDescription} Personaliza este diseño o cotiza uno nuevo en Arequipa. Envíos a todo el Perú.`
    : `${product.description.substring(0, 150)}... Regalo personalizado en Arequipa. Compra online en Ddreams 3D.`;

  // Detect robots directive from tags
  const isNoIndex = product.tags?.some(tag => tag.toLowerCase() === 'scope:noindex');
  const isNoFollow = product.tags?.some(tag => tag.toLowerCase() === 'scope:nofollow');

  const robots = {
    index: !isNoIndex,
    follow: !isNoFollow,
    googleBot: {
      index: !isNoIndex,
      follow: !isNoFollow,
    }
  };

  return {
    title: `Comprar ${product.name} en Arequipa | Ddreams 3D`,
    description: description,
    keywords: [...product.tags, ...(product.seoKeywords || [])],
    robots: robots,
    alternates: {
      canonical: `${baseUrl}/catalogo-impresion-3d/${categorySlug}/${product.slug || product.id}`,
    },
    openGraph: {
      title: `Comprar ${product.name} en Arequipa | Ddreams 3D`,
      description: description,
      images: primaryImage ? [primaryImage.url] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Ensure correct category in URL
  const correctCategorySlug = product.category?.slug || product.categoryId || 'general';
  
  if (category !== correctCategorySlug) {
    redirect(`/catalogo-impresion-3d/${correctCategorySlug}/${product.slug || product.id}`);
  }

  // Redirect to slug URL if accessing by ID or different slug
  if (product.slug && slug !== product.slug) {
    redirect(`/catalogo-impresion-3d/${correctCategorySlug}/${product.slug}`);
  }

  // Fetch related products
  const allProducts = await ProductService.getAllProducts();
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.categoryId === product.categoryId || p.tags?.some(tag => product.tags?.includes(tag))))
    .slice(0, 4);

  const categoryName = product.categoryName || product.category?.name || category;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: (product.images || []).map(img => img.url),
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Ddreams 3D'
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com'}/catalogo-impresion-3d/${correctCategorySlug}/${product.slug || product.id}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: 'https://schema.org/InStock',
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
    { name: 'Catálogo', item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com'}/catalogo-impresion-3d` },
    { name: categoryName, item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com'}/catalogo-impresion-3d/${correctCategorySlug}` },
    { name: product.name, item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ddreams3d.com'}/catalogo-impresion-3d/${correctCategorySlug}/${product.slug || product.id}` },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
