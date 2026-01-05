import React from 'react';
import { cn } from '@/lib/utils';
import { ValentinesBenefits, MothersDayBenefits, HalloweenBenefits } from '../BenefitCards';
import { CountdownTimer } from '../CountdownTimer';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';

interface SeasonalBenefitsProps {
    config: SeasonalThemeConfig;
    isValentines: boolean;
    isMothersDay: boolean;
    isHalloween: boolean;
    deadline: Date;
}

export function SeasonalBenefits({ 
    config, 
    isValentines, 
    isMothersDay, 
    isHalloween,
    deadline 
}: SeasonalBenefitsProps) {
    return (
        <section className="py-24 relative bg-[#020617]">
             {/* TV Static Overlay for Halloween */}
             {isHalloween && (
                <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] overflow-hidden mix-blend-overlay">
                    <div 
                      className="absolute inset-[-100%] w-[300%] h-[300%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2cpIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')]"
                      style={{ animation: 'noise 8s steps(10) infinite' }}
                    />
                </div>
            )}

            {/* Top Gradient Transition - Absorbs previous section */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-900/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className={cn(
                        "text-2xl md:text-3xl font-light mb-8 tracking-wide transition-colors duration-500",
                        isHalloween 
                            ? "text-orange-100/90 font-serif tracking-widest drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" 
                            : "text-rose-100/80"
                    )}>
                        {isMothersDay ? 'Tiempo restante para el Día de la Madre' : 
                         isValentines ? 'Tiempo restante para San Valentín' : 
                         isHalloween ? 'El Portal se Abre en' :
                         `Tiempo restante para ${config.name}`}
                    </h2>
                    <CountdownTimer 
                        targetDate={deadline} 
                        variant={isHalloween ? 'halloween' : 'default'}
                    />
                </div>
                
                <div className="mt-16">
                    {isValentines ? (
                        <ValentinesBenefits />
                    ) : isMothersDay ? (
                        <MothersDayBenefits />
                    ) : isHalloween ? (
                        <HalloweenBenefits />
                    ) : (
                        /* Generic fallback benefits could go here */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                             {/* Fallback content */}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Gradient Transition - Prepares next section */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />
        </section>
    );
}
