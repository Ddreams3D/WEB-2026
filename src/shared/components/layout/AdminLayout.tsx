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
  X
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
  { name: 'Servicios', href: '/admin/servicios', icon: Package }, // Reusing Package icon or maybe Briefcase if available
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

  return (
    <div className="min-h-screen bg-muted/20">
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
        "fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden border-r border-border",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Menú</h2>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-card shadow-sm border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-primary-foreground"
              )}>
                <span className="font-bold text-sm">A</span>
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                Admin Panel
              </h1>
            </div>
            
            {/* Horizontal Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "mr-2 h-4 w-4",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="flex items-center space-x-4">
               <div className="text-sm text-muted-foreground">
                 {new Date().toLocaleDateString('es-ES', {
                   weekday: 'long',
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                 })}
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                   <span className="text-primary font-medium text-xs">
                     {user?.username?.charAt(0).toUpperCase() || 'A'}
                   </span>
                 </div>
                 <Button
                   onClick={handleLogout}
                   variant="ghost"
                   className="flex items-center px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors duration-200 h-auto"
                 >
                   <LogOut className="mr-1 h-4 w-4 text-muted-foreground" />
                   Salir
                 </Button>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col min-h-screen pt-20">

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
