'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollToTopButton } from './footer/ScrollToTopButton';
import { SecretAdminModal } from './footer/SecretAdminModal';
import { FooterContactInfo } from './footer/FooterContactInfo';
import { FooterSocials } from './footer/FooterSocials';
import { FooterLinks } from './footer/FooterLinks';
import { FooterLegal } from './footer/FooterLegal';

const Footer = () => {
  const [showSecretModal, setShowSecretModal] = useState(false);

  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSecretModal(true);
  };

  return (
    <footer className={cn("bg-black text-white relative overflow-hidden")}>
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Sección principal del footer - Estilo elegante y compacto */}
        <div className="space-y-8">
          {/* Logo y descripción - Centrado y elegante */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo/isotipo_DD_blanco_V2.svg"
                alt="isotipo"
                width={100}
                height={40}
                className="object-contain"
              />
            </div>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Estudio creativo de impresión y modelado 3D. Proyectos
              personalizados, trato directo y soluciones técnicas a medida.
            </p>
            <p className="text-white/80 font-medium text-sm sm:text-base mt-2">
              Arequipa, Perú · Modelado & Impresión 3D · Envíos a todo el Perú
            </p>
          </div>

          <FooterContactInfo />
          <FooterSocials />
          <FooterLinks />
        </div>

        {/* Separador decorativo */}
        <div className="my-6 lg:my-8">
          <div className={cn("h-px bg-white/10")}></div>
        </div>

        {/* Sección inferior - Enlaces legales, Copyright y scroll */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <FooterLegal />

          {/* Copyright y botón scroll */}
          <div className="flex items-center gap-4">
            <p className="text-neutral-300 text-sm sm:text-base text-center">
              © 2026{' '}
              <button 
                onClick={handleSecretClick}
                className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer focus:outline-none focus:underline"
                type="button"
                title="Acceso Admin"
              >
                Ddreams 3D
              </button>
              . Todos los derechos reservados.
            </p>

            <SecretAdminModal 
              isOpen={showSecretModal} 
              onClose={() => setShowSecretModal(false)} 
            />
            
            <ScrollToTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
