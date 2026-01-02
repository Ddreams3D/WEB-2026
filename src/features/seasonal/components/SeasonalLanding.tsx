'use client';

import React, { useEffect, useState } from 'react';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductService } from '@/services/product.service';
import { CatalogItem } from '@/shared/types/catalog';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { THEME_CONFIG } from '@/config/themes';
import { cn } from '@/lib/utils';

interface SeasonalLandingProps {
  config: SeasonalThemeConfig;
}

export default function SeasonalLanding({ config }: SeasonalLandingProps) {
  const [featuredProducts, setFeaturedProducts] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get theme colors from existing config
  const themeStyles = THEME_CONFIG[config.themeId] || THEME_CONFIG.standard;

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const all = await ProductService.getAllProducts();
        
        // Filter by the seasonal tag (case insensitive)
        const tag = config.landing.featuredTag.toLowerCase();
        const filtered = all.filter(p => 
          p.tags.some(t => t.toLowerCase() === tag)
        );
        
        setFeaturedProducts(filtered);
      } catch (error) {
        console.error('Error loading seasonal products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [config.landing.featuredTag]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/30 pt-20 pb-32">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={cn(
            "absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl",
            themeStyles.previewColors[0].replace('bg-', 'bg-') // Reuse color classes loosely or fallback
          )} />
          <div className={cn(
            "absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full opacity-20 blur-3xl",
            themeStyles.previewColors[0]
          )} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-sm font-medium animate-fade-in-up">
              <span className={cn("flex h-2 w-2 rounded-full", themeStyles.previewColors[0])} />
              <span>{config.landing.heroSubtitle || config.name}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-fade-in-up delay-100">
              {config.landing.heroTitle}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
              {config.landing.heroDescription}
            </p>

            <div className="flex items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Button size="lg" className={cn("h-12 px-8 text-base", themeStyles.previewColors[0])} asChild>
                <Link href={config.landing.ctaLink}>
                  {config.landing.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-24 container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">
                {config.landing.featuredTitle || 'Destacados de Temporada'}
              </h2>
              <p className="text-muted-foreground">
                Selección exclusiva para esta temporada
              </p>
            </div>
            <Link 
              href={`/catalogo-impresion-3d?q=${config.landing.featuredTag}`}
              className="hidden sm:flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Ver todo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <ProductGrid 
            products={featuredProducts}
            emptyMessage="Pronto agregaremos productos a esta colección."
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          />
          
          <div className="mt-12 text-center sm:hidden">
             <Link 
              href={`/catalogo-impresion-3d?q=${config.landing.featuredTag}`}
              className="inline-flex items-center text-primary font-medium"
            >
              Ver todo el catálogo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
