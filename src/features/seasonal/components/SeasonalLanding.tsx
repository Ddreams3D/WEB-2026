'use client';

import React, { useEffect, useState } from 'react';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { Button, FooterLogo } from '@/components/ui';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, Gift, Ghost, Skull, Smile } from 'lucide-react';
import { ProductService } from '@/services/product.service';
import { CatalogItem } from '@/shared/types/catalog';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { THEME_CONFIG } from '@/config/themes';
import { ValentinesBenefits, MothersDayBenefits, HalloweenBenefits } from './BenefitCards';
import { CountdownTimer } from './CountdownTimer';

// Custom Pumpkin Icon (using SVG) - Authentic Jack-o'-lantern with Zigzag Smile
const Pumpkin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Stem - Adjusted for wider body */}
    <path d="M12 4c0-2-1-3-3-3" />
    
    {/* Pumpkin Body - Wide & Oblong (Radio X=11, Y=8) */}
    <path d="M23 12c0 4.5-5 8-11 8s-11-3.5-11-8 5-8 11-8 11 3.5 11 8z" />
    
    {/* Ribs - Adjusted for wider shape */}
    <path d="M12 4v16" className="opacity-30" />
    <path d="M19 5c1 2 2 4 2 7s-1 5-2 7" className="opacity-30" />
    <path d="M5 5c-1 2-2 4-2 7s1 5 2 7" className="opacity-30" />

    {/* Triangular Eyes - Wider apart */}
    <path d="M7 11l-1.5 2h3z" fill="currentColor" className="opacity-80" />
    <path d="M17 11l-1.5 2h3z" fill="currentColor" className="opacity-80" />
    
    {/* Zigzag Mouth - Wider smile */}
    <path d="M6 16l1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5" />
  </svg>
);

// Interactive Floating Icon Component
interface FloatingIconProps {
    Icon: any;
    isHalloween: boolean;
    index: number;
    onExorcise?: () => void;
}

const InteractiveFloatingIcon = ({ Icon, isHalloween, index, onExorcise }: FloatingIconProps) => {
    const [vanished, setVanished] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 }); 
    
    // VARIANT SELECTION (Fixed on mount to avoid hydration mismatch)
    const variantRef = React.useRef<'a' | 'b' | 'c'>('a');
    // EASTER EGG: 1 in ~33 chance (3%) to be Immortal (Retreat & Reappear) - True rarity
    const isImmortalRef = React.useRef(false);
    // Track mount status to prevent memory leaks on unmount
    const isMountedRef = React.useRef(true);

    useEffect(() => {
        return () => { isMountedRef.current = false; };
    }, []);

    useEffect(() => {
        // Randomly assign variant and immortality only on client
        const variants: ('a' | 'b' | 'c')[] = ['a', 'b', 'c'];
        variantRef.current = variants[Math.floor(Math.random() * variants.length)];
        isImmortalRef.current = Math.random() < 0.03; 

        setStyle({
            // Constrain positioning to 10-90% to avoid edge clipping (Design Purist)
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            width: isHalloween ? `${Math.random() * 60 + 40}px` : `${Math.random() * 40 + 20}px`,
            height: isHalloween ? `${Math.random() * 60 + 40}px` : `${Math.random() * 40 + 20}px`,
            animationDuration: isHalloween ? `${Math.random() * 10 + 20}s` : `${Math.random() * 15 + 10}s`,
            animationDelay: `-${Math.random() * 20}s`,
            opacity: 1 
        });
    }, [isHalloween]);

    const handleInteraction = () => {
        // COOLDOWN CHECK
        if (vanished || isAnimating) return;
        
        setIsAnimating(true);
        setVanished(true);
        
        // TRIGGER TEXT FEEDBACK
        if (onExorcise) onExorcise();

        // EASTER EGG LOGIC: If Immortal, reappear elsewhere
        if (isHalloween && isImmortalRef.current) {
            setTimeout(() => {
                if (!isMountedRef.current) return; // Prevent leak if unmounted
                
                // Reset position after retreat animation (1s)
                setStyle(prev => ({
                    ...prev,
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    // Slight change in size to mask the reset
                    width: `${Math.random() * 60 + 40}px`,
                }));
                setVanished(false);
                setIsAnimating(false);
            }, 1200); // Wait slightly longer than animation (1s)
        }
    };

    // Determine animation class based on variant
    const getAnimationClass = () => {
        if (!isHalloween) return "transition-all duration-700 ease-out transform opacity-0 scale-150 blur-[50px] pointer-events-none";
        
        if (isImmortalRef.current) return "animate-retreat"; // Special retreat animation
        
        switch (variantRef.current) {
            case 'b': return "animate-resist-b";
            case 'c': return "animate-resist-c";
            default: return "animate-resist-a";
        }
    };

    return (
        <div 
            className="absolute z-10" 
            style={style}
        >
             <div 
                className={cn(
                    vanished 
                        ? getAnimationClass()
                        : "transition-all duration-700 ease-out transform opacity-100 scale-100"
                )}
             >
                <div 
                    className={cn(
                        "pointer-events-auto cursor-crosshair p-24 -m-24 rounded-full", 
                        isHalloween ? "animate-ghost-wander" : "animate-float"
                    )}
                    onMouseEnter={handleInteraction}
                    onTouchStart={handleInteraction}
                >
                    <Icon 
                        strokeWidth={1.5}
                        className={cn(
                            "w-full h-full drop-shadow-[0_0_15px_rgba(255,100,0,0.2)]",
                            isHalloween
                                ? cn(
                                    index % 3 === 0 ? "text-orange-500/20 fill-orange-500/5" : 
                                    index % 3 === 1 ? "text-white/20 fill-white/5" :           
                                    "text-red-500/20 fill-red-500/5"                        
                                  ) 
                                : cn(
                                    (index % 2 === 0 ? "text-rose-400/20 fill-rose-400/10" : "text-primary/20 stroke-rose-300/30")
                                )
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

// Spooky Eyes Component (Simple blinking red eyes)
const SpookyEyes = () => {
    const [style, setStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        // Random positioning and delay
        setStyle({
            top: `${20 + Math.random() * 60}%`, 
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `scale(${0.8 + Math.random() * 0.5})`,
            opacity: 0.8
        });
    }, []);

    return (
         <div 
            className="absolute animate-blink pointer-events-none p-4"
            style={style}
         >
             <div className="flex gap-3">
                 {/* Left Eye */}
                 <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600 shadow-[0_0_15px_rgba(255,0,0,1)] animate-pulse" />
                 {/* Right Eye */}
                 <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600 shadow-[0_0_15px_rgba(255,0,0,1)] animate-pulse" />
             </div>
         </div>
    );
};

interface SeasonalLandingProps {
  config: SeasonalThemeConfig;
}

export default function SeasonalLanding({ config }: SeasonalLandingProps) {
  const [featuredProducts, setFeaturedProducts] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [textEffectTriggered, setTextEffectTriggered] = useState(false);
  const hasTriggeredRef = React.useRef(false);

  // Get theme colors from existing config
  const themeStyles = THEME_CONFIG[config.themeId] || THEME_CONFIG.standard;

  // Specific check for Valentine's to enable special features
  const isValentines = config.id === 'san-valentin' || config.id === 'valentines'; // Handle both for safety
  const isMothersDay = config.id === 'dia-de-la-madre' || config.id === 'mothers-day';
  const isHalloween = config.id === 'halloween';
  
  // TRIGGER TEXT SCANLINE EFFECT
  const handleExorcise = () => {
    if (hasTriggeredRef.current) return;
    
    hasTriggeredRef.current = true;
    setTextEffectTriggered(true);
    
    // Remove class after animation finishes
    setTimeout(() => {
        setTextEffectTriggered(false);
    }, 500);
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Set deadline based on theme
  const getDeadline = () => {
    const now = new Date();
    let year = now.getFullYear();
    
    if (isValentines) {
      const deadline = new Date(year, 1, 14); // Feb 14
      if (now > deadline) deadline.setFullYear(year + 1);
      return deadline;
    }
    
    if (isMothersDay) {
      // Mother's Day: 2nd Sunday of May
      // Month is 4 (May is 5th month, index 4)
      const getMothersDay = (y: number) => {
        const d = new Date(y, 4, 1);
        // Find first Sunday
        while (d.getDay() !== 0) {
          d.setDate(d.getDate() + 1);
        }
        // Add 7 days to get 2nd Sunday
        d.setDate(d.getDate() + 7);
        // Set end of day
        d.setHours(23, 59, 59, 999);
        return d;
      };

      let deadline = getMothersDay(year);
      if (now > deadline) {
        deadline = getMothersDay(year + 1);
      }
      return deadline;
    }

    if (isHalloween) {
      const deadline = new Date(year, 9, 1); // Oct 1st (Start of Campaign)
      if (now > deadline) deadline.setFullYear(year + 1);
      return deadline;
    }

    // Default: end of the first date range or end of year
    if (config.dateRanges && config.dateRanges.length > 0) {
      const range = config.dateRanges[0];
      const deadline = new Date(year, range.end.month - 1, range.end.day);
      if (now > deadline) deadline.setFullYear(year + 1);
      return deadline;
    }
    
    return new Date(year, 11, 31); // Fallback to NYE
  };

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const all = await ProductService.getAllProducts();
        
        // Filter by the seasonal tag (case insensitive)
        const tag = config.landing.featuredTag.toLowerCase();
        const filtered = all.filter(p => 
          p.tags.some(t => t.toLowerCase() === tag)
        );
        
        setFeaturedProducts(filtered);
      } catch (error) {
        console.error('Error loading seasonal products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [config.landing.featuredTag]);

  // Determine theme class override
  const themeClass = config.landing.themeMode === 'dark' ? 'dark' : config.landing.themeMode === 'light' ? 'light' : '';

  return (
    <div className={cn("min-h-screen bg-background overflow-x-hidden text-foreground", themeClass)} data-theme={config.themeId}>
      {/* Background with Theme Colors */}
      <div className={cn("fixed inset-0 pointer-events-none transition-colors duration-700", themeStyles.previewColors[0], "opacity-[0.03] dark:opacity-[0.05]")} />
      
      {/* 1. HERO SECTION */}
      <section className={cn(
          "relative min-h-screen supports-[min-height:100dvh]:min-h-[100dvh] flex items-center justify-center overflow-hidden py-12 lg:py-0",
          isHalloween ? "bg-black" : "bg-muted/10"
      )}>
        
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Halloween Atmosphere: Fog & Eyes */}
            {isHalloween && (
                <>
                    {/* Low Fog - Made more visible with brighter color */}
                    <div className="absolute bottom-0 left-0 w-[200%] h-[500px] bg-gradient-to-t from-orange-500/10 via-orange-900/5 to-transparent animate-fog z-0 pointer-events-none blur-3xl" />
                    
                    {/* Watching Eyes (Randomly placed with JS for variety) */}
                    {mounted && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                         {[...Array(2)].map((_, i) => (
                             <SpookyEyes key={i} />
                         ))}
                    </div>
                    )}
                </>
            )}

            {/* Gradient Orbs - Balanced 50/50 - Hidden for Halloween */}
            {!isHalloween && (
            <>
            <div className={cn(
                "absolute rounded-full opacity-25 animate-pulse-slow mix-blend-screen",
                // Default size/pos/blur
                "w-[900px] h-[900px] -top-[10%] -right-[10%] blur-[120px]",
                // Valentines/Mothers Day: Responsive sizing to prevent touching on small screens
                // Mobile: 300px, Tablet: 500px, Desktop: 800px
                (isValentines || isMothersDay) && "w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[800px] lg:h-[800px] -top-[5%] -right-[5%] blur-[60px] md:blur-[75px] lg:blur-[90px]",
                themeStyles.previewColors[0]
            )} />
            <div className={cn(
                "absolute rounded-full opacity-25 mix-blend-screen",
                "animate-pulse-slow delay-1000",
                // Default size/pos/blur
                "w-[900px] h-[900px] -bottom-[10%] -left-[10%] blur-[120px]",
                // Valentines/Mothers Day: Responsive sizing
                (isValentines || isMothersDay) && "w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[800px] lg:h-[800px] -bottom-[5%] -left-[5%] blur-[60px] md:blur-[75px] lg:blur-[90px]",
                themeStyles.previewColors[1] || themeStyles.previewColors[0]
            )} />
            </>
            )}
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" 
                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />

            {/* Floating Hearts/Ghosts */}
            {mounted && (isValentines || isMothersDay || isHalloween) && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {[...Array(isHalloween ? 20 : 8)].map((_, i) => {
                        // Halloween Icon Mix
                        const halloweenIcons = [Ghost, Skull, Pumpkin];
                        const Icon = isHalloween ? halloweenIcons[i % halloweenIcons.length] : Heart;
                        
                        return (
                            <InteractiveFloatingIcon 
                                key={i}
                                Icon={Icon}
                                isHalloween={isHalloween}
                                index={i}
                            />
                        );
                    })}
                </div>
            )}
        </div>

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="text-center lg:text-left flex flex-col justify-center h-full animate-fade-in-up space-y-6 lg:space-y-8 py-8 lg:py-0">
                {/* Themed Logo for Hero */}
                <div className="flex justify-center lg:justify-start">
                    <div 
                        className="w-32 h-12 md:w-40 md:h-16 bg-primary transition-colors duration-300"
                        style={{
                            maskImage: 'url(/logo/isotipo_DD_spaced.svg)',
                            maskRepeat: 'no-repeat',
                            maskSize: 'contain',
                            maskPosition: 'center',
                            WebkitMaskImage: 'url(/logo/isotipo_DD_spaced.svg)',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskSize: 'contain',
                            WebkitMaskPosition: 'center'
                        }}
                        aria-label="Ddreams 3D Logo"
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

      {/* 2. COUNTDOWN & BENEFITS SECTION */}
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
                    targetDate={getDeadline()} 
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

      {/* 3. PRODUCT SHOWCASE SECTION */}
      <section id="coleccion" className="py-32 relative bg-[#020617]">
        {/* Top Gradient Transition */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                <div className="space-y-4">
                    <div className={cn(
                        "inline-block px-3 py-1 rounded-full border text-xs font-bold tracking-[0.2em] uppercase mb-2 shadow-[0_0_10px_-3px_rgba(0,0,0,0.2)]",
                        isHalloween 
                            ? "bg-orange-900/20 border-orange-500/20 text-orange-300 shadow-orange-500/20" 
                            : "bg-rose-900/20 border-rose-500/20 text-rose-300 shadow-rose-500/20"
                    )}>
                        Colección Limitada
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        {config.landing.featuredTitle || 'Destacados de Temporada'}
                    </h2>
                    <p className={cn(
                        "text-lg max-w-xl font-light",
                        isHalloween ? "text-orange-200/60" : "text-rose-200/60"
                    )}>
                        {isHalloween 
                            ? "Artefactos malditos diseñados para poseer tu espacio."
                            : "Estamos preparando algo especial para sorprender a quien más quieres."
                        }
                    </p>
                </div>
                
                <Button variant="ghost" className={cn(
                    "group hidden md:flex rounded-full px-6",
                    isHalloween 
                        ? "text-orange-300 hover:text-orange-100 hover:bg-orange-900/20" 
                        : "text-rose-300 hover:text-rose-100 hover:bg-rose-900/20"
                )} asChild>
                    <Link href={`/catalogo-impresion-3d?q=${config.landing.featuredTag}`}>
                        Ver colección completa
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>

            {featuredProducts.length > 0 ? (
                 <ProductGrid 
                    products={featuredProducts}
                    emptyMessage="Pronto agregaremos productos a esta colección."
                    className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 relative z-10"
                />
            ) : (
                /* Placeholder state designed to look good even empty */
                <div className={cn(
                    "border-2 border-dashed rounded-3xl p-12 text-center bg-muted/10",
                    isHalloween ? "border-orange-500/20" : "border-primary/20"
                )}>
                    <Sparkles className={cn("w-12 h-12 mx-auto mb-4", isHalloween ? "text-orange-500/40" : "text-primary/40")} />
                    <h3 className="text-xl font-semibold mb-2">Preparando la Colección</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Estamos curando los mejores productos para {config.name}. 
                        ¡Vuelve pronto para ver las novedades!
                    </p>
                    <Button variant="outline">Notificarme cuando esté lista</Button>
                </div>
            )}
            
            <div className="mt-12 text-center md:hidden">
                <Button variant="outline" className="w-full" asChild>
                    <Link href={`/catalogo-impresion-3d?q=${config.landing.featuredTag}`}>
                        Ver colección completa
                    </Link>
                </Button>
            </div>
        </div>

        {/* Bottom Gradient Transition */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />
      </section>

      {/* 4. SOCIAL PROOF / TESTIMONIALS - THEMED VARIANT */}
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

      {/* 5. FINAL CTA */}
      <section className="py-24 relative bg-[#020617] text-center">
        {/* Top Gradient Transition */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
            <div className={cn(
                "max-w-3xl mx-auto backdrop-blur-md border rounded-3xl p-8 md:p-16 relative overflow-hidden z-10",
                isHalloween 
                    ? "bg-neutral-900/30 border-orange-500/10 shadow-[0_0_50px_-10px_rgba(249,115,22,0.05)]"
                    : "bg-neutral-900/30 border-rose-500/10 shadow-[0_0_50px_-10px_rgba(225,29,72,0.05)]"
            )}>
                <div className={cn(
                    "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-50",
                    isHalloween ? "via-orange-600/30" : "via-rose-600/30"
                )} />
                
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                    {isHalloween ? "¿Te atreves a invocarlo?" : "¿Tienes una idea especial?"}
                </h2>
                <p className={cn(
                    "text-lg mb-10 font-light",
                    isHalloween ? "text-orange-200/50" : "text-rose-200/50"
                )}>
                    {isHalloween 
                        ? "Materializamos tus pesadillas más creativas antes de que amanezca."
                        : "Si no existe todavía, lo creamos para ti."
                    }
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
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
                    <Button variant="outline" size="lg" className={cn(
                        "h-12 px-8 text-lg",
                        isHalloween 
                            ? "hover:bg-orange-500/10 hover:text-orange-200 border-orange-500/20" 
                            : "hover:bg-rose-500/10 hover:text-rose-200 border-rose-500/20"
                    )} asChild>
                        <Link href="/contacto">
                            Hablar con un asesor
                        </Link>
                    </Button>
                </div>
            </div>
        </div>

        {/* Bottom Gradient Transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />
      </section>

      {/* 6. MINIMAL FOOTER */}
      <footer className="py-12 bg-[#020617] text-center relative overflow-hidden">
        
        <div className="container mx-auto px-4 relative z-30">
            <div className="flex items-center justify-center mb-8 opacity-100 transition-opacity">
                <FooterLogo className="w-[200px] sm:w-[280px] h-auto" />
            </div>
            
            <p className="text-rose-100/70 text-sm mb-6 max-w-md mx-auto font-medium">
                Diseñamos emociones, imprimimos recuerdos.
            </p>

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
    </div>
  );
}
