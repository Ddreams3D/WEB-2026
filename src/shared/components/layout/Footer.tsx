'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Phone,
  MapPin,
  Clock,
  Mail,
  ChevronUp,
} from '@/lib/icons';
import { CompanyLogo } from '../ui/DefaultImage';
import {
  getButtonClasses,
  getTransitionClasses,
  getIconClasses,
  getSocialIconClasses,
  getGradientClasses,
  commonStyles,
  responsiveStyles,
} from '../../styles';
import {
  PHONE_BUSINESS,
  WHATSAPP_REDIRECT,
} from '@/shared/constants/infoBusiness';
import Image from 'next/image';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar cuando se ha scrolleado más del 50% de la página
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (window.scrollY / totalHeight) * 100;
      setShowScrollTop(scrollPercentage > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer
      className={`${getGradientClasses(
        'backgroundDark'
      )} text-white dark:text-white relative overflow-hidden`}
    >
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div
        className={`relative z-10 ${responsiveStyles.container['6xl']} ${commonStyles.section}`}
      >
        {/* Sección principal del footer - Estilo elegante y compacto */}
        <div className="space-y-8">
          {/* Logo y descripción - Centrado y elegante */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo/isotipo_DD_negro.svg"
                alt="isotipo"
                width={100}
                height={40}
              />
            </div>
            <p className="text-neutral-300 dark:text-neutral-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Estudio creativo de impresión y modelado 3D. Proyectos
              personalizados, trato directo y soluciones técnicas a medida.
            </p>
          </div>

          {/* Información de contacto - Centrada */}
          <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
            <a
              href={`${WHATSAPP_REDIRECT}`}
              target="_blank"
              className={`text-neutral-400 dark:text-neutral-400 hover:text-primary-400 ${getTransitionClasses(
                'colors'
              )} font-medium flex items-center gap-1`}
            >
              <Phone className={getIconClasses('sm')} />
              +51 901 843 288
            </a>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <a
              href="mailto:dreamings.desings.3d@gmail.com"
              className={`text-neutral-400 dark:text-neutral-400 hover:text-primary-400 ${getTransitionClasses(
                'colors'
              )} font-medium flex items-center gap-1`}
            >
              <Mail className={getIconClasses('sm')} />
              dreamings.desings.3d@gmail.com
            </a>
          </div>

          {/* Dirección y horarios - Horizontal */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-sm sm:text-base">
            <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-400">
              <MapPin className={getIconClasses('sm')} />
              <span>
                Urb. Chapi Chico Mz. A Lt 5, Miraflores, Arequipa, Perú
              </span>
            </div>

            <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-400">
              <Clock className={getIconClasses('sm')} />
              <span>Lun-Vie: 9:00-18:00 | Sáb: 9:00-14:00</span>
            </div>
          </div>

          {/* Redes sociales - Centradas */}
          <div className="text-center">
            <p className="text-neutral-400 dark:text-neutral-400 text-sm sm:text-base mb-3">
              Síguenos en nuestras redes sociales
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.facebook.com/ddreams3d"
                target="_blank"
                rel="noopener noreferrer"
                className={getSocialIconClasses('facebook')}
                aria-label="Síguenos en Facebook"
                style={{ width: '28px', height: '28px' }}
              >
                <Facebook className={getIconClasses('lg', 'white')} style={{ width: '28px', height: '28px' }} />
              </a>
              <a
                href="https://www.instagram.com/ddreams3d/"
                target="_blank"
                rel="noopener noreferrer"
                className={getSocialIconClasses('instagram')}
                aria-label="Síguenos en Instagram"
                style={{ width: '28px', height: '28px' }}
              >
                <Instagram className={getIconClasses('lg', 'white')} style={{ width: '28px', height: '28px' }} />
              </a>
              <a
                href="https://www.tiktok.com/@ddreams3d"
                target="_blank"
                rel="noopener noreferrer"
                className={getSocialIconClasses('twitter')}
                aria-label="Síguenos en TikTok"
                style={{ width: '28px', height: '28px' }}
              >
                <svg
                  className={getIconClasses('lg', 'white')}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: '28px', height: '28px' }}
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Enlaces rápidos - Debajo de redes sociales */}
          <div className="flex flex-wrap justify-start gap-4 text-sm sm:text-base">
            <Link
              href="/services"
              className={`text-neutral-400 dark:text-neutral-400 hover:text-primary-400 ${getTransitionClasses(
                'colors'
              )} font-medium`}
            >
              Servicios
            </Link>
            <span className="text-neutral-600 dark:text-neutral-600 hidden sm:inline">
              •
            </span>
            <Link
              href="/marketplace"
              className={`text-neutral-400 dark:text-neutral-400 hover:text-primary-400 ${getTransitionClasses(
                'colors'
              )} font-medium`}
            >
              Marketplace
            </Link>
            <span className="text-neutral-600 dark:text-neutral-600 hidden sm:inline">
              •
            </span>
            <Link
              href="/process"
              className={`text-neutral-400 dark:text-neutral-400 hover:text-primary-400 ${getTransitionClasses(
                'colors'
              )} font-medium`}
            >
              Proceso
            </Link>
            <span className="text-neutral-600 dark:text-neutral-600 hidden sm:inline">
              •
            </span>
            <Link
              href="/about"
              className={`text-neutral-400 dark:text-neutral-400 hover:text-primary-400 ${getTransitionClasses(
                'colors'
              )} font-medium`}
            >
              Nosotros
            </Link>
            <span className="text-neutral-600 dark:text-neutral-600 hidden sm:inline">
              •
            </span>
            <Link
              href="/contact"
              className={`text-neutral-400 dark:text-neutral-400 hover:text-primary-400 ${getTransitionClasses(
                'colors'
              )} font-medium`}
            >
              Contacto
            </Link>
          </div>
        </div>

        {/* Separador decorativo */}
        <div className="my-6 lg:my-8">
          <div className={`h-px ${getGradientClasses('primary')}`}></div>
        </div>

        {/* Sección inferior - Enlaces legales, Copyright y scroll */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Enlaces legales */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs sm:text-sm">
            <Link
              href="/terms"
              className={`text-neutral-400 dark:text-neutral-400 hover:text-primary-400 ${getTransitionClasses(
                'colors'
              )} font-medium`}
            >
              Términos de Servicio
            </Link>
            <span className="text-neutral-600 dark:text-neutral-600 hidden sm:inline">
              •
            </span>
            <Link
              href="/privacy"
              className={`text-neutral-400 dark:text-neutral-400 hover:text-primary-400 ${getTransitionClasses(
                'colors'
              )} font-medium`}
            >
              Política de Privacidad
            </Link>
            <span className="text-neutral-600 dark:text-neutral-600 hidden sm:inline">
              •
            </span>
            <Link
              href="/complaints"
              className={`text-neutral-400 dark:text-neutral-400 hover:text-primary-400 ${getTransitionClasses(
                'colors'
              )} font-medium`}
            >
              Libro de Reclamaciones
            </Link>
          </div>

          {/* Copyright y botón scroll */}
          <div className="flex items-center gap-4">
            <p className="text-neutral-300 dark:text-neutral-300 text-sm sm:text-base text-center">
              © 2025{' '}
              <span className="font-semibold text-primary-400">Ddreams 3D</span>
              . Todos los derechos reservados.
            </p>

            {/* Botón scroll to top - Rediseñado y reposicionado (esquina inferior) */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-40 p-2.5 bg-neutral-900/60 hover:bg-neutral-900/90 text-white rounded-full shadow-md transition-all duration-300 backdrop-blur-sm border border-white/10 hover:-translate-y-1"
                aria-label="Volver arriba"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
