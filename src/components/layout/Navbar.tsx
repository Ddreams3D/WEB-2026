'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CartDrawer from '@/shared/components/ui/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { useAdminPermissions } from '@/features/admin/components/AdminProtection';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { NavbarLogo } from './navbar/NavbarLogo';
import { NavbarDesktopLinks } from './navbar/NavbarDesktopLinks';
import { NavbarActions } from './navbar/NavbarActions';
import { NavbarMobileMenu } from './navbar/NavbarMobileMenu';
import { MobileBottomNav } from './navbar/MobileBottomNav';

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

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav
        style={{ top: 'var(--navbar-offset, 0px)' }}
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b",
          isNavbarSolid
            ? "bg-background/95 backdrop-blur-md shadow-sm border-border"
            : "bg-transparent border-transparent"
        )}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-2 h-16 lg:h-20">
            <NavbarLogo 
              isNavbarSolid={isNavbarSolid} 
              darkMode={darkMode} 
            />

            <NavbarDesktopLinks 
              links={NAV_LINKS} 
              pathname={pathname} 
              isNavbarSolid={isNavbarSolid} 
              darkMode={darkMode} 
            />

            <NavbarActions 
              user={user}
              isAdmin={isAdmin}
              logout={logout}
              isNavbarSolid={isNavbarSolid}
              darkMode={darkMode}
              isUserMenuOpen={isUserMenuOpen}
              setIsUserMenuOpen={setIsUserMenuOpen}
              itemCount={itemCount}
              setIsCartOpen={setIsCartOpen}
            />
          </div>
        </div>

        {/* Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </nav>

      <NavbarMobileMenu 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        pathname={pathname}
        user={user}
        isAdmin={isAdmin}
        logout={logout}
        darkMode={darkMode}
        itemCount={itemCount}
        setIsCartOpen={setIsCartOpen}
      />

      <MobileBottomNav 
        pathname={pathname}
        setIsCartOpen={setIsCartOpen}
        itemCount={itemCount}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        user={user}
        isNavbarSolid={isNavbarSolid}
        darkMode={darkMode}
      />
    </>
  );
};

export default Navbar;
