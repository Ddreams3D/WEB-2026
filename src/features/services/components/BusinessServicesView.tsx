'use client';

import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-neutral-600 dark:text-neutral-300">No se encontraron servicios disponibles.</p>
        <p className="text-sm text-neutral-500 mt-2">Verifica la conexión o intenta más tarde.</p>
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
            <span className="text-neutral-500 dark:text-white/60 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 block">
              Catálogo Completo
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              Soluciones integrales de manufactura aditiva, diseño y prototipado para particulares y empresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                customAction={{
                  label: "Cotizar Servicio",
                  href: "/contact",
                  icon: <FileText className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                }}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export { BusinessServicesView };
