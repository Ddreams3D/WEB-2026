'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Users as UsersIcon, FileText as DocumentTextIcon, Settings as CogIcon, BarChart3 as ChartBarIcon, LogOut as ArrowLeftOnRectangleIcon, ShoppingBag as ShoppingBagIcon, Palette as PaletteIcon, Menu, X } from '@/lib/icons';
import { useAuth } from '@/contexts/AuthContext';
import { getTransitionClasses } from '@/shared/styles/animations';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Usuarios', href: '/admin/usuarios', icon: UsersIcon },
  { name: 'Productos', href: '/admin/productos', icon: ShoppingBagIcon },
  { name: 'Contenido', href: '/admin/contenido', icon: DocumentTextIcon },
  { name: 'Estadísticas', href: '/admin/estadisticas', icon: ChartBarIcon },
  { name: 'Temas', href: '/admin/temas', icon: PaletteIcon },
  { name: 'Configuración', href: '/admin/configuracion', icon: CogIcon },
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-neutral-600 bg-opacity-75" />
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Menú</h2>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">
            <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
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
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                } ${getTransitionClasses('default')}`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-300'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                colors.gradients.primary
              )}>
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">
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
                    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                    } ${getTransitionClasses('default')}`}
                  >
                    <item.icon className={`mr-2 h-4 w-4 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-300'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="flex items-center space-x-4">
               <div className="text-sm text-neutral-500 dark:text-neutral-400">
                 {new Date().toLocaleDateString('es-ES', {
                   weekday: 'long',
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                 })}
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                   <span className="text-primary-700 dark:text-primary-300 font-medium text-xs">
                     {user?.username?.charAt(0).toUpperCase() || 'A'}
                   </span>
                 </div>
                 <Button
                   onClick={handleLogout}
                   variant="ghost"
                   className="flex items-center px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 h-auto"
                 >
                   <ArrowLeftOnRectangleIcon className="mr-1 h-4 w-4 text-neutral-400" />
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