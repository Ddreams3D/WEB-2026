import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ServiceCard } from '@/components/services/ServiceCard';
import { CatalogItem } from '@/shared/types/catalog';

interface ServicesPreviewSectionProps {
  services: CatalogItem[];
}

export const ServicesPreviewSection = ({ services }: ServicesPreviewSectionProps) => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Nuestros Servicios</h2>
          <p className="text-muted-foreground text-lg">
            Soluciones integrales de manufactura aditiva para empresas, estudiantes y hobbistas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((svc: any) => (
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </div>
         <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/services">Explorar todos los servicios</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
