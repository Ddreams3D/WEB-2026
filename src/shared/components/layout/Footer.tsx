'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScrollToTopButton } from './footer/ScrollToTopButton';
import { FooterLegal } from './footer/FooterLegal';
import { 
  ArrowRight, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Music2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IsotypeLogo } from '@/components/ui';
import {
  WHATSAPP_REDIRECT,
  PHONE_DISPLAY,
  EMAIL_BUSINESS,
  ADDRESS_BUSINESS,
  SCHEDULE_BUSINESS,
} from '@/shared/constants/contactInfo';

interface FooterProps {
  services?: Array<{ name: string; slug: string }>;
  campaigns?: Array<{ name: string; id: string }>;
}

const Footer = ({ services = [], campaigns = [] }: FooterProps) => {
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        
        {/* Stack Principal - Flex Column */}
        <div className="flex flex-col gap-12 mb-16">
          
          {/* SECCIÓN 1: Identidad Centrada */}
          <div className="flex flex-col items-center gap-8 text-center max-w-3xl mx-auto">
            <div className="flex justify-center">
              <IsotypeLogo 
                className="w-28 h-auto opacity-90 hover:opacity-100 transition-opacity" 
              />
            </div>
            
            <div className="space-y-4">
              <p className="text-white/70 text-sm leading-relaxed max-w-2xl mx-auto tracking-wide">
                Estudio creativo de impresión y modelado 3D. Proyectos personalizados, trato directo y soluciones técnicas a medida.
              </p>
              <p className="text-white/40 text-xs font-medium tracking-widest uppercase">
                Arequipa, Perú · Modelado & Impresión 3D · Envíos a todo el Perú
              </p>
            </div>
            
            <div className="pt-4">
              <Link 
                href="/impresion-3d-arequipa" 
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-full text-xs font-medium tracking-wide transition-all group border border-white/10 hover:border-white/20 hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400/80" />
                <span>Landing Principal</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform opacity-60" />
              </Link>
            </div>
          </div>

          {/* SECCIÓN 3: Enlaces Dinámicos (Servicios) - Centrado y Sutil */}
           {services.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-4 w-full border-t border-white/5 pt-12">
                <h4 className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-medium shrink-0">
                   Servicios Destacados
                </h4>
                <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-4xl mx-auto">
                    {services.map((service, index) => (
                        <li key={service.slug} className="contents">
                            <Link href={`/servicios/${service.slug}`} className="text-white/50 hover:text-white text-xs transition-colors tracking-wide">
                                {service.name}
                            </Link>
                            {index < services.length - 1 && (
                                <span className="text-white/10 text-[10px]">•</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
           )}
        </div>

        {/* Sección de Contacto Visualmente Fiel al Diseño */}
        <div className="border-t border-white/10 pt-16 mb-12">
           <div className="flex flex-col gap-12 max-w-5xl mx-auto">
              
              {/* Fila 1: Teléfono y Email (Centrado) */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-white/80 text-sm tracking-wide">
                <a
                  href={`${WHATSAPP_REDIRECT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-primary transition-colors group"
                >
                  <Phone className="w-4 h-4 group-hover:text-primary transition-colors text-white/60" />
                  <span>{PHONE_DISPLAY}</span>
                </a>

                <span className="hidden md:block text-white/10">•</span>

                <a
                  href={`mailto:${EMAIL_BUSINESS}`}
                  className="flex items-center gap-3 hover:text-primary transition-colors group"
                >
                  <Mail className="w-4 h-4 group-hover:text-primary transition-colors text-white/60" />
                  <span className="break-all">{EMAIL_BUSINESS}</span>
                </a>
              </div>

              {/* Fila 2: Ubicación (Izq) y Horario (Der) */}
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-white/60 text-xs tracking-wide w-full px-4 md:px-0">
                <div className="flex items-center md:items-start gap-3 text-center md:text-left">
                  <MapPin className="w-4 h-4 -mt-0.5 shrink-0 text-white/40" />
                  <span>{ADDRESS_BUSINESS}</span>
                </div>

                <div className="flex items-center md:items-start gap-3 text-center md:text-right">
                  <Clock className="w-4 h-4 -mt-0.5 shrink-0 text-white/40" />
                  <span>{SCHEDULE_BUSINESS}</span>
                </div>
              </div>

              {/* Fila 3: Redes Sociales (Centrado) */}
              <div className="flex flex-col items-center gap-6 mt-4">
                <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-medium">
                  Síguenos en nuestras redes sociales
                </p>
                <div className="flex gap-4">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:scale-110"
                  >
                    <a href="https://www.facebook.com/ddreams3d" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <Facebook className="w-5 h-5" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:scale-110"
                  >
                    <a href="https://www.instagram.com/ddreams3d/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <Instagram className="w-5 h-5" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:scale-110"
                  >
                    <a href="https://www.tiktok.com/@ddreams3d" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                      <Music2 className="w-5 h-5" />
                    </a>
                  </Button>
                </div>
              </div>

           </div>
        </div>

        {/* SECCIÓN 2: Navegación Horizontal y Temporada */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full py-6 mb-4 gap-8">
            <nav className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold tracking-wide">
              <Link href="/services" className="text-red-500 hover:text-red-400 transition-colors">
                Servicios
              </Link>
              
              <span className="text-white/10 text-xs">•</span>
              
              <Link href="/catalogo-impresion-3d" className="text-white/70 hover:text-white transition-colors">
                Catálogo
              </Link>
              
              <span className="text-white/10 text-xs">•</span>
              
              <Link href="/process" className="text-white/70 hover:text-white transition-colors">
                Proceso
              </Link>
              
              <span className="text-white/10 text-xs">•</span>
              
              <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                Nosotros
              </Link>
              
              <span className="text-white/10 text-xs">•</span>
              
              <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                Contacto
              </Link>
            </nav>

            {/* Campañas Activas (Moved here) */}
            {campaigns.length > 0 && (
                <div className="flex items-center gap-4">
                    <span className="text-white/30 text-[10px] uppercase tracking-widest font-medium hidden md:block">Temporada:</span>
                    <ul className="flex flex-wrap justify-center md:justify-end gap-4">
                        {campaigns.map(campaign => (
                            <li key={campaign.id}>
                                <Link href={`/campanas/${campaign.id}`} className="text-white/80 hover:text-white text-sm transition-colors flex items-center gap-2 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                    {campaign.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        {/* Separador */}
        <div className="mb-8">
          <div className={cn("h-px bg-white/5")}></div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-white/30 tracking-wide font-medium">
          <FooterLegal />

          <div className="flex items-center gap-6">
            <p>
              © 2026 Ddreams 3D
            </p>
            
            <ScrollToTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
