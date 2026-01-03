'use client';

import React, { useEffect, useState } from 'react';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { Button, FooterLogo } from '@/components/ui';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, Gift } from 'lucide-react';
import { ProductService } from '@/services/product.service';
import { CatalogItem } from '@/shared/types/catalog';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { THEME_CONFIG } from '@/config/themes';
import { cn } from '@/lib/utils';
import { ValentinesBenefits } from './BenefitCards';
import { CountdownTimer } from './CountdownTimer';

interface SeasonalLandingProps {
  config: SeasonalThemeConfig;
}

export default function SeasonalLanding({ config }: SeasonalLandingProps) {
  const [featuredProducts, setFeaturedProducts] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Get theme colors from existing config
  const themeStyles = THEME_CONFIG[config.themeId] || THEME_CONFIG.standard;

  // Specific check for Valentine's to enable special features
  const isValentines = config.id === 'valentines';
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Set deadline for Feb 14th of current year (or next if passed)
  const getDeadline = () => {
    const now = new Date();
    let year = now.getFullYear();
    const deadline = new Date(year, 1, 14); // Month is 0-indexed, so 1 is Feb
    if (now > deadline) {
      deadline.setFullYear(year + 1);
    }
    return deadline;
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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" data-theme={config.themeId}>
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen supports-[min-height:100dvh]:min-h-[100dvh] flex items-center justify-center overflow-hidden bg-muted/10 py-12 lg:py-0">
        
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Gradient Orbs - Balanced 50/50 */}
            <div className={cn(
                "absolute -top-[10%] -right-[10%] w-[900px] h-[900px] rounded-full opacity-25 blur-[120px] animate-pulse-slow mix-blend-screen",
                themeStyles.previewColors[0]
            )} />
            <div className={cn(
                "absolute -bottom-[10%] -left-[10%] w-[900px] h-[900px] rounded-full opacity-25 blur-[120px] animate-pulse-slow delay-1000 mix-blend-screen",
                themeStyles.previewColors[1] || themeStyles.previewColors[0]
            )} />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" 
                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />

            {/* Floating Hearts for Valentines - Warm Pink Highlights */}
            {mounted && isValentines && (
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <Heart 
                            key={i} 
                            className={cn(
                                "absolute animate-float",
                                // Warm pink (rose) for tenderness, mixed with base primary
                                i % 2 === 0 ? "text-rose-400/20 fill-rose-400/10" : "text-primary/20 stroke-rose-300/30"
                            )}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${Math.random() * 40 + 15}px`, // Slightly smaller for elegance
                                height: `${Math.random() * 40 + 15}px`,
                                animationDuration: `${Math.random() * 15 + 10}s`, // Slower, more mysterious
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
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
                    <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="bg-gradient-to-r from-primary via-rose-600 to-rose-500 bg-clip-text text-transparent font-bold">
                        {config.landing.heroSubtitle || config.name}
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-foreground">
                    {config.landing.heroTitle.split(' ').map((word, i) => (
                        <span key={i} className="block">{word}</span>
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
        </div>
      </section>

      {/* 2. COUNTDOWN & BENEFITS SECTION */}
      <section className="py-24 relative bg-[#020617]">
        {/* Top Gradient Transition - Absorbs previous section */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-900/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-2xl md:text-3xl font-light text-rose-100/80 mb-8 tracking-wide">Tiempo restante para San Valentín</h2>
                <CountdownTimer targetDate={getDeadline()} />
            </div>
            
            <div className="mt-16">
                {isValentines ? (
                    <ValentinesBenefits />
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
                    <div className="inline-block px-3 py-1 rounded-full bg-rose-900/20 border border-rose-500/20 text-rose-300 text-xs font-bold tracking-[0.2em] uppercase mb-2 shadow-[0_0_10px_-3px_rgba(225,29,72,0.2)]">
                        Colección Limitada
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        {config.landing.featuredTitle || 'Destacados de Temporada'}
                    </h2>
                    <p className="text-lg text-rose-200/60 max-w-xl font-light">
                        Estamos preparando algo especial para sorprender a quien más quieres.
                    </p>
                </div>
                
                <Button variant="ghost" className="group hidden md:flex text-rose-300 hover:text-rose-100 hover:bg-rose-900/20 rounded-full px-6" asChild>
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
                <div className="border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center bg-muted/10">
                    <Sparkles className="w-12 h-12 text-primary/40 mx-auto mb-4" />
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

      {/* 4. SOCIAL PROOF / TESTIMONIALS - GHOST VARIANT */}
      <section className="py-32 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a0505] via-neutral-950 to-[#020617]">
        {/* Top Gradient Transition */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none" />

        {/* Subtle Ambient Light - Reduced intensity */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[128px] opacity-40" />

        <div className="container mx-auto px-4 relative z-10 text-center">
            
            {/* The Whisper - Fainter, more distant */}
            <p className="text-lg md:text-xl text-white/30 italic font-serif tracking-widest mb-12">
                "No sabía qué regalarle..."
            </p>

            {/* The Divider - Barely visible */}
            <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-rose-900/30 to-transparent mb-12" />

            {/* The Impact */}
            <h2 className="text-3xl md:text-5xl font-light text-white/80 mb-12 tracking-tight leading-snug max-w-4xl mx-auto">
                El regalo más <span className="font-serif italic text-rose-800 drop-shadow-[0_0_15px_rgba(225,29,72,0.35)]">original</span> que he dado.
            </h2>

            {/* The Hearts - Darker, subtle glow */}
            <div className="flex justify-center gap-4 mb-8 opacity-80">
                {[...Array(5)].map((_, i) => (
                    <Heart 
                        key={i} 
                        className="w-5 h-5 text-rose-800 fill-rose-900 animate-pulse-slow drop-shadow-[0_0_10px_rgba(225,29,72,0.25)]" 
                        style={{ animationDelay: `${i * 150}ms` }} 
                    />
                ))}
            </div>

            {/* The Signature - Warmer tone */}
            <div className="flex flex-col items-center gap-2">
                 <p className="text-xs font-medium tracking-[0.25em] uppercase text-rose-800/90">Laura M.</p>
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
            <div className="max-w-3xl mx-auto bg-neutral-900/30 backdrop-blur-md border border-rose-500/10 rounded-3xl p-8 md:p-16 shadow-[0_0_50px_-10px_rgba(225,29,72,0.05)] relative overflow-hidden z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-600/30 to-transparent opacity-50" />
                
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">¿Tienes una idea especial?</h2>
                <p className="text-lg text-rose-200/50 mb-10 font-light">
                    Si no existe todavía, lo creamos para ti.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" className="h-12 px-8 text-lg bg-rose-600 hover:bg-rose-700 text-white border-0 shadow-[0_0_20px_-5px_rgba(225,29,72,0.4)]" asChild>
                        <Link href="/cotizar">
                            Solicitar Diseño Personalizado
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 px-8 text-lg hover:bg-rose-500/10 hover:text-rose-200 border-rose-500/20" asChild>
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
