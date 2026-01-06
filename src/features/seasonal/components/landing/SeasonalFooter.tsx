import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FooterLogo } from '@/components/ui';
import { cn } from '@/lib/utils';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';

interface SeasonalFooterProps {
    config: SeasonalThemeConfig;
    isHalloween: boolean;
}

export function SeasonalFooter({ config, isHalloween }: SeasonalFooterProps) {
    return (
        <footer className="py-24 relative bg-[#020617] text-center">
            {/* Top Gradient Transition */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">
                    {isHalloween ? "¿Te atreves a soñar?" : "¿Listo para sorprender?"}
                </h2>
                
                <div className="flex justify-center mb-12">
                    <Button size="lg" className={cn(
                        "h-12 px-8 text-lg border-0 shadow-lg",
                        isHalloween 
                            ? "bg-orange-700 hover:bg-orange-800 text-white shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)]" 
                            : "bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_20px_-5px_rgba(225,29,72,0.4)]"
                    )} asChild>
                        <Link href="/cotizar">
                            {isHalloween ? "Crear mi Pesadilla" : "Solicitar Diseño Personalizado"}
                        </Link>
                    </Button>
                </div>

                <div className="flex justify-center mb-16 mt-16">
                    <FooterLogo className="w-64 opacity-60 hover:opacity-100 transition-opacity" isHalloween={isHalloween} />
                </div>

                <div className="flex justify-center gap-6 mb-8 text-sm font-medium">
                    {['Instagram', 'TikTok', 'WhatsApp'].map((social) => (
                        <a key={social} href="#" className="text-rose-100/90 hover:text-white transition-colors">
                            {social}
                        </a>
                    ))}
                </div>

                <p className="text-rose-200/50 text-xs">
                    © {new Date().getFullYear()} DDream3D. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}
