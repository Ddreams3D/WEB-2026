'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface OptimizedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  prefetch?: boolean;
  [key: string]: unknown;
}

export function OptimizedLink({ 
  href, 
  children, 
  className = '', 
  onClick,
  prefetch = true,
  ...props 
}: OptimizedLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    // Ejecutar onClick personalizado si existe
    if (onClick) {
      onClick();
    }
    // Permitir navegación nativa de Next.js Link
  };

  const handleMouseEnter = () => {
    // Precargar la página al hacer hover para navegación más rápida
    if (href.startsWith('/') && prefetch) {
      router.prefetch(href);
    }
  };

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      prefetch={prefetch}
      {...props}
    >
      {children}
    </Link>
  );
}

export default OptimizedLink;