import React from 'react';
import Link from 'next/link';
import { Home, Store, User, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MobileBottomNavProps {
  pathname: string;
  setIsCartOpen: (isOpen: boolean) => void;
  itemCount: number;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  user: any;
  isNavbarSolid: boolean; // Optional, maybe for styling consistency
  darkMode: boolean;
}

export function MobileBottomNav({
  pathname,
  setIsOpen,
  isOpen,
  user,
  darkMode
}: MobileBottomNavProps) {
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-[101] lg:hidden border-t safe-area-bottom transition-all duration-300",
      darkMode 
        ? "bg-background/95 border-border/50" 
        : "bg-white/95 border-gray-200",
      "backdrop-blur-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
    )}>
      <div className="flex items-center justify-around h-16 px-2 pb-safe">
        {/* Home */}
        <Link href="/" className="flex-1">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full h-full flex flex-col items-center justify-center gap-1 rounded-xl hover:bg-transparent",
              pathname === '/' 
                ? "text-primary" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Home className={cn("w-6 h-6", pathname === '/' && "fill-current")} />
            <span className="text-[10px] font-medium">Inicio</span>
          </Button>
        </Link>

        {/* Catalog */}
        <Link href="/catalogo-impresion-3d" className="flex-1">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full h-full flex flex-col items-center justify-center gap-1 rounded-xl hover:bg-transparent",
              pathname === '/catalogo-impresion-3d' 
                ? "text-primary" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Store className={cn("w-6 h-6", pathname === '/catalogo-impresion-3d' && "fill-current")} />
            <span className="text-[10px] font-medium">Catálogo</span>
          </Button>
        </Link>

        {/* Services */}
        <Link href="/services" className="flex-1">
           <Button 
            variant="ghost" 
            className={cn(
              "w-full h-full flex flex-col items-center justify-center gap-1 rounded-xl hover:bg-transparent",
              pathname === '/services' 
                ? "text-primary" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Briefcase className={cn("w-6 h-6", pathname === '/services' && "fill-current")} />
            <span className="text-[10px] font-medium">Servicios</span>
          </Button>
        </Link>

        {/* Menu/Profile */}
        <div className="flex-1">
          <Button 
            variant="ghost" 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={cn(
              "navbar-toggle w-full h-full flex flex-col items-center justify-center gap-1 rounded-xl hover:bg-transparent",
              isOpen || pathname.startsWith('/profile')
                ? "text-primary" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
             <User className={cn("w-6 h-6", (isOpen || pathname.startsWith('/profile')) && "fill-current")} />
            <span className="text-[10px] font-medium">
                {user ? 'Perfil' : 'Cuenta'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
