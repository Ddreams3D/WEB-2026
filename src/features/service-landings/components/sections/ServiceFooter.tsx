import React from 'react';
import Link from 'next/link';
import { IsotypeLogo } from '@/components/ui';
import { ServiceLandingConfig } from '@/shared/types/service-landing';

interface ServiceFooterProps {
  primaryColor: string;
  config: ServiceLandingConfig;
  isPreview?: boolean;
}

export function ServiceFooter({ primaryColor, config, isPreview = false }: ServiceFooterProps) {
  if (isPreview) return null;

  return (
    <footer className="py-12 bg-background text-center relative overflow-hidden border-t">
      <div className="container mx-auto px-4 relative z-30">
          <div className="flex items-center justify-center mb-8 opacity-100 transition-opacity">
              <IsotypeLogo className="w-24 h-24" primaryColor={primaryColor} />
          </div>
          
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto font-medium">
              Diseñamos emociones, imprimimos recuerdos.
          </p>

          <div className="flex justify-center gap-6 mb-8 text-sm font-medium">
              {['Instagram', 'TikTok', 'WhatsApp'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-muted-foreground hover:text-[color:var(--primary-color)] transition-colors"
                  >
                      {social}
                  </a>
              ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <Link
              href="/services"
              className="flex items-center gap-2 hover:text-[color:var(--primary-color)] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="text-[0.7rem] sm:text-[0.75rem] tracking-[0.08em] uppercase font-medium">
                Ver todos los servicios
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-[color:var(--primary-color)] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="text-[0.7rem] sm:text-[0.75rem] tracking-[0.08em] uppercase font-medium">
                Ir a la web principal
              </span>
            </Link>
          </div>
      </div>
    </footer>
  );
}
