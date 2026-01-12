import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageSquare, ShoppingCart } from '@/lib/icons';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';
import { UserMenu } from './UserMenu';

interface NavbarActionsProps {
  user: any;
  isAdmin: boolean;
  logout: () => void;
  isNavbarSolid: boolean;
  darkMode: boolean;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (isOpen: boolean) => void;
  itemCount: number;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const NavbarActions = ({
  user,
  isAdmin,
  logout,
  isNavbarSolid,
  darkMode,
  isUserMenuOpen,
  setIsUserMenuOpen,
  itemCount,
  setIsCartOpen
}: NavbarActionsProps) => {
  return (
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
          "justify-center gap-2 hover:scale-105 shadow-md transition-all duration-300",
          "w-10 px-0 lg:w-auto lg:px-4 xl:w-[200px] xl:justify-start",
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
          <span className="hidden xl:inline">Solicitar Cotización</span>
          <span className="hidden lg:inline xl:hidden">Cotizar</span>
        </Link>
      </Button>

      {/* User Menu */}
      {user ? (
        <UserMenu 
          user={user}
          isAdmin={isAdmin}
          logout={logout}
          isNavbarSolid={isNavbarSolid}
          darkMode={darkMode}
          isOpen={isUserMenuOpen}
          setIsOpen={setIsUserMenuOpen}
        />
      ) : (
        <Button
          asChild
          variant={isNavbarSolid ? 'default' : 'glass'}
          className={cn(
            "hidden w-[130px] hover:scale-105 hover:shadow-lg",
            !isNavbarSolid && "bg-white/10 hover:bg-white/20"
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
  );
};
