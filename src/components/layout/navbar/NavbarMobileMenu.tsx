import Link from 'next/link';
import { useEffect } from 'react';
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
  UserPlus,
  Shield
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
  isAdmin: boolean;
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
  isAdmin,
  logout,
  darkMode,
  itemCount,
  setIsCartOpen
}: NavbarMobileMenuProps) => {
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-md z-[90] transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={cn(
          "navbar-menu lg:hidden fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-2 right-2 z-[100]",
          "rounded-[2rem] overflow-hidden transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)",
          "border border-primary/10 shadow-2xl shadow-black/20 ring-1 ring-black/5",
          isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-[120%] opacity-0 scale-95",
          "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        )}
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-[80px] pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />

        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-4 pb-2 relative z-10" onClick={() => setIsOpen(false)}>
          <div className="w-16 h-1.5 rounded-full bg-muted-foreground/20 backdrop-blur-md" />
        </div>

        <div className="flex flex-col max-h-[80vh] overflow-y-auto pb-6 relative z-10">
          
          {/* 1. Header Section: User Profile */}
          <div className="px-5 py-4">
            {user ? (
              <div className="relative overflow-hidden rounded-2xl p-4 border border-white/10 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 backdrop-blur-sm" />
                <div className="relative flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-white/50 dark:border-white/10 shadow-md ring-2 ring-primary/20">
                    {user.image && <AvatarImage src={user.image} alt={user.username} />}
                    <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-primary-600 text-white font-bold">
                      {(user.username || 'U')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-tight truncate text-foreground">
                      {user.username || 'Usuario'}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate font-medium">
                      {user.email}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                       <Badge variant="secondary" className="h-5 text-[10px] px-1.5 bg-primary/10 text-primary border-primary/20">
                         Miembro
                       </Badge>
                    </div>
                  </div>
                  <ThemeToggle isScrolled={true} />
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl p-5 border border-white/20 shadow-lg bg-gradient-to-br from-background via-muted/50 to-background">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <div className="relative flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-700">Ddreams 3D</h3>
                    <p className="text-xs text-muted-foreground font-medium">Impresión 3D Profesional</p>
                  </div>
                  <ThemeToggle isScrolled={true} />
                </div>

                <div className="grid grid-cols-2 gap-3 relative">
                  <Button asChild variant="default" className="w-full shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-primary-600 border-0 hover:opacity-90 transition-opacity">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors">
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Registro
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Menu Items Group */}
          <div className="px-4 space-y-2">
            
            {/* Perfil (Only if logged in) */}
            {user && (
              <Link
                href="/profile"
                onClick={() => handleLinkClick('/profile')}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-2xl transition-all duration-300",
                  "border border-transparent hover:border-primary/10",
                  pathname === '/profile' 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "hover:bg-muted/50 text-foreground hover:translate-x-1"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2.5 rounded-xl transition-colors duration-300",
                    pathname === '/profile' 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                  )}>
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">Mi Perfil</span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-300",
                  "group-hover:text-primary group-hover:translate-x-0.5"
                )} />
              </Link>
            )}

            {/* Admin Panel (Only if admin) */}
            {isAdmin && (
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  if (typeof window !== 'undefined') {
                    window.location.href = '/admin';
                  }
                }}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-2xl transition-all duration-300",
                  "border border-transparent hover:border-primary/10",
                  pathname.startsWith('/admin')
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "hover:bg-muted/50 text-foreground hover:translate-x-1"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2.5 rounded-xl transition-colors duration-300",
                    pathname.startsWith('/admin')
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                  )}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">Administración</span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-300",
                  "group-hover:text-primary group-hover:translate-x-0.5"
                )} />
              </a>
            )}

            {/* Proceso */}
            <Link
              href="/process"
              onClick={() => handleLinkClick('/process')}
              className={cn(
                "group flex items-center justify-between p-3 rounded-2xl transition-all duration-300",
                "border border-transparent hover:border-primary/10",
                pathname === '/process' 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "hover:bg-muted/50 text-foreground hover:translate-x-1"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-xl transition-colors duration-300",
                  pathname === '/process' 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                  )}>
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm">Nuestro Proceso</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-300",
                "group-hover:text-primary group-hover:translate-x-0.5"
              )} />
            </Link>

            {/* Nosotros */}
            <Link
              href="/about"
              onClick={() => handleLinkClick('/about')}
              className={cn(
                "group flex items-center justify-between p-3 rounded-2xl transition-all duration-300",
                "border border-transparent hover:border-primary/10",
                pathname === '/about' 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "hover:bg-muted/50 text-foreground hover:translate-x-1"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-xl transition-colors duration-300",
                  pathname === '/about' 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                  )}>
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm">Nosotros</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-300",
                "group-hover:text-primary group-hover:translate-x-0.5"
              )} />
            </Link>

            {/* Carrito */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCartOpen(true);
              }}
              className={cn(
                "w-full group flex items-center justify-between p-3 rounded-2xl transition-all duration-300",
                "border border-transparent hover:border-primary/10 hover:bg-muted/50 text-foreground hover:translate-x-1"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors duration-300 relative">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center font-bold shadow-sm">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-sm">Carrito de Compras</span>
              </div>
              <div className="flex items-center gap-2">
                {itemCount > 0 && (
                  <Badge variant="secondary" className="text-xs bg-muted text-foreground font-medium">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </Badge>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:text-primary group-hover:translate-x-0.5" />
              </div>
            </button>
          </div>

          <div className="px-4 py-2">
             <Separator className="opacity-50 bg-border/50" />
          </div>

          {/* 3. Footer Actions */}
          <div className="px-4 space-y-4">
            
            {/* Logout Button */}
            {user && (
              <Button
                variant="ghost"
                className="w-full justify-center gap-2 rounded-xl h-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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
            <div className="text-center pt-2">
              <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                Ddreams 3D v2.0
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
