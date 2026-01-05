'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, MainLogo } from '@/components/ui';
import { LandingMainConfig } from '@/shared/types/landing';
import { CatalogItem } from '@/shared/types/catalog';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, Box, Layers, Zap, Truck, Wrench, 
  Cpu, Sparkles, MapPin, ShieldCheck, Clock 
} from 'lucide-react';
import { Printer3DIcon } from '@/components/icons/Printer3DIcon';
import { RealisticBubbles } from './components/RealisticBubbles';
import { cn } from '@/lib/utils';

// --- Components Helpers ---

const BenefitCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <Card className="border-none shadow-none bg-transparent animate-fade-in-up group perspective-1000" style={{ animationDelay: `${delay}ms` }}>
    <CardContent className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-background transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:border-primary/20">
      {/* Bubble Icon Container */}
      <div className="relative w-16 h-16 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110">
        {/* Bubble Glass Body */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_10px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4),inset_0_2px_8px_rgba(255,255,255,0.5)] transition-all duration-500"></div>
        
        {/* Bubble Reflection (Shine) */}
        <div className="absolute top-[15%] left-[15%] w-[25%] h-[15%] rounded-[50%] bg-gradient-to-b from-white/80 to-transparent rotate-45 blur-[0.5px]"></div>
        
        {/* Icon */}
        <Icon className="relative w-7 h-7 text-primary transition-all duration-500 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.6)] z-10" />
      </div>
      <h3 className="font-bold text-lg mb-3 text-foreground transition-colors duration-300 group-hover:text-primary">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed font-medium group-hover:text-foreground/80 transition-colors duration-300">
        {description}
      </p>
    </CardContent>
  </Card>
);

interface LandingMainPageClientProps {
  initialConfig: LandingMainConfig | null;
  featuredProducts: CatalogItem[];
  services: CatalogItem[];
  bubbleImages: string[];
}

export default function LandingMainPageClient({
  initialConfig,
  featuredProducts,
  services,
  bubbleImages
}: LandingMainPageClientProps) {
  // Use props directly or state if we plan to update them (though typically we won't update landing content client-side)
  // We can just use the props.
  // But for hero texts, we might want to keep the defaults logic.

  const heroTitle = initialConfig?.heroTitle || 'Tu imaginación no tiene límites. Nosotros le damos forma.';
  const heroSubtitle = initialConfig?.heroSubtitle || 'Prototipos, piezas y regalos personalizados';
  const heroDescription = initialConfig?.heroDescription || 'Impresión 3D personalizada en Arequipa. Diseñamos y fabricamos piezas únicas a medida.';
  const ctaText = initialConfig?.ctaText || 'Cotiza tu idea';
  const ctaLink = initialConfig?.ctaLink || '/cotizaciones';
  const heroImage = initialConfig?.heroImage;

  // We don't need loading state anymore since data is passed from server


  const benefits = [
    {
      icon: MapPin,
      title: "Local en Arequipa",
      description: "Estamos en Arequipa. Entregas rápidas en todos los distritos y atención personalizada, presencial o virtual."
    },
    {
      icon: Printer3DIcon,
      title: "Tecnología Avanzada",
      description: "Trabajamos con impresoras 3D FDM de alto rendimiento y un flujo optimizado de producción para lograr acabados limpios, precisión y tiempos de entrega confiables."
    },
    {
      icon: Wrench,
      title: "Diseño y Modelado",
      description: "¿No tienes el archivo 3D? No hay problema. Diseñamos tu idea desde cero y la convertimos en un modelo listo para imprimir."
    },
    {
      icon: Clock,
      title: "Rapidez y Garantía",
      description: "Cumplimos los plazos acordados. Si la pieza no cumple nuestros estándares, la reimprimimos sin costo."
    }
  ];

  // Determine theme class override
  const themeClass = initialConfig?.themeMode === 'dark' ? 'dark' : initialConfig?.themeMode === 'light' ? 'light' : '';

  return (
    <div className={cn("min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20", themeClass)}>
      
      {/* 1. HERO SECTION (Full Screen) */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden py-12 lg:py-0 bg-gradient-to-b from-background via-muted/20 to-background">
        
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" 
              style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />

          {/* Realistic Bubbles */}
          <RealisticBubbles productImages={bubbleImages} />
        </div>

        <div className="container mx-auto px-4 relative z-10 flex items-center justify-start h-full">
          
          {/* Brand Logo - Top Right */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <MainLogo variant="white" className="w-32 md:w-48 h-auto" />
          </div>

          {/* Text Content */}
          <div className="text-left flex flex-col justify-center h-full space-y-6 lg:space-y-8 py-8 lg:py-0 animate-fade-in-up max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-primary/20 text-sm font-medium shadow-sm w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 font-bold">
                Impresión 3D en Arequipa
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1]">
              <span className="block text-foreground">
                Tu imaginación
              </span>
              <span className="block text-foreground">
                no tiene límites.
              </span>
              <span className="block mt-1 sm:mt-2 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                Nosotros
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                le damos forma.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Impresión 3D personalizada en Arequipa.
              <br className="hidden sm:inline" />
              Diseñamos y fabricamos piezas únicas
              <br className="hidden sm:inline" />
              a partir de tu idea.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
              <Button size="lg" className="h-14 px-8 text-base font-bold tracking-wide rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105" asChild>
                <a href={ctaLink}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-full border-primary/20 hover:bg-primary/5 transition-colors" asChild>
                <Link href="/catalogo-impresion-3d">
                  Ver ejemplos
                </Link>
              </Button>
            </div>
            
            {/* Quick stats or trust badges */}
            <div className="flex flex-wrap items-center justify-start gap-y-2 gap-x-6 pt-4 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Calidad garantizada</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Atención en Arequipa</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <span>Envíos a todo el Perú</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">¿Por qué elegir Ddreams 3D?</h2>
            <p className="text-muted-foreground text-lg">
              Convertimos tus ideas en objetos reales con tecnología avanzada y atención personalizada en Arequipa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <BenefitCard 
                key={idx}
                {...benefit}
                delay={idx * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Grid) */}
      <section id="coleccion" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Catálogo Destacado</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Impresiones Populares</h2>
            </div>
            <Button variant="ghost" asChild className="group">
              <Link href="/catalogo-impresion-3d">
                Ver todo el catálogo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <ProductGrid products={featuredProducts} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" />
        </div>
      </section>

      {/* 4. SERVICES PREVIEW */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Nuestros Servicios</h2>
            <p className="text-muted-foreground text-lg">
              Soluciones integrales de manufactura aditiva para empresas, estudiantes y hobbistas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.slice(0, 3).map((svc: any) => (
              <ServiceCard key={svc.id} service={svc} />
            ))}
          </div>
           <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/services">Explorar todos los servicios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. LOCAL SOCIAL PROOF (Testimonials) */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">Clientes Felices en Arequipa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="bg-background border-none shadow-lg">
               <CardContent className="p-8">
                 <div className="flex gap-1 mb-4">
                   {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                 </div>
                 <p className="text-muted-foreground mb-6 italic">&quot;Necesitaba un repuesto para mi lavadora que ya no vendían. Me lo diseñaron e imprimieron en 2 días. Quedó perfecto y me ahorré comprar una nueva.&quot;</p>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center font-bold text-white">JP</div>
                   <div>
                     <p className="font-bold text-sm">Juan Pérez</p>
                     <p className="text-xs text-muted-foreground">Yanahuara</p>
                   </div>
                 </div>
               </CardContent>
             </Card>

             <Card className="bg-background border-none shadow-lg md:-translate-y-4">
               <CardContent className="p-8">
                 <div className="flex gap-1 mb-4">
                   {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                 </div>
                 <p className="text-muted-foreground mb-6 italic">&quot;Los llaveros personalizados para mi empresa quedaron increíbles. Muy buena definición y el material se siente súper resistente. 100% recomendados.&quot;</p>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center font-bold text-white">MA</div>
                   <div>
                     <p className="font-bold text-sm">María Alejandra</p>
                     <p className="text-xs text-muted-foreground">Cercado</p>
                   </div>
                 </div>
               </CardContent>
             </Card>

             <Card className="bg-background border-none shadow-lg">
               <CardContent className="p-8">
                 <div className="flex gap-1 mb-4">
                   {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                 </div>
                 <p className="text-muted-foreground mb-6 italic">&quot;Excelente servicio para prototipado de arquitectura. La maqueta salió con un detalle impresionante en resina. Muy profesionales.&quot;</p>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center font-bold text-white">CR</div>
                   <div>
                     <p className="font-bold text-sm">Carlos R.</p>
                     <p className="text-xs text-muted-foreground">Cayma</p>
                   </div>
                 </div>
               </CardContent>
             </Card>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section (Simple & Clean) */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          <div className="space-y-6">
            {[
              { 
                q: "¿Qué tipos de archivos aceptan para impresión 3D?", 
                a: "Aceptamos archivos en formato STL, OBJ y STEP. Los archivos deben estar correctamente modelados y ser imprimibles. Para asegurar la mejor calidad, recomendamos una resolución mínima de 0.1mm. También ofrecemos servicio de optimización de archivos si es necesario." 
              },
              { 
                q: "¿Cuál es el tiempo de entrega promedio?", 
                a: "Los tiempos de entrega varían según la complejidad y tamaño del proyecto. Para piezas simples, el tiempo estimado es de 2-3 días hábiles. Para proyectos más complejos o producción en serie, proporcionamos un cronograma detallado al momento de la cotización. Siempre mantenemos comunicación constante sobre el avance de tu proyecto." 
              },
              { 
                q: "¿Qué materiales utilizan y cuáles son sus características?", 
                a: "Trabajamos con una amplia gama de materiales, cada uno con propiedades específicas:\n- PLA: Ideal para prototipos y modelos decorativos\n- PETG: Excelente resistencia y durabilidad\n- ABS: Perfecto para piezas funcionales y resistentes al calor\n- TPU: Material flexible para aplicaciones especiales\n- Resinas: Alta precisión y acabado superficial superior" 
              },
              { 
                q: "¿Ofrecen servicio de modelado 3D?", 
                a: "Sí, contamos con un equipo especializado en modelado 3D. Podemos crear modelos desde cero basados en tus especificaciones, convertir bocetos o planos en modelos 3D, o modificar archivos existentes para optimizarlos para impresión. Trabajamos con software profesional y garantizamos la calidad del modelado." 
              },
              { 
                q: "¿Cómo se determina el precio de un proyecto?", 
                a: "El precio se calcula considerando varios factores:\n- Volumen y complejidad del modelo\n- Material seleccionado\n- Tiempo de impresión\n- Acabados requeridos\n- Cantidad de unidades\nProporcionamos cotizaciones detalladas y transparentes, sin costos ocultos." 
              },
              { 
                q: "¿Qué garantía ofrecen?", 
                a: "Todos nuestros productos tienen garantía de calidad por 7 días contra defectos de fabricación. Si encuentras algún problema relacionado con la calidad de impresión, ofrecemos reimpresión gratuita o reembolso según el caso. La garantía no cubre daños por mal uso o modificaciones realizadas por el cliente." 
              }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl border bg-card hover:bg-accent/5 transition-colors">
                <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                <p className="text-muted-foreground whitespace-pre-line">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-32 relative overflow-hidden bg-slate-200 text-slate-900">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-200 to-blue-200/50 opacity-100" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">¿Listo para crear algo increíble?</h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium">
            Cotiza tu proyecto hoy mismo y recibe un descuento especial en tu primer pedido online.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full shadow-xl hover:scale-105 transition-transform bg-slate-900 text-white hover:bg-slate-800" asChild>
              <Link href="/cotizaciones">
                Solicitar Cotización Gratis
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-full border-slate-300 text-slate-700 hover:bg-white hover:text-slate-900 transition-colors bg-white/50" asChild>
              <Link href="/contact">
                Contactar por WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (Minimal - Copied from Seasonal) */}
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
    </div>
  );
}
