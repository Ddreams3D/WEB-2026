import React from 'react';
import { MainLogo } from '@/components/ui';

export const LandingFooter = () => {
  return (
    <footer className="py-12 bg-[#020617] text-center relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-30">
        <div className="flex items-center justify-center mb-8 opacity-100 transition-opacity">
          <MainLogo variant="white" className="w-[200px] sm:w-[280px] h-auto" />
        </div>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto font-medium">
          Diseñamos emociones, imprimimos futuro en Arequipa.
        </p>
        <div className="flex justify-center gap-6 mb-8 text-sm font-medium">
          <a href="https://www.instagram.com/ddreams3d" className="text-slate-400 hover:text-white transition-colors">Instagram</a>
          <a href="https://www.tiktok.com/@ddreams3d" className="text-slate-400 hover:text-white transition-colors">TikTok</a>
          <a href="https://wa.me/51900000000" className="text-slate-400 hover:text-white transition-colors">WhatsApp</a>
        </div>
        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()} DDream3D. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
