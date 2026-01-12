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
      "fixed bottom-4 left-4 right-4 z-[101] lg:hidden transition-all duration-300",
      "rounded-2xl border safe-area-bottom",
      "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
      "border-primary/10 shadow-lg shadow-black/5"
    )}>
      {/* Decorative gradient to match theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none rounded-2xl -z-10" />
      
      <div className="flex items-center justify-around h-16 px-1 relative z-10">
        {/* Home */}
        <Link href="/" className="flex-1">
          <Button 
            variant="ghost" 
            className="w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-transparent group"
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              pathname === '/' 
                ? "bg-primary/10 text-primary scale-110" 
                : "text-muted-foreground group-hover:text-primary group-hover:bg-primary/5"
            )}>
              <Home className={cn("w-5 h-5 transition-transform duration-300", pathname === '/' && "fill-current")} strokeWidth={pathname === '/' ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-medium transition-colors duration-300",
              pathname === '/' ? "text-primary" : "text-muted-foreground"
            )}>Inicio</span>
          </Button>
        </Link>

        {/* Catalog */}
        <Link href="/catalogo-impresion-3d" className="flex-1">
          <Button 
            variant="ghost" 
            className="w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-transparent group"
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              pathname === '/catalogo-impresion-3d' 
                ? "bg-primary/10 text-primary scale-110" 
                : "text-muted-foreground group-hover:text-primary group-hover:bg-primary/5"
            )}>
              <Store className={cn("w-5 h-5 transition-transform duration-300", pathname === '/catalogo-impresion-3d' && "fill-current")} strokeWidth={pathname === '/catalogo-impresion-3d' ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-medium transition-colors duration-300",
              pathname === '/catalogo-impresion-3d' ? "text-primary" : "text-muted-foreground"
            )}>Catálogo</span>
          </Button>
        </Link>

        {/* Services */}
        <Link href="/services" className="flex-1">
           <Button 
            variant="ghost" 
            className="w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-transparent group"
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              pathname === '/services' 
                ? "bg-primary/10 text-primary scale-110" 
                : "text-muted-foreground group-hover:text-primary group-hover:bg-primary/5"
            )}>
              <Briefcase className={cn("w-5 h-5 transition-transform duration-300", pathname === '/services' && "fill-current")} strokeWidth={pathname === '/services' ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-medium transition-colors duration-300",
              pathname === '/services' ? "text-primary" : "text-muted-foreground"
            )}>Servicios</span>
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
            className="navbar-toggle w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-transparent group"
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              isOpen || pathname.startsWith('/profile')
                ? "bg-primary/10 text-primary scale-110" 
                : "text-muted-foreground group-hover:text-primary group-hover:bg-primary/5"
            )}>
               <User className={cn("w-5 h-5 transition-transform duration-300", (isOpen || pathname.startsWith('/profile')) && "fill-current")} strokeWidth={(isOpen || pathname.startsWith('/profile')) ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-medium transition-colors duration-300",
              isOpen || pathname.startsWith('/profile') ? "text-primary" : "text-muted-foreground"
            )}>
                {user ? 'Perfil' : 'Cuenta'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
