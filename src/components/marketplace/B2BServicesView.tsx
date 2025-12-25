import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { mockProducts } from '@/shared/data/mockData';
import { ProductCard } from '@/components/marketplace/ProductCard';

export const B2BServicesView = () => {
  // IDs of B2B services/products
  const b2bProductIds = ['7', '8', '9'];
  const b2bProducts = mockProducts.filter(product => b2bProductIds.includes(product.id));

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section for B2B */}
      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-900/50 rounded-2xl p-8 sm:p-12 text-center border border-neutral-200 dark:border-neutral-700/50 shadow-sm">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
          Soluciones Integrales para Empresas
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8">
          En Ddreams 3D potenciamos tu negocio con tecnología de impresión 3D. 
          Desde merchandising personalizado hasta producción de piezas finales.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/contact"
            className="inline-flex items-center px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transform hover:-translate-y-0.5"
          >
            Solicitar Cotización
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {b2bProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            showAddToCart={false}
            showWishlist={true}
            customAction={{
              label: "Solicitar Cotización",
              href: "/contact",
              icon: <FileText className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            }}
          />
        ))}
      </div>

      {/* Trust Indicators - Removed as per user request to clean up industries section */}
      {/* 
      <div className="text-center pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-6">
          Empresas que confían en nosotros
        </p>
        <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
            <div className="text-xl font-bold text-neutral-400">EMPRESA 1</div>
            <div className="text-xl font-bold text-neutral-400">EMPRESA 2</div>
            <div className="text-xl font-bold text-neutral-400">EMPRESA 3</div>
            <div className="text-xl font-bold text-neutral-400">EMPRESA 4</div>
        </div>
      </div>
      */}
    </div>
  );
};
