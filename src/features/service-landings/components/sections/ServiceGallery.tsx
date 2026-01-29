import React from 'react';
import { ServiceLandingConfig, ServiceLandingSection } from '@/shared/types/service-landing';
import DefaultImage from '@/shared/components/ui/DefaultImage';

interface ServiceGalleryProps {
  config: ServiceLandingConfig;
  gallerySection: ServiceLandingSection;
  primaryColor?: string;
  isPreview?: boolean;
}

export function ServiceGallery({ config, gallerySection, primaryColor, isPreview = false }: ServiceGalleryProps) {
  if (isPreview || !gallerySection || !gallerySection.items || gallerySection.items.length === 0) return null;

  // Use passed primaryColor or fallback
  const accentColor = primaryColor || config.primaryColor || '#000000';
  
  const badgeStyle = {
      borderColor: accentColor,
      color: accentColor,
      backgroundColor: 'transparent'
  } as React.CSSProperties;

  const title = gallerySection.title || "Casos de Éxito";
  const subtitle = gallerySection.subtitle || gallerySection.content || `Nuestros proyectos más destacados en ${config.name}.`;

  return (
    <section id="casos-exito" className="py-24 relative bg-background" style={{ '--primary-color': accentColor } as React.CSSProperties}>
      <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
              <div className="space-y-4">
                  <div 
                      className="inline-block px-3 py-1 rounded-full border text-xs font-bold tracking-[0.2em] uppercase mb-2 shadow-sm bg-background"
                      style={badgeStyle}
                  >
                      Trayectoria Comprobada
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground drop-shadow-sm">
                      {title}
                  </h2>
                  <p className="text-lg max-w-xl font-light text-muted-foreground">
                      {subtitle}
                  </p>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {gallerySection.items.map((item, index) => (
                  <div
                      key={index}
                      className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  >
                      {item.image && (
                          <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                              <DefaultImage
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              />
                          </div>
                      )}
                      <div className="p-6 space-y-3 flex-1 flex flex-col">
                          <h3 className="text-xl font-semibold text-card-foreground group-hover:text-[color:var(--primary-color)] transition-colors">
                              {item.title}
                          </h3>
                          <p className="text-muted-foreground flex-1 leading-relaxed">
                              {item.description}
                          </p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </section>
  );
}
