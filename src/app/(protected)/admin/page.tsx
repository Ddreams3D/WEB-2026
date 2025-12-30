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
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Mock Data
const stats = [
  { 
    title: 'Usuarios Totales', 
    value: '1,247', 
    change: '+12%', 
    trend: 'up',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    gradient: 'from-blue-500 to-cyan-400'
  },
  { 
    title: 'Ingresos Mensuales', 
    value: '$45,231.89', 
    change: '+8.2%', 
    trend: 'up',
    icon: CreditCard,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    gradient: 'from-emerald-500 to-teal-400'
  },
  { 
    title: 'Pedidos Activos', 
    value: '45', 
    change: '-3%', 
    trend: 'down',
    icon: Package,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    gradient: 'from-orange-500 to-amber-400'
  },
  { 
    title: 'Productos', 
    value: '156', 
    change: '+24', 
    trend: 'up',
    icon: ShoppingBag,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    gradient: 'from-indigo-500 to-purple-400'
  },
];

const recentActivity = [
  {
    id: 1,
    user: 'Ana García',
    action: 'Realizó un nuevo pedido',
    target: '#ORD-2024-001',
    time: 'Hace 5 min',
    avatar: 'A'
  },
  {
    id: 2,
    user: 'Carlos Ruiz',
    action: 'Se registró como usuario',
    target: '',
    time: 'Hace 12 min',
    avatar: 'C'
  },
  {
    id: 3,
    user: 'Sistema',
    action: 'Actualización de inventario',
    target: 'Producto #45',
    time: 'Hace 1 hora',
    avatar: 'S'
  },
  {
    id: 4,
    user: 'Maria José',
    action: 'Completó el pago',
    target: '#ORD-2023-156',
    time: 'Hace 2 horas',
    avatar: 'M'
  }
];

const quickAccess = [
  { name: 'Gestionar Usuarios', href: '/admin/usuarios', icon: Users, desc: 'Ver y editar usuarios' },
  { name: 'Catálogo Productos', href: '/admin/productos', icon: ShoppingBag, desc: 'Administrar inventario' },
  { name: 'Ver Pedidos', href: '/admin/pedidos', icon: Package, desc: 'Gestionar envíos' },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings, desc: 'Ajustes del sistema' },
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
              Panel de Control
            </h1>
            <p className="text-primary-foreground/80 max-w-xl">
              Bienvenido de nuevo. Aquí tienes un resumen de la actividad reciente y las métricas clave de tu tienda Ddreams 3D.
            </p>
          </div>
          <Button variant="glass" className="shrink-0">
            Descargar Reporte
          </Button>
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
              {stat.trend === 'up' ? (
                <div className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </div>
              ) : (
                <div className="flex items-center text-xs font-medium text-rose-500 bg-rose-500/10 px-2 py-1 rounded-full">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  {stat.change}
                </div>
              )}
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
              <h2 className="text-lg font-bold text-foreground">Actividad Reciente</h2>
              <p className="text-sm text-muted-foreground">Últimos movimientos en la plataforma</p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Ver todo
            </Button>
          </div>
          
          <div className="space-y-6">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground border border-border group-hover:border-primary/50 group-hover:text-primary transition-colors">
                  {item.avatar}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-bold">{item.user}</span> {item.action}
                  </p>
                  {item.target && (
                    <p className="text-xs text-primary font-medium mt-0.5">
                      {item.target}
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground pt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-full">
            <h2 className="text-lg font-bold text-foreground mb-4">Accesos Rápidos</h2>
            <div className="space-y-3">
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
                  <span className="text-muted-foreground">Servidor</span>
                  <span className="text-emerald-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Operativo
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Base de Datos</span>
                  <span className="text-emerald-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Conectada
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