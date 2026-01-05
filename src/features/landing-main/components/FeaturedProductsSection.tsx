import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { CatalogItem } from '@/shared/types/catalog';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsSectionProps {
  featuredProducts: CatalogItem[];
}

export const FeaturedProductsSection = ({ featuredProducts }: FeaturedProductsSectionProps) => {
  return (
    <section id="coleccion" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Catálogo Destacado</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Impresiones Populares</h2>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link href="/catalogo-impresion-3d">
              Ver todo el catálogo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        <ProductGrid products={featuredProducts} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" />
      </div>
    </section>
  );
};
