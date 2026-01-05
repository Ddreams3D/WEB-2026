import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IsotypeLogo } from '@/components/ui';
import { ArrowRight, Sparkles, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { SeasonalAtmosphere } from './SeasonalAtmosphere';

interface SeasonalHeroProps {
    config: SeasonalThemeConfig;
    isHalloween: boolean;
    isValentines: boolean;
    isMothersDay: boolean;
    mounted: boolean;
    themeStyles: any;
    logoColor: string;
    textEffectTriggered: boolean;
    handleExorcise: () => void;
}

export function SeasonalHero({
    config,
    isHalloween,
    isValentines,
    isMothersDay,
    mounted,
    themeStyles,
    logoColor,
    textEffectTriggered,
    handleExorcise
}: SeasonalHeroProps) {
    return (
        <section className={cn(
            "relative min-h-screen supports-[min-height:100dvh]:min-h-[100dvh] flex items-center justify-center overflow-hidden py-12 lg:py-0",
            isHalloween ? "bg-black" : "bg-muted/10"
        )}>
            {/* Dynamic Background */}
            <SeasonalAtmosphere 
                isHalloween={isHalloween}
                isValentines={isValentines}
                isMothersDay={isMothersDay}
                mounted={mounted}
                themeStyles={themeStyles}
                onExorcise={handleExorcise}
            />

            <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Text Content */}
                <div className="text-center lg:text-left flex flex-col justify-center h-full animate-fade-in-up space-y-6 lg:space-y-8 py-8 lg:py-0">
                    {/* Themed Logo for Hero */}
                    <div className="flex justify-center lg:justify-start">
                        <IsotypeLogo 
                            className="w-32 h-12 md:w-40 md:h-16" 
                            primaryColor={logoColor}
                        />
                    </div>

                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-rose-200/20 text-sm font-medium shadow-sm w-fit mx-auto lg:mx-0 group hover:border-rose-400/40 transition-colors">
                        {isHalloween ? (
                            <Skull className="w-4 h-4 text-orange-500 animate-pulse" />
                        ) : (
                            <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
                        )}
                        <span className={cn(
                            "bg-clip-text text-transparent font-bold",
                            isHalloween ? "bg-gradient-to-r from-orange-500 via-red-500 to-orange-600" : "bg-gradient-to-r from-primary via-rose-600 to-rose-500",
                            textEffectTriggered && isHalloween && "animate-scanline"
                        )}>
                            {config.landing.heroSubtitle || config.name}
                        </span>
                    </div>
                    
                    <h1 className={cn(
                        "text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-foreground",
                        isHalloween && "text-white drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]"
                    )}>
                        {config.landing.heroTitle.split(' ').map((word, i) => (
                            <span 
                                key={i} 
                                className={cn(
                                    "block",
                                    isHalloween && "glitch-effect"
                                )}
                                data-text={word}
                            >
                                {word}
                            </span>
                        ))}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        {config.landing.heroDescription}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 pb-4">
                        <Button size="lg" className={cn("h-12 px-8 text-base font-bold tracking-wide rounded-full shadow-lg shadow-primary/25 hover:shadow-rose-500/40 transition-all hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90")} asChild>
                            <Link href="#coleccion">
                                {config.landing.ctaText}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-primary/20 hover:bg-rose-50/10 hover:text-rose-600 hover:border-rose-200/50 transition-colors" asChild>
                            <Link href="/catalogo-impresion-3d">
                                Ver todo el catálogo
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Hero Image / Visual */}
                {!isHalloween && (
                <div className="relative animate-fade-in-up delay-200 group perspective-1000">
                    <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-background/50 transform transition-transform duration-700 hover:rotate-y-6 hover:scale-[1.02]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={config.landing.heroImage} 
                            alt={config.landing.heroTitle}
                            className="w-full h-auto object-cover aspect-[4/5] lg:aspect-square"
                        />
                    </div>
                    
                    {/* Decorative Elements behind image */}
                    <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-40 blur-2xl", themeStyles.previewColors[0])} />
                    <div className={cn("absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-40 blur-2xl", themeStyles.previewColors[1] || themeStyles.previewColors[0])} />
                </div>
                )}
            </div>
        </section>
    );
}
