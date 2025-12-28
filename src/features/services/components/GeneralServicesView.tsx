'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { useServiceProducts } from '@/hooks/useServiceProducts';

const GeneralServicesView = () => {
  const { services, isLoading } = useServiceProducts({ tag: 'general-service' });

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
        <p className="text-lg text-neutral-600 dark:text-neutral-300">No se encontraron servicios generales disponibles.</p>
        <p className="text-sm text-neutral-500 mt-2">Verifica la conexión o intenta más tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-neutral-500 dark:text-white/60 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 block">
          Creatividad & Precisión
        </span>
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
          Servicios de Impresión y Diseño 3D
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          Ofrecemos soluciones personalizadas para materializar tus ideas. 
          Desde prototipos funcionales hasta regalos únicos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          return (
            <ProductCard 
              key={service.id} 
              product={service} 
              showAddToCart={false}
              source="services"
              customAction={{
                label: "Cotizar Servicio",
                href: "/contact",
                icon: <FileText className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export { GeneralServicesView };
