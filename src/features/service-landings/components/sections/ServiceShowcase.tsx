import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { CatalogItem } from '@/shared/types/catalog';
import { ServiceLandingConfig, ServiceLandingSection } from '@/shared/types/service-landing';
import DefaultImage from '@/shared/components/ui/DefaultImage';

interface ServiceShowcaseProps {
  config: ServiceLandingConfig;
  featuredProducts: CatalogItem[];
  gallerySection?: ServiceLandingSection;
  isPreview?: boolean;
  primaryColor?: string;
}

export function ServiceShowcase({ config, featuredProducts, gallerySection, isPreview = false, primaryColor }: ServiceShowcaseProps) {
  if (isPreview) return null;

  const isOrganicLanding = config.id === 'organic-modeling';
  
  // Use passed primaryColor or fallback
  const accentColor = primaryColor || config.primaryColor || '#000000';
  
  const badgeStyle = {
      borderColor: accentColor,
      color: accentColor,
      backgroundColor: 'transparent' // Or a very light tint if preferred
  } as React.CSSProperties;

  // Logic: Prioritize Gallery if it exists (manual override), otherwise show Products
  // const showGallery = gallerySection && gallerySection.items && gallerySection.items.length > 0;
  
  // Title & Subtitle logic
  const title = "Proyectos Destacados";
  const subtitle = `Una selección de nuestros mejores trabajos en ${config.name}.`;

  return (
    <section id="coleccion" className="py-32 relative bg-muted/5" style={{ '--primary-color': accentColor } as React.CSSProperties}>
      <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
              <div className="space-y-4">
                  <div 
                      className="inline-block px-3 py-1 rounded-full border text-xs font-bold tracking-[0.2em] uppercase mb-2 shadow-[0_0_10px_-3px_rgba(0,0,0,0.2)] bg-background"
                      style={badgeStyle}
                  >
                      Portafolio Relacionado
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground drop-shadow-sm">
                      {title}
                  </h2>
                  <p className="text-lg max-w-xl font-light text-muted-foreground">
                      {subtitle}
                  </p>
              </div>
              
              {!isOrganicLanding && (
                <Button 
                    variant="ghost" 
                    className="group hidden md:flex rounded-full px-6 hover:bg-opacity-10" 
                    style={{ color: accentColor } as React.CSSProperties}
                    asChild
                >
                    <Link href={`/catalogo-impresion-3d?q=${config.featuredTag || ''}`}>
                        Ver todo el catálogo
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
              )}
          </div>

          {featuredProducts.length > 0 ? (
              <ProductGrid 
                  products={featuredProducts}
                  emptyMessage="Pronto agregaremos productos a esta colección."
                  className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 relative z-10"
              />
          ) : (
              <div className="border-2 border-dashed rounded-3xl p-12 text-center bg-muted/10 border-muted">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="text-xl font-semibold mb-2">Preparando la Colección</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Estamos curando los mejores proyectos de {config.name}. 
                  </p>
              </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
              {!isOrganicLanding && (
                <Button 
                    variant="outline" 
                    className="w-full" 
                    style={{ borderColor: accentColor, color: accentColor }}
                    asChild
                >
                    <Link href={`/catalogo-impresion-3d?q=${config.featuredTag || ''}`}>
                        Ver todo el catálogo
                    </Link>
                </Button>
              )}
          </div>
      </div>
    </section>
  );
}
