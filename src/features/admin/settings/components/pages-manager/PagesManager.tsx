import React, { useState, useEffect } from 'react';
import { Search, Globe, Shield, User, ShoppingCart, LayoutDashboard, Database, Zap, FileText, RefreshCw } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SERVICE_LANDINGS_DATA } from '@/shared/data/service-landings-data';
import { toast } from 'sonner';

import { RouteItem, RouteType, RouteCategory, RouteStatus, SeoConfig } from './types';
import { SITE_ROUTES, ACTIVE_REDIRECTS } from './data';
import { RouteRow } from './components/RouteRow';
import { RouteStats } from './components/RouteStats';
import { SeoEditSheet } from './components/SeoEditSheet';
import { useSeoRoutes } from './hooks/useSeoRoutes';

// --- HELPER COMPONENT FOR "VISTA GENERAL" (COMPACT) ---
function RouteGroup({ 
  title, 
  icon: Icon, 
  routes, 
  colorClass = "text-primary",
  showCount = true,
  onEdit
}: { 
  title: string, 
  icon: any, 
  routes: RouteItem[], 
  colorClass?: string,
  showCount?: boolean,
  onEdit: (route: RouteItem) => void
}) {
  if (routes.length === 0) return null;

  return (
    <Card className="overflow-hidden border-none shadow-sm mb-6">
      <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
         <div className="flex items-center gap-2">
           <Icon className={`w-4 h-4 ${colorClass}`} />
           <span className="font-semibold text-sm">{title}</span>
         </div>
         {showCount && <Badge variant="secondary" className="bg-background text-muted-foreground">{routes.length}</Badge>}
      </CardHeader>
      <div className="bg-card divide-y">
         {routes.map((route, idx) => <RouteRow key={`${route.path}-${idx}`} route={route} onEdit={onEdit} />)}
      </div>
    </Card>
  );
}

// --- HELPER COMPONENT FOR SPECIFIC TABS (DETAILED PANEL) ---
function CategoryPanel({
  title,
  description,
  icon: Icon,
  routes,
  colorClass = "text-primary",
  searchTerm,
  onEdit
}: {
  title: string,
  description: string,
  icon: any,
  routes: RouteItem[],
  colorClass?: string,
  searchTerm: string,
  onEdit: (route: RouteItem) => void
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/10 border-b pb-6 pt-6 px-6">
           <div className="flex items-start justify-between">
             <div className="space-y-1">
               <div className="flex items-center gap-2 mb-2">
                 <div className={`p-2 rounded-lg bg-background border shadow-sm ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
               </div>
               <p className="text-sm text-muted-foreground max-w-2xl ml-1">{description}</p>
             </div>
             <Badge variant="outline" className="px-3 py-1 text-sm bg-background">
               {routes.length} Páginas
             </Badge>
           </div>
        </CardHeader>
        
        <div className="bg-card">
           {routes.length > 0 ? (
             <div className="divide-y">
                {routes.map((route, idx) => <RouteRow key={`${route.path}-${idx}`} route={route} onEdit={onEdit} />)}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="bg-muted/30 p-4 rounded-full mb-4">
                  {searchTerm ? <Search className="w-8 h-8 text-muted-foreground/50" /> : <FileText className="w-8 h-8 text-muted-foreground/50" />}
                </div>
                <h4 className="text-lg font-medium text-foreground mb-1">
                  {searchTerm ? 'No hay coincidencias' : 'Esta sección está vacía'}
                </h4>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {searchTerm 
                    ? `No se encontraron páginas en "${title}" que coincidan con "${searchTerm}".` 
                    : 'No hay páginas configuradas en esta categoría actualmente.'}
                </p>
             </div>
           )}
        </div>
      </Card>
    </div>
  );
}

export function PagesManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRoute, setEditingRoute] = useState<RouteItem | null>(null);
  
  // Use Custom Hook for Data Logic
  const { routes: allRoutes, isLoading, isSaving, updateSeo, refreshRoutes } = useSeoRoutes();

  const handleSaveSeo = async (path: string, newSeo: any) => {
    const success = await updateSeo(path, newSeo);
    if (success) {
      await refreshRoutes();
      setEditingRoute(null);
    }
  };

  const filteredRoutes = allRoutes.filter(route => 
    searchTerm === '' ||
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    route.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGICAL GROUPING ---
  const storeRoutes = filteredRoutes.filter(r => r.category === 'Tienda' && r.type !== 'Redirect');
  const servicesRoutes = filteredRoutes.filter(r => (r.category === 'Servicios' || r.category === 'Marketing') && r.type !== 'Redirect');
  const institutionalRoutes = filteredRoutes.filter(r => (r.category === 'General' || r.category === 'Legal') && r.type !== 'Redirect');
  const clientRoutes = filteredRoutes.filter(r => r.category === 'Usuario');
  const adminRoutes = filteredRoutes.filter(r => r.category === 'Admin');
  const systemRoutes = filteredRoutes.filter(r => r.category === 'Sistema' || r.type === 'Redirect');


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Top Header & Search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Arquitectura del Sitio</h2>
            <p className="text-muted-foreground">Vista panorámica de todas las páginas organizadas por área de negocio.</p>
          </div>
          <RouteStats totalRoutes={allRoutes.length} totalRedirects={ACTIVE_REDIRECTS.length} />
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
           <Input 
             placeholder="Buscar página por nombre o ruta..." 
             className="pl-9 h-11 text-md bg-card border-muted-foreground/20 shadow-sm"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 h-auto p-1 mb-6 bg-muted/50">
          <TabsTrigger value="all" className="flex gap-2 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:inline">Vista General</span>
            <span className="md:hidden">Todas</span>
          </TabsTrigger>
          
          <TabsTrigger value="store" className="flex gap-2 py-2 data-[state=active]:text-blue-600 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden md:inline">Tienda</span>
          </TabsTrigger>

          <TabsTrigger value="services" className="flex gap-2 py-2 data-[state=active]:text-amber-600 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Zap className="w-4 h-4" />
            <span className="hidden md:inline">Servicios</span>
          </TabsTrigger>

          <TabsTrigger value="institutional" className="flex gap-2 py-2 data-[state=active]:text-green-600 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Globe className="w-4 h-4" />
            <span className="hidden md:inline">Institucional</span>
          </TabsTrigger>

          <TabsTrigger value="client" className="flex gap-2 py-2 data-[state=active]:text-indigo-600 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <User className="w-4 h-4" />
            <span className="hidden md:inline">Clientes</span>
          </TabsTrigger>

          <TabsTrigger value="admin" className="flex gap-2 py-2 data-[state=active]:text-purple-600 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline">Admin</span>
          </TabsTrigger>

          <TabsTrigger value="system" className="flex gap-2 py-2 data-[state=active]:text-slate-600 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Database className="w-4 h-4" />
            <span className="hidden md:inline">Sistema</span>
          </TabsTrigger>
        </TabsList>

        {/* --- TAB CONTENT: ALL (SCROLLABLE OVERVIEW) --- */}
        <TabsContent value="all" className="mt-0">
          <div className="grid gap-4">
            {filteredRoutes.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/5">
                 <div className="bg-muted/30 p-4 rounded-full mb-4">
                   <Search className="w-8 h-8 text-muted-foreground/50" />
                 </div>
                 <h3 className="text-lg font-medium text-foreground mb-1">No se encontraron resultados</h3>
                 <p className="text-muted-foreground">No hay páginas que coincidan con &quot;{searchTerm}&quot; en ninguna categoría.</p>
               </div>
            ) : (
              <>
                <RouteGroup title="Tienda Online & Productos" icon={ShoppingCart} routes={storeRoutes} colorClass="text-blue-600" onEdit={setEditingRoute} />
                <RouteGroup title="Servicios, Landings & Marketing" icon={Zap} routes={servicesRoutes} colorClass="text-amber-600" onEdit={setEditingRoute} />
                <RouteGroup title="Institucional & Legal" icon={Globe} routes={institutionalRoutes} colorClass="text-green-600" onEdit={setEditingRoute} />
                <RouteGroup title="Zona Privada de Clientes" icon={User} routes={clientRoutes} colorClass="text-indigo-600" onEdit={setEditingRoute} />
                <RouteGroup title="Panel de Administración" icon={Shield} routes={adminRoutes} colorClass="text-purple-600" onEdit={setEditingRoute} />
                <RouteGroup title="Sistema, Dev & Redirecciones (301)" icon={Database} routes={systemRoutes} colorClass="text-slate-500" onEdit={setEditingRoute} />
              </>
            )}
          </div>
        </TabsContent>

        {/* --- TAB CONTENT: INDIVIDUAL CATEGORY PANELS --- */}
        
        <TabsContent value="store" className="mt-0">
          <CategoryPanel 
            title="Tienda Online & Productos" 
            description="Gestiona el catálogo de productos, carrito de compras, checkout y páginas relacionadas con la experiencia de compra."
            icon={ShoppingCart} 
            routes={storeRoutes} 
            colorClass="text-blue-600"
            searchTerm={searchTerm}
            onEdit={setEditingRoute}
          />
        </TabsContent>

        <TabsContent value="services" className="mt-0">
          <CategoryPanel 
            title="Servicios, Landings & Marketing" 
            description="Páginas de aterrizaje para campañas, listado de servicios y contenido orientado a conversión."
            icon={Zap} 
            routes={servicesRoutes} 
            colorClass="text-amber-600"
            searchTerm={searchTerm}
            onEdit={setEditingRoute}
          />
        </TabsContent>

        <TabsContent value="institutional" className="mt-0">
          <CategoryPanel 
            title="Institucional & Legal" 
            description="Páginas estáticas de información corporativa, contacto, blog y documentos legales obligatorios."
            icon={Globe} 
            routes={institutionalRoutes} 
            colorClass="text-green-600"
            searchTerm={searchTerm}
            onEdit={setEditingRoute}
          />
        </TabsContent>

        <TabsContent value="client" className="mt-0">
          <CategoryPanel 
            title="Zona Privada de Clientes" 
            description="Área protegida para usuarios registrados, historial de pedidos, perfil y configuraciones de cuenta."
            icon={User} 
            routes={clientRoutes} 
            colorClass="text-indigo-600"
            searchTerm={searchTerm}
            onEdit={setEditingRoute}
          />
        </TabsContent>

        <TabsContent value="admin" className="mt-0">
          <CategoryPanel 
            title="Panel de Administración" 
            description="Herramientas internas para la gestión del sitio, configuración, usuarios y métricas."
            icon={Shield} 
            routes={adminRoutes} 
            colorClass="text-purple-600"
            searchTerm={searchTerm}
            onEdit={setEditingRoute}
          />
        </TabsContent>

        <TabsContent value="system" className="mt-0">
          <CategoryPanel 
            title="Sistema & Redirecciones" 
            description="Configuraciones técnicas, páginas de error (404), utilidades de desarrollo y redirecciones 301 activas."
            icon={Database} 
            routes={systemRoutes} 
            colorClass="text-slate-500"
            searchTerm={searchTerm}
            onEdit={setEditingRoute}
          />
        </TabsContent>

      </Tabs>

      {/* SEO EDIT SHEET */}
      <SeoEditSheet 
        isOpen={!!editingRoute} 
        onClose={() => setEditingRoute(null)} 
        route={editingRoute} 
        onSave={handleSaveSeo}
        isSaving={isSaving}
      />
    </div>
  );
}
