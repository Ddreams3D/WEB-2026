'use client';

import React, { useState, createContext, useContext, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Settings,
  ShoppingBag,
  Package,
  Menu,
  Sparkles,
  DollarSign,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Wallet,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Contexto para controlar el layout desde los hijos
interface AdminLayoutContextType {
  isFullscreen: boolean;
  setFullscreen: (value: boolean) => void;
  toggleFullscreen: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType>({
  isFullscreen: false,
  setFullscreen: () => {},
  toggleFullscreen: () => {},
});

export const useAdminLayout = () => useContext(AdminLayoutContext);

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Catálogo', href: '/admin/productos', icon: ShoppingBag },
  { name: 'Servicios', href: '/admin/servicios', icon: Package },
  { name: 'Destacados', href: '/admin/projects', icon: Briefcase },
  { name: 'Marketing & Contenido', href: '/admin/contenido', icon: Sparkles },
  { name: 'Apariencia Global', href: '/admin/temas', icon: Palette },
  { name: 'Finanzas Ddreams 3D', href: '/admin/finanzas', icon: DollarSign },
  { name: 'Finanzas Personales', href: '/admin/finanzas-personales', icon: Wallet },
  { name: 'Gestión', href: '/admin/gestion', icon: Users },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
];

import dynamic from 'next/dynamic';
import { QuickAccessBar } from '@/features/admin/components/QuickAccessBar';
import { IgnitionButton } from '@/features/admin/components/IgnitionButton';
import { AdminDebugInfo } from '@/features/admin/components/AdminDebugInfo';
const NotificationsDropdown = dynamic(() => import('@/features/admin/components/NotificationsDropdown').then(m => m.NotificationsDropdown), { ssr: false });
const RealtimeClock = dynamic(() => import('@/features/admin/components/RealtimeClock').then(m => m.RealtimeClock), { ssr: false });
const ConnectionStatus = dynamic(() => import('@/features/admin/components/ConnectionStatus'), { ssr: false });

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adminDarkMode, setAdminDarkMode] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('adminDarkMode');
      if (stored !== null) {
        setAdminDarkMode(JSON.parse(stored));
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('adminDarkMode', JSON.stringify(adminDarkMode));
    } catch {
    }
  }, [adminDarkMode]);

  // Determine if we should show the connection status badge
  const showConnectionStatus = 
    pathname.includes('/admin/servicios') || 
    pathname.includes('/admin/projects') || 
    pathname.includes('/admin/productos') ||
    pathname.includes('/admin/catalogo');

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    // En móvil nunca está colapsado visualmente
    const isCollapsed = !isMobile && collapsed;

    return (
      <div className="flex flex-col h-full bg-card border-r border-border transition-all duration-300">
        {/* Header del Sidebar */}
        <div className={cn(
          "flex items-center h-16 border-b border-border transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "px-6 justify-between"
        )}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-sm">
              <span className="font-bold text-sm">D</span>
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold text-foreground tracking-tight whitespace-nowrap animate-in fade-in duration-300">
                Ddreams Admin
              </span>
            )}
          </div>
          
          {/* Botón de colapso (Solo Desktop) */}
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-6 w-6 hidden lg:flex ml-2", isCollapsed && "absolute -right-3 top-6 z-50 bg-background border border-border shadow-sm rounded-full w-6 h-6 p-0 hover:bg-muted")}
              onClick={() => setCollapsed(!collapsed)}
            >
              {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          )}
        </div>

        {/* Lista de Navegación */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-1">
          {!isCollapsed && (
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 animate-in fade-in">
              Menu Principal
            </p>
          )}
          
          <TooltipProvider>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              
              const LinkContent = (
                <Link
                  href={item.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isCollapsed ? "justify-center" : ""
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                    !isCollapsed && "mr-3"
                  )} />
                  {!isCollapsed && (
                    <span className="relative z-10 whitespace-nowrap animate-in fade-in">{item.name}</span>
                  )}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.name} delayDuration={0}>
                    <TooltipTrigger asChild>
                      {LinkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.name}>{LinkContent}</div>;
            })}
          </TooltipProvider>
        </div>

        {/* Footer del Sidebar (Usuario) */}
        <div className="p-3 border-t border-border bg-muted/10">
          <div className={cn(
            "flex items-center p-2 rounded-xl bg-background border border-border mb-3 shadow-sm transition-all",
            isCollapsed ? "justify-center" : ""
          )}>
             <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
               <span className="text-primary font-bold text-sm">
                 {user?.username?.charAt(0).toUpperCase() || 'A'}
               </span>
             </div>
             {!isCollapsed && (
               <div className="ml-3 overflow-hidden animate-in fade-in">
                 <p className="text-sm font-medium text-foreground truncate max-w-[120px]">{user?.username || 'Admin'}</p>
                 <p className="text-xs text-muted-foreground truncate">Administrador</p>
               </div>
             )}
          </div>
          
          <TooltipProvider>
            {isCollapsed ? (
               <Tooltip delayDuration={0}>
                 <TooltipTrigger>
                    <Link href="/">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-full h-9 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </Link>
                 </TooltipTrigger>
                 <TooltipContent side="right">Volver al Inicio</TooltipContent>
               </Tooltip>
            ) : (
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Volver al Inicio
                </Button>
              </Link>
            )}
          </TooltipProvider>
        </div>
      </div>
    );
  };

  return (
    <AdminLayoutContext.Provider value={{ isFullscreen, setFullscreen: setIsFullscreen, toggleFullscreen }}>
      <div
        className="min-h-screen flex bg-background text-foreground"
        style={adminDarkMode ? {
          // Dark admin palette (inspirado en landing "trophies")
          // Fondos
          ['--background' as any]: '222.2 84% 4.9%',
          ['--card' as any]: '222.2 84% 4.9%',
          ['--popover' as any]: '222.2 84% 4.9%',
          // Textos
          ['--foreground' as any]: '210 40% 98%',
          ['--card-foreground' as any]: '210 40% 98%',
          ['--popover-foreground' as any]: '210 40% 98%',
          // Elementos secundarios / muted
          ['--secondary' as any]: '217.2 32.6% 17.5%',
          ['--secondary-foreground' as any]: '210 40% 98%',
          ['--muted' as any]: '217.2 32.6% 17.5%',
          ['--muted-foreground' as any]: '215 20.2% 65.1%',
          ['--accent' as any]: '217.2 32.6% 17.5%',
          ['--accent-foreground' as any]: '210 40% 98%',
          // Bordes / inputs
          ['--border' as any]: '217.2 32.6% 17.5%',
          ['--input' as any]: '217.2 32.6% 17.5%',
        } : undefined}
      >
        {/* Mobile sidebar overlay */}
        {!isFullscreen && sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
          </div>
        )}

        {/* Mobile Sidebar */}
        {!isFullscreen && (
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <SidebarContent isMobile={true} />
          </div>
        )}

        {/* Desktop Sidebar */}
        {!isFullscreen && (
          <div className={cn(
            "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30 transition-all duration-300",
            collapsed ? "lg:w-20" : "lg:w-72"
          )}>
            <SidebarContent />
          </div>
        )}

        {/* Main content wrapper */}
        <div className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          !isFullscreen ? (collapsed ? "lg:pl-20" : "lg:pl-72") : "pl-0"
        )}>
          <AdminDebugInfo />
          {/* Top Header */}
          {!isFullscreen && (
            <header className="sticky top-0 z-[40] bg-background/80 backdrop-blur-md border-b border-border shadow-sm h-16">
              <div className="relative flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted focus:outline-none"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  
                  {/* Quick Access Bar */}
                  <div className="hidden md:flex items-center">
                    <QuickAccessBar />
                  </div>
                </div>

                {/* Center: Ignition Key */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <IgnitionButton />
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setAdminDarkMode(!adminDarkMode)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    aria-label={adminDarkMode ? 'Cambiar a modo claro (solo admin)' : 'Cambiar a modo oscuro (solo admin)'}
                    title={adminDarkMode ? 'Cambiar a modo claro (solo admin)' : 'Cambiar a modo oscuro (solo admin)'}
                  >
                    {adminDarkMode ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </button>
                  {showConnectionStatus && (
                    <div className="hidden md:block mr-2">
                      <ConnectionStatus />
                    </div>
                  )}
                  
                  {/* Notifications */}
                  <NotificationsDropdown />

                  <div className="h-6 w-px bg-border hidden sm:block"></div>

                  {/* Realtime Clock */}
                  <div className="hidden sm:block">
                    <RealtimeClock />
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Main Content Area */}
          <main className={cn(
            "flex-1 overflow-x-hidden",
            isFullscreen ? "p-4 sm:p-6" : "p-6 sm:p-8"
          )}>
            <div className={cn(
              "mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500",
              isFullscreen ? "max-w-screen-2xl" : "max-w-7xl"
            )}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
