'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Phone,
  MapPin,
  Clock,
  Mail,
  ChevronUp,
  Lock,
  X,
  Music2 // Fallback for TikTok if needed, or keep SVG
} from 'lucide-react';
import {
  PHONE_BUSINESS,
  WHATSAPP_REDIRECT,
  PHONE_DISPLAY,
  EMAIL_BUSINESS,
  ADDRESS_BUSINESS,
  SCHEDULE_BUSINESS,
} from '@/shared/constants/contactInfo';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import DefaultImage from '@/shared/components/ui/DefaultImage';

const Footer = () => {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretPassword, setSecretPassword] = useState('');
  const [secretError, setSecretError] = useState('');

  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSecretModal(true);
  };

  const handleSecretLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecretError('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: secretPassword }),
      });

      const data = await response.json();

      if (data.success) {
        // Acceso concedido (la cookie ya fue establecida por el servidor)
        localStorage.setItem('theme_secret_access', 'granted');
        
        // Recargar para aplicar cambios de sesión
        window.location.href = '/admin/configuracion?tab=appearance';
      } else {
        setSecretError('Contraseña incorrecta');
      }
    } catch (error) {
      setSecretError('Error al verificar credenciales');
      console.error(error);
    }
  };

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
    // Footer component with centralized styles
    <footer
      className={cn("bg-black text-white relative overflow-hidden")}
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
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16"
      >
        {/* Sección principal del footer - Estilo elegante y compacto */}
        <div className="space-y-8">
          {/* Logo y descripción - Centrado y elegante */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <DefaultImage
                src="/logo/isotipo_DD_blanco_V2.svg"
                alt="isotipo"
                width={100}
                height={40}
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

          {/* Información de contacto - Centrada */}
          <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
            <a
              href={`${WHATSAPP_REDIRECT}`}
              target="_blank"
              className="text-white/60 hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1"
            >
              <Phone className="w-4 h-4" />
              {PHONE_DISPLAY}
            </a>
            <span className="text-white/40 hidden sm:inline">•</span>
            <a
              href={`mailto:${EMAIL_BUSINESS}`}
              className="text-white/60 hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              {EMAIL_BUSINESS}
            </a>
          </div>

          {/* Dirección y horarios - Horizontal */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-sm sm:text-base">
            <div className="flex items-center gap-1 text-white/60">
              <MapPin className="w-4 h-4" />
              <span>
                {ADDRESS_BUSINESS}
              </span>
            </div>

            <div className="flex items-center gap-1 text-white/60">
              <Clock className="w-4 h-4" />
              <span>{SCHEDULE_BUSINESS}</span>
            </div>
          </div>

          {/* Redes sociales - Centradas */}
          <div className="text-center">
            <p className="text-white/60 text-sm sm:text-base mb-3">
              Síguenos en nuestras redes sociales
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 bg-white/10 hover:bg-white/20 text-white"
              >
                <a
                  href="https://www.facebook.com/ddreams3d"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Síguenos en Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 bg-white/10 hover:bg-white/20 text-white"
              >
                <a
                  href="https://www.instagram.com/ddreams3d/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Síguenos en Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 bg-white/10 hover:bg-white/20 text-white"
              >
                <a
                  href="https://www.tiktok.com/@ddreams3d"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Síguenos en TikTok"
                >
                  <Music2 className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Enlaces rápidos - Debajo de redes sociales */}
          <div className="flex flex-wrap justify-start gap-4 text-sm sm:text-base">
            <Link
              href="/services"
              className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
            >
              Servicios
            </Link>
            <span className="text-white/40 hidden sm:inline">
              •
            </span>
            <Link
              href="/catalogo-impresion-3d"
              className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
            >
              Catálogo
            </Link>
            <span className="text-white/40 hidden sm:inline">
              •
            </span>
            <Link
              href="/process"
              className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
            >
              Proceso
            </Link>
            <span className="text-white/40 hidden sm:inline">
              •
            </span>
            <Link
              href="/about"
              className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
            >
              Nosotros
            </Link>
            <span className="text-white/40 hidden sm:inline">
              •
            </span>
            <Link
              href="/contact"
              className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
            >
              Contacto
            </Link>
          </div>
        </div>

        {/* Separador decorativo */}
        <div className="my-6 lg:my-8">
          <div className={cn("h-px bg-white/10")}></div>
        </div>

        {/* Sección inferior - Enlaces legales, Copyright y scroll */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Enlaces legales */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs sm:text-sm">
            <Link
              href="/terms"
              className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
            >
              Términos de Servicio
            </Link>
            <span className="text-white/40 hidden sm:inline">
              •
            </span>
            <Link
              href="/privacy"
              className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
            >
              Política de Privacidad
            </Link>
            <span className="text-white/40 hidden sm:inline">
              •
            </span>
            <Link
              href="/complaints"
              className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
            >
              Libro de Reclamaciones
            </Link>
          </div>

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

            {/* Secret Admin Modal */}
            {showSecretModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                  <button 
                    onClick={() => setShowSecretModal(false)}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Acceso Administrativo</h3>
                    <p className="text-neutral-400 text-sm mt-2">Ingresa la contraseña maestra para continuar</p>
                  </div>

                  <form onSubmit={handleSecretLogin} className="space-y-4">
                    <div>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="Contraseña del sistema"
                        value={secretPassword}
                        onChange={(e) => setSecretPassword(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 focus:border-primary text-white"
                      />
                      {secretError && (
                        <p className="text-destructive text-xs mt-2">{secretError}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Acceder al Panel
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Botón scroll to top - Rediseñado y reposicionado (esquina inferior) */}
            {showScrollTop && (
              <Button
                onClick={scrollToTop}
                variant="ghost"
                size="icon"
                className="fixed bottom-6 right-6 z-40 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 border border-white/10 hover:-translate-y-1 shadow-lg text-white"
                aria-label="Volver arriba"
              >
                <ChevronUp className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
