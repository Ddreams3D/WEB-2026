'use client';

import React, { useState, useEffect } from 'react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceService } from '@/services/service.service';
import { Service } from '@/shared/types/domain';

const BusinessServicesView = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const allServices = await ServiceService.getAllServices();
        // Show both general and business services
        const filtered = allServices.filter(s => 
          s.tags && (s.tags.includes('general-service') || s.tags.includes('business-service'))
        );
        setServices(filtered);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No se encontraron servicios disponibles.</p>
        <p className="text-sm text-muted-foreground mt-2">Verifica la conexión o intenta más tarde.</p>
      </div>
    );
  }

  // Eliminar duplicados si los hubiera y mostrar una sola lista unificada
  // Usamos un Map para asegurar unicidad por ID
  const uniqueServices = Array.from(new Map(services.map(s => [s.id, s])).values())
    .sort((a, b) => a.displayOrder - b.displayOrder);

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
