'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampaignsManager from '@/features/admin/components/CampaignsManager';
import LandingMainManager from '@/features/admin/components/LandingMainManager';
import ServiceLandingsManager from '@/features/admin/components/ServiceLandingsManager';
import { Sparkles, LayoutTemplate, CalendarRange, Package, Rocket, Settings, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ContentManagerPage() {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Gestión de Contenido y Marketing</h1>
        <p className="text-muted-foreground">
          Administra la apariencia de la página principal, campañas estacionales y landings de servicios.
        </p>
      </div>

      <Tabs defaultValue="independent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4" />
            Campañas
          </TabsTrigger>
          <TabsTrigger value="landing" className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" />
            Landing Principal
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Landings Servicios
          </TabsTrigger>
          <TabsTrigger value="independent" className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Landings Indep.
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="mb-6 border-b pb-4">
               <h2 className="text-xl font-semibold flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-primary" />
                 Calendario y Temas
               </h2>
               <p className="text-sm text-muted-foreground mt-1">
                 Configura las fechas de activación automática, estilos visuales y la barra de anuncios específica por temporada.
               </p>
            </div>
            <CampaignsManager />
          </div>
        </TabsContent>

        <TabsContent value="landing" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="mb-6 border-b pb-4">
               <h2 className="text-xl font-semibold flex items-center gap-2">
                 <LayoutTemplate className="w-5 h-5 text-primary" />
                 Configuración General
               </h2>
               <p className="text-sm text-muted-foreground mt-1">
                 Edita los textos de la página de inicio y la barra de anuncios de emergencia (Global).
               </p>
            </div>
            <LandingMainManager />
          </div>
        </TabsContent>

        <TabsContent value="services" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
             <ServiceLandingsManager />
          </div>
        </TabsContent>

        <TabsContent value="independent" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            
            {/* CARD 1: Soportes Personalizados */}
            <div className="group flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 h-full">
                {/* Browser Mockup Frame (Link to WEB) */}
                <Link href="/servicios/soportes-personalizados" target="_blank" className="relative w-full aspect-[16/10] overflow-hidden rounded-t-xl bg-muted border-b cursor-pointer hover:opacity-95 transition-opacity">
                    <div className="absolute top-0 left-0 right-0 h-7 bg-muted/90 backdrop-blur-sm border-b flex items-center px-3 gap-1.5 z-20">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                        <div className="ml-2 flex-1 h-4 bg-background/50 rounded text-[9px] flex items-center px-2 text-muted-foreground/60 truncate group-hover:text-primary/80 transition-colors">
                            ddreams3d.com/servicios/soportes-personalizados
                            <ExternalLink className="ml-1 w-2 h-2 inline" />
                        </div>
                    </div>
                    {/* Content Preview */}
                    <div className="absolute top-7 left-0 right-0 bottom-0 bg-background bg-slate-800">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[10px] text-white/80 font-semibold uppercase tracking-wider truncate">
                              Tu escritorio y tu setup, ordenados a tu manera
                            </div>
                            <div className="text-white font-bold text-sm leading-snug line-clamp-2">
                              Soportes Personalizados para tus Dispositivos
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </Link>
                
                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-lg leading-tight line-clamp-1">
                              Soportes Personalizados
                            </h3>
                            <Badge variant="outline" className="text-[10px] px-1.5 h-5 text-muted-foreground">
                                BORRADOR
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          Diseñamos y fabricamos soportes personalizados para celulares, tablets, consolas, cámaras y periféricos.
                        </p>
                    </div>
                    
                    {/* Admin Button */}
                    <div className="mt-auto pt-4">
                        <Button asChild className="w-full gap-2">
                            <Link href="/admin/soportes-personalizados">
                                <Settings className="w-4 h-4" />
                                Gestionar Contenido
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* CARD 2: Landings Personalizadas */}
            <div className="group flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 h-full">
                {/* Browser Mockup Frame (Link to WEB) */}
                <Link href="/servicios/landings-personalizadas" target="_blank" className="relative w-full aspect-[16/10] overflow-hidden rounded-t-xl bg-muted border-b cursor-pointer hover:opacity-95 transition-opacity">
                    <div className="absolute top-0 left-0 right-0 h-7 bg-muted/90 backdrop-blur-sm border-b flex items-center px-3 gap-1.5 z-20">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                        <div className="ml-2 flex-1 h-4 bg-background/50 rounded text-[9px] flex items-center px-2 text-muted-foreground/60 truncate group-hover:text-primary/80 transition-colors">
                            ddreams3d.com/servicios/landings-personalizadas
                            <ExternalLink className="ml-1 w-2 h-2 inline" />
                        </div>
                    </div>
                    {/* Content Preview */}
                    <div className="absolute top-7 left-0 right-0 bottom-0 bg-background bg-indigo-900">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[10px] text-white/80 font-semibold uppercase tracking-wider truncate">
                              Diseño Web Estratégico
                            </div>
                            <div className="text-white font-bold text-sm leading-snug line-clamp-2">
                              Landings que Convierten para tu Negocio
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </Link>
                
                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-lg leading-tight line-clamp-1">
                              Diseño de Landings
                            </h3>
                            <Badge variant="default" className="text-[10px] px-1.5 h-5 bg-green-500">
                                ACTIVA
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          Servicio de diseño y desarrollo de Landing Pages optimizadas para conversión. Rapidez y estética.
                        </p>
                    </div>
                    
                    {/* Admin Button */}
                    <div className="mt-auto pt-4">
                        <Button asChild className="w-full gap-2">
                            <Link href="/admin/landings-personalizadas">
                                <Settings className="w-4 h-4" />
                                Gestionar Contenido
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
