'use client';

import React, { useState, useEffect } from 'react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceService } from '@/services/service.service';
import { Service } from '@/shared/types/domain';

interface BusinessServicesViewProps {
  initialServices?: Service[];
}

const BusinessServicesView = ({ initialServices = [] }: BusinessServicesViewProps) => {
  // Si initialServices viene lleno, lo usamos. Si no, podríamos hacer fetch (pero lo ideal es que venga lleno)
  // Para mantener compatibilidad si se usa en otro lado sin props, podemos dejar el efecto pero condicionado.
  // Pero para este caso, asumiremos que siempre pasaremos datos desde el Server Component.
  
  const uniqueServices = initialServices.length > 0 
    ? Array.from(new Map(initialServices.map(s => [s.id, s])).values())
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  if (uniqueServices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No se encontraron servicios disponibles.</p>
        <p className="text-sm text-muted-foreground mt-2">Verifica la conexión o intenta más tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-20 animate-fade-in">
      
      {/* LISTA UNIFICADA DE SERVICIOS */}
      {uniqueServices.length > 0 && (
        <section>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 block">
              Catálogo Unificado
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-muted-foreground">
              Soluciones integrales de manufactura aditiva y diseño. Añade servicios a tu pedido y cotiza en línea al instante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export { BusinessServicesView };
