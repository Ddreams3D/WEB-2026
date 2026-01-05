import React from 'react';
import { cn } from '@/lib/utils';
import { Ghost, Heart } from 'lucide-react';

interface SeasonalTestimonialsProps {
    isHalloween: boolean;
}

export function SeasonalTestimonials({ isHalloween }: SeasonalTestimonialsProps) {
    return (
        <section className={cn(
            "py-32 relative overflow-hidden",
            isHalloween 
              ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f0a05] via-neutral-950 to-[#020617]"
              : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a0505] via-neutral-950 to-[#020617]"
        )}>
            {/* Top Gradient Transition */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />

            {/* Subtle Ambient Light - Reduced intensity */}
            <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[128px] opacity-40",
                isHalloween ? "bg-orange-900/10" : "bg-rose-900/10"
            )} />

            <div className="container mx-auto px-4 relative z-10 text-center">
                
                {/* The Whisper */}
                <p className={cn(
                    "text-lg md:text-xl italic font-serif tracking-widest mb-12",
                    isHalloween ? "text-orange-100/30" : "text-white/30"
                )}>
                    {isHalloween ? "\"Algo extraño sucedió al abrir la caja...\"" : "\"No sabía qué regalarle...\""}
                </p>

                {/* The Divider */}
                <div className={cn(
                    "h-px w-12 mx-auto bg-gradient-to-r from-transparent to-transparent mb-12",
                    isHalloween ? "via-orange-900/30" : "via-rose-900/30"
                )} />

                {/* The Impact */}
                <h2 className="text-3xl md:text-5xl font-light text-white/80 mb-12 tracking-tight leading-snug max-w-4xl mx-auto">
                    {isHalloween ? (
                        <>
                            Los detalles son tan reales que <span className="text-orange-500 font-normal drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">hielan la sangre</span>.
                        </>
                    ) : (
                        <>
                            El regalo más <span className="text-highlight-theme">original</span> que he dado.
                        </>
                    )}
                </h2>

                {/* The Icons - Hearts or Ghosts */}
                <div className="flex justify-center gap-4 mb-8 opacity-80">
                    {[...Array(5)].map((_, i) => (
                        isHalloween ? (
                            <Ghost 
                                key={i} 
                                className="w-5 h-5 text-orange-700 fill-orange-900/50 animate-pulse-slow drop-shadow-[0_0_10px_rgba(249,115,22,0.15)]" 
                                style={{ animationDelay: `${i * 300}ms` }} 
                            />
                        ) : (
                            <Heart 
                                key={i} 
                                className="w-5 h-5 text-rose-800 fill-rose-900 animate-pulse-slow drop-shadow-[0_0_10px_rgba(225,29,72,0.25)]" 
                                style={{ animationDelay: `${i * 150}ms` }} 
                            />
                        )
                    ))}
                </div>

                {/* The Signature */}
                <div className="flex flex-col items-center gap-2">
                     <p className={cn(
                         "text-xs font-medium tracking-[0.25em] uppercase",
                         isHalloween ? "text-orange-800/90" : "text-rose-800/90"
                     )}>
                        {isHalloween ? "Cliente Anónimo" : "Laura M."}
                     </p>
                </div>
            </div>

            {/* Bottom Gradient Transition */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />
        </section>
    );
}
