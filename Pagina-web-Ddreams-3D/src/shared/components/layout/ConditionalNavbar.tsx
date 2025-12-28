'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

const ConditionalNavbar: React.FC = () => {
  const pathname = usePathname();
  
  // Ocultar navbar en rutas de admin
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Navbar />;
};

export default ConditionalNavbar;