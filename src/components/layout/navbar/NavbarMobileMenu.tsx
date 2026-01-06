import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LogOut, 
  User, 
  FileText, 
  Users, 
  ShoppingCart, 
  ChevronRight,
  LogIn,
  UserPlus
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ScrollManager } from '@/hooks/useScrollRestoration';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface NavbarMobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pathname: string;
  user: any;
  logout: () => void;
  darkMode: boolean;
  itemCount: number;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const NavbarMobileMenu = ({
  isOpen,
  setIsOpen,
  pathname,
  user,
  logout,
  darkMode,
  itemCount,
  setIsCartOpen
}: NavbarMobileMenuProps) => {
  
  // Prevent body scroll when menu is open
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      ScrollManager.clear(href);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={cn(
          "navbar-menu lg:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-[100] rounded-t-[2rem] overflow-hidden transition-transform duration-300 ease-out transform",
          isOpen ? "translate-y-0" : "translate-y-full",
          darkMode ? "bg-neutral-950" : "bg-white"
        )}
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar (Visual cue for dragging/bottom sheet) */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsOpen(false)}>
          <div className="w-12 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="flex flex-col max-h-[80vh] overflow-y-auto pb-6">
          
          {/* 1. Header Section: User Profile */}
          <div className="px-6 py-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarImage src={user.image} alt={user.username} />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
                    {(user.username || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg leading-tight truncate">
                    {user.username || 'Usuario'}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold">Bienvenido a Ddreams 3D</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Inicia sesión para gestionar tus pedidos y cotizaciones.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="default" className="w-full">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Registro
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator className="opacity-50" />

          {/* 2. Menu Items Group */}
          <div className="p-4 space-y-1">
            
            {/* Perfil (Only if logged in) */}
            {user && (
              <Link
                href="/profile"
                onClick={() => handleLinkClick('/profile')}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all duration-200 active:scale-[0.98]",
                  pathname === '/profile' 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-muted text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", pathname === '/profile' ? "bg-primary/20" : "bg-muted")}>
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Mi Perfil</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            )}

            {/* Proceso */}
            <Link
              href="/process"
              onClick={() => handleLinkClick('/process')}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all duration-200 active:scale-[0.98]",
                pathname === '/process' 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", pathname === '/process' ? "bg-primary/20" : "bg-muted")}>
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-medium">Nuestro Proceso</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            {/* Nosotros */}
            <Link
              href="/about"
              onClick={() => handleLinkClick('/about')}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all duration-200 active:scale-[0.98]",
                pathname === '/about' 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", pathname === '/about' ? "bg-primary/20" : "bg-muted")}>
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-medium">Nosotros</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            {/* Carrito */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted text-foreground transition-all duration-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted relative">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="font-medium">Carrito de Compras</span>
              </div>
              <div className="flex items-center gap-2">
                {itemCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </Badge>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          </div>

          <Separator className="opacity-50" />

          {/* 3. Settings & Footer */}
          <div className="p-4 space-y-4">
            
            {/* Theme Toggle Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <span className="font-medium text-sm text-muted-foreground ml-1">Apariencia</span>
              <ThemeToggle isScrolled={true} />
            </div>

            {/* Logout Button */}
            {user && (
              <Button
                variant="destructive"
                className="w-full justify-center gap-2 rounded-xl h-12 mt-2"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </Button>
            )}
            
            {/* Version / Info */}
            <div className="text-center pt-4 pb-8">
              <p className="text-[10px] text-muted-foreground/50">
                Ddreams 3D v2.0 &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
