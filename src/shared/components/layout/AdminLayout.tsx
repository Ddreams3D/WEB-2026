'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Settings,
  LogOut,
  ShoppingBag,
  Package,
  Menu,
  X,
  Bell,
  Search,
  Calendar,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Productos', href: '/admin/productos', icon: ShoppingBag },
  { name: 'Servicios', href: '/admin/servicios', icon: Package },
  { name: 'Proyectos', href: '/admin/projects', icon: Briefcase },
  { name: 'Pedidos', href: '/admin/pedidos', icon: Package },
  { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="flex items-center h-16 border-b border-border px-6 bg-muted/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-sm">
            <span className="font-bold text-sm">D</span>
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            Ddreams Admin
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Menu Principal
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border bg-muted/10">
        <div className="flex items-center p-3 rounded-xl bg-background border border-border mb-3 shadow-sm">
           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
             <span className="text-primary font-bold text-sm">
               {user?.username?.charAt(0).toUpperCase() || 'A'}
             </span>
           </div>
           <div className="ml-3 overflow-hidden">
             <p className="text-sm font-medium text-foreground truncate">{user?.username || 'Admin'}</p>
             <p className="text-xs text-muted-foreground truncate">Administrador</p>
           </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/5 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 z-30">
        <SidebarContent />
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col lg:pl-72 min-h-screen transition-all duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border shadow-sm h-16">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Search Bar (Visual only for now) */}
              <div className="hidden md:flex items-center relative max-w-md w-64">
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="w-full pl-9 pr-4 py-1.5 text-sm bg-muted/50 border-none rounded-full focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
               {/* Notifications */}
               <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
               </button>

               <div className="h-6 w-px bg-border hidden sm:block"></div>

               <div className="text-sm font-medium text-muted-foreground hidden sm:block">
                 {new Date().toLocaleDateString('es-ES', {
                   weekday: 'long',
                   day: 'numeric',
                   month: 'long'
                 })}
               </div>
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
