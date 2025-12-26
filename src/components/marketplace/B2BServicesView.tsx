'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { ProductService } from '@/services/product.service';
import { isFirebaseConfigured } from '@/lib/firebase';
import { ProductCard } from './ProductCard';

import { Product } from '@/shared/types';

export const B2BServicesView = () => {
  const [b2bProducts, setB2BProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // IDs of B2B services/products
  const b2bProductIds = ['7', '8', '9'];

  useEffect(() => {
    const loadB2BProducts = async () => {
      try {
        const allProducts = await ProductService.getAllProducts();
        const filtered = allProducts.filter((product: Product) => b2bProductIds.includes(product.id));
        setB2BProducts(filtered);
      } catch (error) {
        console.error('Error loading B2B products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadB2BProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
            source="services"
            customAction={{
              label: "Solicitar Cotización",
              href: "/contact",
              icon: <FileText className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            }}
          />
        ))}
      </div>
    </div>
  );
};
