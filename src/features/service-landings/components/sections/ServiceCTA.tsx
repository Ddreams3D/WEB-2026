import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

interface ServiceCTAProps {
  primaryColor: string;
  isPreview?: boolean;
}

export function ServiceCTA({ primaryColor, isPreview = false }: ServiceCTAProps) {
  if (isPreview) return null;

  return (
    <section className="py-24 relative bg-card text-center overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundColor: primaryColor }} />
      
      <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto backdrop-blur-md border rounded-3xl p-8 md:p-16 relative overflow-hidden z-10 bg-background/50 shadow-xl">
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                  ¿Listo para comenzar tu proyecto?
              </h2>
              <p className="text-lg mb-10 font-light text-muted-foreground">
                  Cuéntanos tu idea y te ayudaremos a hacerla realidad con la mejor tecnología de impresión 3D.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="h-12 px-8 text-lg border-0 shadow-lg text-white hover:opacity-90" style={{ backgroundColor: primaryColor }} asChild>
                      <Link href="/cotizar">
                          Solicitar Cotización
                      </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-lg" asChild>
                      <Link href="/contacto">
                          Hablar con un asesor
                      </Link>
                  </Button>
              </div>
          </div>
      </div>
    </section>
  );
}
