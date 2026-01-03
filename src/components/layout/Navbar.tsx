'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ThemeSelector from '@/components/ui/ThemeSelector';
import CartDrawer from '@/shared/components/ui/CartDrawer';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  MessageSquare,
  ShoppingCart,
  UserCircle,
  Heart,
  MapPin,
  Package,
  ChevronDown,
  Shield,
} from '@/lib/icons';
import { useCart } from '@/contexts/CartContext';
import { useAdminPermissions } from '@/features/admin/components/AdminProtection';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollManager } from '@/hooks/useScrollRestoration';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';

const NAV_LINKS = [
  { href: '/', label: 'Inicio', ariaLabel: 'Página de inicio' },
  { href: '/services', label: 'Servicios', ariaLabel: 'Nuestros servicios' },
  {
    href: '/catalogo-impresion-3d',
    label: 'Catálogo',
    ariaLabel: 'Catálogo de productos bajo pedido',
  },
  {
    href: '/process',
    label: 'Proceso',
    ariaLabel: 'Información del proceso',
  },
  { href: '/about', label: 'Nosotros', ariaLabel: 'Acerca de nosotros' },
];

const Navbar: React.FC = () => {
  const { darkMode } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { isAdmin } = useAdminPermissions();

  // Define paths that have a hero section with image/dark background
  // where the navbar should start transparent
  const TRANSPARENT_NAVBAR_PATHS = ['/', '/services'];
  const isTransparentPath = TRANSPARENT_NAVBAR_PATHS.includes(pathname);

  // Determine if navbar should be solid based on scroll or specific paths
  // Navbar should be transparent only on specific paths (when not scrolled)
  const isNavbarSolid = isScrolled || !isTransparentPath;

  const toggleMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen((prev) => !prev);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check initial scroll position
    handleScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        !target.closest('.navbar-menu') &&
        !target.closest('.navbar-svg-menu') &&
        !target.closest('.navbar-toggle') &&
        !target.closest('.user-menu-button')
      ) {
        setIsOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out border-b",
        isNavbarSolid
          ? "bg-background/95 backdrop-blur-md shadow-sm border-border"
          : "bg-transparent border-transparent"
      )}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-2 h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="transform transition-transform duration-300 lg:hover:scale-105 relative block flex-shrink-0 w-[180px] sm:w-[250px] lg:w-[350px] h-[60px] lg:h-[80px]"
            aria-label="Ddreams 3D - Inicio"
          >
            {/* 
              Lógica del Logo:
              1. Modo Claro (Web por defecto):
                 - Inicio (Transparente): Logo Blanco (sobre Hero oscuro)
                 - Scroll (Fondo Blanco): Logo Negro
              2. Modo Oscuro:
                 - Inicio (Transparente): Logo Blanco
                 - Scroll (Fondo Oscuro): Logo Blanco
            */}
            
            {/* Logo Blanco (Prioridad en Modo Claro/Inicio y Modo Oscuro) */}
            <div className={cn(
              "absolute inset-0 transition-opacity ease-in-out",
              (!isNavbarSolid || darkMode) 
                ? "opacity-100 z-10 duration-500 delay-200" 
                : "opacity-0 z-0 pointer-events-none duration-200"
            )}>
              <Image
                src="/logo/logo_DD_2026_blanco_V2.svg"
                alt="Ddreams 3D Logo"
                fill
                sizes="(max-width: 768px) 250px, 350px"
                className="object-contain object-left"
                priority
              />
            </div>

            {/* Logo Negro (Solo para Modo Claro con Scroll o Login) */}
            <div className={cn(
              "absolute inset-0 transition-opacity ease-in-out",
              (isNavbarSolid && !darkMode) 
                ? "opacity-100 z-10 duration-500 delay-200" 
                : "opacity-0 z-0 pointer-events-none duration-200"
            )}>
              <Image
                src="/logo/logo_DD_2026_negro_V2.svg"
                alt="Ddreams 3D Logo"
                fill
                sizes="(max-width: 768px) 250px, 350px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                className={cn(
                  "text-sm font-medium transition-all duration-300",
                  pathname === link.href
                    ? cn(
                        "shadow-sm hover:shadow-md",
                        isNavbarSolid && !darkMode
                          ? "bg-primary/20 text-primary hover:bg-primary/30" // Active state in light mode + scrolled
                          : "bg-white/20 text-white hover:bg-white/30" // Active state in dark mode or transparent
                      )
                    : cn(
                        // Cuando NO hay scroll (transparente sobre Hero oscuro) -> Texto blanco
                        // Cuando HAY scroll (fondo sólido) -> Texto oscuro en light, blanco en dark
                        !isNavbarSolid 
                          ? "text-white/90 hover:text-white hover:bg-white/10"
                          : darkMode 
                            ? "text-white/90 hover:text-white hover:bg-white/10"
                            : "text-foreground hover:text-primary hover:bg-primary/5"
                      )
                )}
              >
                <Link
                  href={link.href}
                  aria-label={link.ariaLabel}
                  onClick={() => {
                    // Track navigation events
                    if (link.href === '/catalogo-impresion-3d') {
                      trackEvent(AnalyticsEvents.VIEW_CATALOG_CLICK, { location: AnalyticsLocations.NAVBAR });
                    }
                    
                    // Clear scroll position for the target path to ensure fresh start
                    if (typeof window !== 'undefined') {
                      ScrollManager.clear(link.href);
                    }
                  }}
                >
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Google Login Icon */}
            {!user && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-all duration-300 ease-out transform hover:scale-105",
                  !isNavbarSolid
                    ? "text-white hover:bg-white/20 hover:text-white"
                    : darkMode
                      ? "text-white hover:bg-white/20 hover:text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-label="Iniciar sesión con Google"
              >
                <Link href="/login">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </Link>
              </Button>
            )}

            {/* Quote Button */}
            <Button
              asChild
              variant="gradient"
              className={cn(
                "w-[200px] justify-start gap-2 hover:scale-105 shadow-md",
                !isNavbarSolid && "shadow-lg"
              )}
            >
              <Link
                href="/contact"
                className="flex items-center gap-2"
                aria-label="Solicitar cotización"
                onClick={() => trackEvent(AnalyticsEvents.REQUEST_QUOTE_CLICK, { location: AnalyticsLocations.NAVBAR })}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Solicitar Cotización</span>
              </Link>
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleUserMenu();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleUserMenu();
                    }
                  }}
                  variant="ghost"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg h-auto hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 user-menu-button",
                    !isNavbarSolid
                      ? 'text-white hover:bg-white/20 focus:ring-offset-transparent'
                      : 'text-foreground hover:bg-muted focus:ring-offset-background'
                  )}
                  aria-label="Menú de usuario"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  id="user-menu-button"
                >
                  {/* Avatar with online indicator */}
                  <div className="relative">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200",
                        isNavbarSolid
                          ? cn("bg-primary/10", "text-primary")
                          : darkMode
                          ? 'bg-white/20 text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    {/* Online status indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-neutral-800 rounded-full animate-pulse"></div>
                  </div>

                  <span className="hidden xl:flex xl:flex-col xl:items-start">
                    <span className="text-sm font-medium leading-tight">
                      {user.username || 'Usuario'}
                    </span>
                    <span
                      className={cn(
                        "text-xs leading-tight",
                        isNavbarSolid
                          ? 'text-muted-foreground'
                          : darkMode
                          ? 'text-white/70'
                          : 'text-muted-foreground'
                      )}
                    >
                      En línea
                    </span>
                  </span>

                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isUserMenuOpen ? 'rotate-180' : 'rotate-0'
                    )}
                  />
                </Button>

                {/* Enhanced User Dropdown */}
                {isUserMenuOpen && (
                  <div
                    className={cn(
                      "absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border border-border py-2 z-50 navbar-menu transition-all duration-200 ease-in-out transform opacity-100 scale-100",
                      "bg-popover text-popover-foreground"
                    )}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    style={{ display: 'block' }}
                  >
                    {/* User Header */}
                    <Link href="/profile" onClick={() => setIsUserMenuOpen(false)}>
                      <div className="px-4 py-3 border-b border-border bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-bold text-lg">
                              {(user.username || 'U')[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {user.username || 'Usuario'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email || 'usuario@ejemplo.com'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Menu Items */}
                    <div className="py-1">
                      {isAdmin && (
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-start px-4 py-3 h-auto hover:bg-muted rounded-none"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Link
                            href="/admin"
                            role="menuitem"
                            tabIndex={0}
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            <div className="flex flex-col items-start">
                              <span className="font-medium">Administración</span>
                              <p className="text-xs text-muted-foreground font-normal">
                                Panel de administrador
                              </p>
                            </div>
                          </Link>
                        </Button>
                      )}

                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start px-4 py-3 h-auto hover:bg-muted rounded-none"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Link
                          href="/settings"
                          role="menuitem"
                          tabIndex={0}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Configuración</span>
                            <p className="text-xs text-muted-foreground font-normal">
                              Preferencias de la cuenta
                            </p>
                          </div>
                        </Link>
                      </Button>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-border pt-1">
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start px-4 py-3 h-auto text-destructive hover:bg-destructive/10 hover:text-destructive rounded-none"
                        role="menuitem"
                        tabIndex={0}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        <span className="flex flex-col items-start">
                          <span className="font-medium">Cerrar sesión</span>
                          <span className="text-xs text-destructive font-normal">
                            Salir de tu cuenta
                          </span>
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                asChild
                variant={isScrolled ? 'default' : 'glass'}
                className={cn(
                  "hidden w-[130px] hover:scale-105 hover:shadow-lg",
                  !isScrolled && "bg-white/10 hover:bg-white/20"
                )}
              >
                <Link href="/login">
                  Iniciar Sesión
                </Link>
              </Button>
            )}

            {/* Cart Button */}
            <Button
              onClick={() => setIsCartOpen(true)}
              variant="ghost"
              size="icon"
              className={cn(
                "relative p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out",
                !isNavbarSolid
                  ? 'text-white hover:bg-white/10 hover:text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-label="Abrir carrito de compras"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle isScrolled={isNavbarSolid} />
          </div>

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
        </div>
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
              {NAV_LINKS.map((link) => (
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
                      <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {user.username || user.email}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start px-4 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg h-auto"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/admin">
                        <Shield className="w-4 h-4 mr-3" />
                        <span>Administración</span>
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg h-auto"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/profile">
                      <Settings className="w-4 h-4 mr-3" />
                      <span>Configuración</span>
                    </Link>
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full text-left justify-start h-auto"
                  >
                    <LogOut className="w-4 h-4" />
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

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
