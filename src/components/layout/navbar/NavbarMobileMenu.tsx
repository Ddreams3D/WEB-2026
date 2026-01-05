import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, MessageSquare, ShoppingCart, LogOut } from '@/lib/icons';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ScrollManager } from '@/hooks/useScrollRestoration';

interface NavLink {
  href: string;
  label: string;
  ariaLabel: string;
}

interface NavbarMobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleMenu: (e?: React.MouseEvent) => void;
  links: NavLink[];
  pathname: string;
  user: any;
  logout: () => void;
  isNavbarSolid: boolean;
  darkMode: boolean;
  itemCount: number;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const NavbarMobileMenu = ({
  isOpen,
  setIsOpen,
  toggleMenu,
  links,
  pathname,
  user,
  logout,
  isNavbarSolid,
  darkMode,
  itemCount,
  setIsCartOpen
}: NavbarMobileMenuProps) => {
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden z-[100]">
        <Button
          onClick={toggleMenu}
          variant="ghost"
          className={cn(
            "navbar-toggle relative p-3 rounded-lg h-auto touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center transition-colors duration-200 cursor-pointer z-[100]",
            !isNavbarSolid
              ? 'text-white/90 hover:bg-white/20 active:bg-white/30 hover:text-white'
              : darkMode
                ? 'text-neutral-300 hover:bg-neutral-800 active:bg-neutral-700 hover:text-white'
                : 'text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 hover:text-neutral-900'
          )}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {isOpen ? (
            <X className="w-6 h-6 pointer-events-none" />
          ) : (
            <Menu className="w-6 h-6 pointer-events-none" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div 
          className={cn(
            "lg:hidden fixed top-[4.5rem] right-4 w-64 max-w-[90vw] z-40 overflow-y-auto backdrop-blur-xl rounded-2xl border border-neutral-200/20 dark:border-neutral-700/20 shadow-2xl transition-all duration-300",
            darkMode 
              ? "bg-neutral-950/95" 
              : "bg-white/95"
          )}
          style={{ maxHeight: 'calc(100vh - 6rem)' }}
        >
          <div className="px-3 py-4 space-y-2">
            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {links.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant="ghost"
                  className={cn(
                  "w-full justify-center px-4 py-2 rounded-lg text-sm font-medium touch-manipulation min-h-[40px] flex items-center transition-all duration-200 border border-transparent",
                  pathname === link.href
                    ? cn("bg-primary/10", "text-primary-600 dark:text-primary-400 shadow-sm border-primary-100 dark:border-primary-900/50")
                    : 'text-muted-foreground hover:bg-muted dark:hover:bg-muted/80'
                )}
                  onClick={() => {
                    setIsOpen(false);
                    if (typeof window !== 'undefined') {
                      ScrollManager.clear(link.href);
                    }
                  }}
                >
                  <Link
                    href={link.href}
                    role="menuitem"
                    tabIndex={isOpen ? 0 : -1}
                    aria-label={link.ariaLabel}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>

            {/* Mobile Quote & Cart & Theme */}
            <div className="pt-3 border-t border-neutral-200/50 dark:border-neutral-800/50 space-y-2">
              <Button
                asChild
                variant="gradient"
                className="w-full justify-center min-h-[40px] text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                onClick={() => setIsOpen(false)}
              >
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2"
                  tabIndex={isOpen ? 0 : -1}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Solicitar Cotización</span>
                </Link>
              </Button>

              <div className="grid grid-cols-4 gap-2">
                {/* Mobile Cart Button */}
                <Button
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className="col-span-3 justify-center bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 active:bg-primary-200 dark:active:bg-primary-900/40 text-primary-700 dark:text-primary-300 min-h-[40px] text-xs px-2"
                  tabIndex={isOpen ? 0 : -1}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <ShoppingCart className="w-4 h-4 mr-1.5" />
                  <span>Carrito ({itemCount})</span>
                </Button>

                {/* Mobile Theme Toggle */}
                <div className="col-span-1 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                   <ThemeToggle isScrolled={true} />
                </div>
              </div>
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                        {(user.username || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {user.username || 'Usuario'}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {user.email || 'usuario@ejemplo.com'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start px-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    tabIndex={isOpen ? 0 : -1}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Cerrar Sesión</span>
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  className="hidden w-full"
                >
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
