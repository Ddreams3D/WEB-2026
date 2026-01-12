import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { IsotypeLogo } from '@/components/ui';
import { ArrowRight, Sparkles, Skull, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { SeasonalAtmosphere } from './SeasonalAtmosphere';
import { HeartbeatLine } from './HeartbeatLine';
import { ChristmasTree3D } from './ChristmasTree3D';
import { HauntedCylinder } from './HauntedCylinder';

interface SeasonalHeroProps {
    config: SeasonalThemeConfig;
    isHalloween: boolean;
    isValentines: boolean;
    isMothersDay: boolean;
    isChristmas: boolean;
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
    isChristmas,
    mounted,
    themeStyles,
    logoColor,
    textEffectTriggered,
    handleExorcise
}: SeasonalHeroProps) {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Determine which images to show
    // If heroImages exists and has items, use it. Otherwise use heroImage (as an array of 1).
    // If neither, fallback to the default unsplash image.
    // Filter out any empty strings to prevent Image component errors.
    const heroImages = (config.landing.heroImages && config.landing.heroImages.length > 0
        ? config.landing.heroImages
        : (config.landing.heroImage ? [config.landing.heroImage] : ["https://images.unsplash.com/photo-1633419461186-7d40a2e50594?q=80&w=2069&auto=format&fit=crop"]))
        .filter(src => src && src.trim() !== "");

    const nextSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    };

    const prevSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    const currentImage = heroImages[currentSlide];

    return (
        <section className={cn(
            "relative min-h-screen supports-[min-height:100dvh]:min-h-[100dvh] flex items-center justify-center overflow-hidden py-12 lg:py-0",
            isHalloween ? "bg-black" : isChristmas ? "bg-gradient-to-b from-[#0f172a] to-[#1e293b]" : "bg-muted/10"
        )}>
            {!isHalloween && (
                <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none text-white">
                        <div className="relative w-full h-[80vh] flex items-center justify-center pointer-events-auto">
                            <button 
                                onClick={() => setIsViewerOpen(false)} 
                                className="absolute -top-12 right-0 z-50 p-2 text-white bg-black/50 rounded-full hover:bg-black/80 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            <div className="relative w-full h-full">
                                <Image
                                    src={currentImage}
                                    alt={config.landing.heroTitle}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {heroImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Dynamic Background */}
            <SeasonalAtmosphere 
                isHalloween={isHalloween}
                isValentines={isValentines}
                isMothersDay={isMothersDay}
                isChristmas={isChristmas}
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
                        (isHalloween || isChristmas) && "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
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
                    
                    <p className={cn("text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed",
                        isChristmas && "text-slate-200"
                    )}>
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
                <div className={cn("relative animate-fade-in-up delay-200 group perspective-1000 flex justify-center", isHalloween && "items-center")}>
                    {isHalloween ? (
                <HauntedCylinder images={heroImages} />
            ) : isChristmas ? (
                <ChristmasTree3D images={heroImages} logoColor={logoColor} />
            ) : (
                <div 
                            className="relative z-10 rounded-3xl overflow-hidden transform transition-transform duration-700 hover:rotate-y-6 hover:scale-[1.02] cursor-pointer shadow-2xl border-4 border-background/50 aspect-[4/5] lg:aspect-square"
                            onClick={() => setIsViewerOpen(true)}
                        >
                            <div className="absolute inset-0 z-10 group-hover:opacity-0 transition-opacity duration-500 bg-gradient-to-t from-black/40 to-transparent" />
                            
                            {/* Hover Overlay for Viewer */}
                            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                                <div className="bg-background/80 text-foreground px-4 py-2 rounded-full flex items-center gap-2 font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <ZoomIn className="w-4 h-4" />
                                    <span>Ver imagen</span>
                                </div>
                            </div>

                            {/* Slider Logic or Single Image */}
                            {heroImages.length > 0 ? (
                                <>
                                    <Image 
                                        src={currentImage} 
                                        alt={config.landing.heroTitle}
                                        fill
                                        className="object-cover w-full h-full"
                                        priority
                                    />
                                    {heroImages.length > 1 && (
                                        <>
                                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); prevSlide(e); }}
                                                    className="p-1 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
                                                >
                                                    <ChevronLeft className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); nextSlide(e); }}
                                                    className="p-1 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
                                                >
                                                    <ChevronRight className="w-6 h-6" />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-30">
                                                {heroImages.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                                                        className={cn(
                                                            "w-2 h-2 rounded-full transition-all",
                                                            currentSlide === idx ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <Image 
                                    src="https://images.unsplash.com/photo-1633419461186-7d40a2e50594?q=80&w=2069&auto=format&fit=crop"
                                    alt={config.landing.heroTitle}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            )}
                        </div>
                    )}
                    
                    {/* Decorative Elements behind image */}
                    <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-40 blur-2xl", themeStyles.previewColors[0])} />
                    <div className={cn("absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-40 blur-2xl", themeStyles.previewColors[1] || themeStyles.previewColors[0])} />

                    {/* Heartbeat Animation for Valentines - Centered on Image */}
                    {isValentines && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] z-20 pointer-events-none opacity-80 mix-blend-screen">
                             <HeartbeatLine color="#e11d48">
                                <div className="w-24 h-24 rounded-full bg-rose-500/20 backdrop-blur-sm border border-rose-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.3)] animate-pulse-scale-1 -mt-8 transition-all duration-500">
                                    <span className="text-rose-200 text-xs font-bold">Foto 1</span>
                                </div>
                                <div className="w-28 h-28 rounded-full bg-rose-500/20 backdrop-blur-sm border border-rose-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.3)] animate-pulse-scale-2 -mt-8 transition-all duration-500">
                                    <span className="text-rose-200 text-xs font-bold">Foto 2</span>
                                </div>
                                <div className="w-24 h-24 rounded-full bg-rose-500/20 backdrop-blur-sm border border-rose-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.3)] animate-pulse-scale-3 -mt-8 transition-all duration-500">
                                    <span className="text-rose-200 text-xs font-bold">Foto 3</span>
                                </div>
                             </HeartbeatLine>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
