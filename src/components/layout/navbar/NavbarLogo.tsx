import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MainLogo } from '@/components/ui';

interface NavbarLogoProps {
  isNavbarSolid: boolean;
  darkMode: boolean;
}

export const NavbarLogo = ({ isNavbarSolid, darkMode }: NavbarLogoProps) => {
  return (
    <Link
      href="/"
      className="transform transition-transform duration-300 lg:hover:scale-105 relative block flex-shrink-0 w-[180px] sm:w-[250px] lg:w-[350px] h-[60px] lg:h-[80px]"
      aria-label="Ddreams 3D - Inicio"
    >
      {/* Logo Blanco (Prioridad en Modo Claro/Inicio y Modo Oscuro) */}
      <div className={cn(
        "absolute inset-0 transition-opacity ease-in-out",
        (!isNavbarSolid || darkMode) 
          ? "opacity-100 z-10 duration-500 delay-200" 
          : "opacity-0 z-0 pointer-events-none duration-200"
      )}>
        <MainLogo 
          variant="white"
          className="w-full h-full"
        />
      </div>

      {/* Logo Negro (Solo para Modo Claro con Scroll o Login) */}
      <div className={cn(
        "absolute inset-0 transition-opacity ease-in-out",
        (isNavbarSolid && !darkMode) 
          ? "opacity-100 z-10 duration-500 delay-200" 
          : "opacity-0 z-0 pointer-events-none duration-200"
      )}>
        <MainLogo 
          variant="black"
          className="w-full h-full"
        />
      </div>
    </Link>
  );
};
