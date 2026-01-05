import React from 'react';
import { IsotypeLogo } from '@/components/ui';

interface ServiceFooterProps {
  primaryColor: string;
  isPreview?: boolean;
}

export function ServiceFooter({ primaryColor, isPreview = false }: ServiceFooterProps) {
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
                  <a key={social} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {social}
                  </a>
              ))}
          </div>
      </div>
    </footer>
  );
}
