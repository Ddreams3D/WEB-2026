'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  Activity,
  CreditCard,
  ArrowRight,
  Clock,
  Database,
  Cloud,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Import Real Data
import { products } from '@/data/products.data';
import { categories } from '@/data/categories.data';
import { users } from '@/data/users.data';
import { orders } from '@/data/orders.data';
import imageMapping from '@/data/image-mapping.json';

// Calculate Real Stats
const totalProducts = products.length;
const totalCategories = categories.length;
const totalUsers = users.length;
const totalOrders = orders.length;
const totalImages = Object.keys(imageMapping).length;

const stats = [
  { 
    title: 'Productos Totales', 
    value: totalProducts.toString(), 
    change: 'Inventario', 
    trend: 'neutral',
    icon: ShoppingBag,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    gradient: 'from-indigo-500 to-purple-400'
  },
  { 
    title: 'Categorías', 
    value: totalCategories.toString(), 
    change: 'Activas', 
    trend: 'neutral',
    icon: Package,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    gradient: 'from-emerald-500 to-teal-400'
  },
  { 
    title: 'Imágenes en Cloud', 
    value: totalImages.toString(), 
    change: 'Firebase Storage', 
    trend: 'up',
    icon: Cloud,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    gradient: 'from-orange-500 to-amber-400'
  },
  { 
    title: 'Usuarios', 
    value: totalUsers.toString(), 
    change: 'Registrados', 
    trend: 'up',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    gradient: 'from-blue-500 to-cyan-400'
  },
];

// Get latest 5 products as "Recent Activity"
const recentProducts = [...products]
  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  .slice(0, 5)
  .map(p => ({
    id: p.id,
    title: p.name,
    subtitle: `Categoría: ${p.categoryName}`,
    time: 'Disponible',
    icon: <ShoppingBag className="w-4 h-4" />,
    image: p.images?.[0]?.url
  }));

const quickAccess = [
  { name: 'Gestionar Productos', href: '/admin/productos', icon: ShoppingBag, desc: 'Administrar inventario' },
  { name: 'Gestionar Servicios', href: '/admin/servicios', icon: Settings, desc: 'Catálogo de servicios' },
  { name: 'Archivos Cloud', href: '/admin/storage', icon: Cloud, desc: 'Limpieza y gestión de imágenes' },
  { name: 'Ver Pedidos', href: '/admin/pedidos', icon: CreditCard, desc: 'Gestionar ventas' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/90 to-secondary/90 p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Panel de Control Ddreams 3D
            </h1>
            <p className="text-primary-foreground/80 max-w-xl">
              Sistema sincronizado con Firebase Storage.
              <br />
              Gestión centralizada de productos, categorías y recursos.
            </p>
          </div>
          <div className="flex gap-2">
             <Button variant="glass" className="shrink-0" asChild>
                <Link href="/">Ver Tienda</Link>
             </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group bg-card hover:bg-card/80 border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl transition-colors", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn("flex items-center text-xs font-medium px-2 py-1 rounded-full", 
                stat.trend === 'up' ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground bg-muted"
              )}>
                {stat.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area Placeholder (Activity) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Productos Recientes</h2>
              <p className="text-sm text-muted-foreground">Últimos items agregados al catálogo</p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link href="/admin/productos">Ver todos</Link>
            </Button>
          </div>
          
          <div className="space-y-6">
            {recentProducts.length > 0 ? recentProducts.map((item) => (
              <div key={item.id} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground border border-border group-hover:border-primary/50 group-hover:text-primary transition-colors overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    item.icon
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-bold">{item.title}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <div className="text-xs text-emerald-500 pt-1 flex items-center font-medium">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {item.time}
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No hay productos recientes.</p>
            )}
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <h2 className="text-lg font-bold text-foreground mb-4">Accesos Rápidos</h2>
            <div className="space-y-3 mb-auto">
              {quickAccess.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-xl p-4 border border-violet-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-violet-500 rounded-lg">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">Estado del Sistema</h3>
                </div>
                <div className="flex items-center justify-between text-sm mt-3">
                  <span className="text-muted-foreground">App Version</span>
                  <span className="text-foreground font-medium">v1.0.0</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Firebase Storage</span>
                  <span className="text-emerald-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Conectado
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Firestore</span>
                  <span className="text-emerald-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Conectado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon helper
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
