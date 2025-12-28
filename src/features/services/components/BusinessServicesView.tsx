'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { useServiceProducts } from '@/hooks/useServiceProducts';
import { BUSINESS_SERVICE_IDS } from '@/config/services';

const BusinessServicesView = () => {
  const { services, isLoading } = useServiceProducts(BUSINESS_SERVICE_IDS);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-neutral-600 dark:text-neutral-300">No se encontraron servicios empresariales disponibles.</p>
        <p className="text-sm text-neutral-500 mt-2">Intenta recargar la página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-neutral-500 dark:text-white/60 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 block">
          Soluciones & Escala
        </span>
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
          Servicios Empresariales B2B
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          Soluciones especializadas para empresas, instituciones y profesionales.
          Calidad industrial y atención personalizada para grandes proyectos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {services.map((service) => (
          <ProductCard 
            key={service.id} 
            product={service} 
            showAddToCart={false}
            source="services"
            customAction={{
              label: "Cotizar Proyecto B2B",
              href: "/contact",
              icon: <Building2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            }}
          />
        ))}
      </div>
    </div>
  );
};

export { BusinessServicesView };
