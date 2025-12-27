'use client';

import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { ProductService } from '@/services/product.service';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Product } from '@/shared/types';

const GeneralServicesView = () => {
  const [services, setServices] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // IDs of General services/products
  // 18: Impresión 3D por encargo
  // 17: Modelado 3D personalizado
  // 19: Acabado profesional
  // 13: Maquetas Arquitectónicas
  // 14: Prototipado de Ingeniería
  // 20: Trofeos 3D temáticos
  // 16: Regalos Personalizados
  // 15: Material Didáctico
  const generalServiceIds = ['18', '17', '19', '13', '14', '20', '16', '15'];
  
  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log('Iniciando carga de servicios generales...');
        const allProducts = await ProductService.getAllProducts();
        console.log('Total productos obtenidos:', allProducts?.length);
        
        if (!allProducts) {
          console.error('Error: allProducts es undefined o null');
          setServices([]);
          return;
        }

        // Sort services based on the order of IDs in generalServiceIds
        const filteredServices = allProducts
          .filter(product => generalServiceIds.includes(product.id))
          .sort((a, b) => {
            return generalServiceIds.indexOf(a.id) - generalServiceIds.indexOf(b.id);
          });
          
        console.log('Servicios filtrados:', filteredServices.length);
        setServices(filteredServices);
      } catch (error) {
        console.error('Error loading general services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
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
        {services.map((service) => (
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
        ))}
      </div>
    </div>
  );
};

export { GeneralServicesView };
