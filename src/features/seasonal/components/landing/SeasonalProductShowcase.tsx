import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { CatalogItem } from '@/shared/types/catalog';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';

interface SeasonalProductShowcaseProps {
    config: SeasonalThemeConfig;
    isHalloween: boolean;
    featuredProducts: CatalogItem[];
}

export function SeasonalProductShowcase({
    config,
    isHalloween,
    featuredProducts
}: SeasonalProductShowcaseProps) {
    return (
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
    );
}
