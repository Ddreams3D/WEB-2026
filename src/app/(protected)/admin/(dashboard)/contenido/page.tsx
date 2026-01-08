'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampaignsManager from '@/features/admin/components/CampaignsManager';
import LandingMainManager from '@/features/admin/components/LandingMainManager';
import ServiceLandingsManager from '@/features/admin/components/ServiceLandingsManager';
import { Sparkles, LayoutTemplate, CalendarRange, Package } from 'lucide-react';

export default function ContentManagerPage() {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Gestión de Contenido y Marketing</h1>
        <p className="text-muted-foreground">
          Administra la apariencia de la página principal, campañas estacionales y landings de servicios.
        </p>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
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
      </Tabs>
    </div>
  );
}
