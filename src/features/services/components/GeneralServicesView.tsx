'use client';

import React, { useMemo } from 'react';
import { FileText } from 'lucide-react';
import { mockProducts } from '@/shared/data/mockData';
import { ProductCard } from '@/components/marketplace/ProductCard';

export const GeneralServicesView = () => {
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
  
  // Sort services based on the order of IDs in generalServiceIds
  const services = useMemo(() => {
    if (!mockProducts || !Array.isArray(mockProducts)) return [];
    
    return mockProducts
      .filter(product => product && generalServiceIds.includes(product.id))
      .sort((a, b) => {
        return generalServiceIds.indexOf(a.id) - generalServiceIds.indexOf(b.id);
      });
  }, []);

  if (!services.length) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
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
            showWishlist={true}
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
