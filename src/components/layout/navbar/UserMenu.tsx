import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User, ChevronDown, Shield, Settings, LogOut } from '@/lib/icons';

interface UserMenuProps {
  user: any;
  isAdmin: boolean;
  logout: () => void;
  isNavbarSolid: boolean;
  darkMode: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const UserMenu = ({ user, isAdmin, logout, isNavbarSolid, darkMode, isOpen, setIsOpen }: UserMenuProps) => {
  const toggleUserMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
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
        aria-expanded={isOpen}
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
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
        />
      </Button>

      {/* Enhanced User Dropdown */}
      {isOpen && (
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
          <Link href="/profile" onClick={() => setIsOpen(false)}>
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
                onClick={() => setIsOpen(false)}
              >
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    window.location.href = '/admin';
                  }}
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
                </a>
              </Button>
            )}

            <Button
              asChild
              variant="ghost"
              className="w-full justify-start px-4 py-3 h-auto hover:bg-muted rounded-none"
              onClick={() => setIsOpen(false)}
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
              onClick={logout}
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
  );
};
