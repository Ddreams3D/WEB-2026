'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

const ConditionalFooter: React.FC = () => {
  const pathname = usePathname();
  
  // Ocultar footer en rutas de admin
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Footer />;
};

export default ConditionalFooter;
