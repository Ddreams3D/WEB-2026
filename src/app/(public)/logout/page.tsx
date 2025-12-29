'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/ToastManager';

export default function LogoutPage() {
  const { logout, isAuthenticated } = useAuth();
  const { showInfo } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Si está autenticado, hacer logout
    if (isAuthenticated) {
      showInfo('Sesión cerrada', 'Has cerrado sesión correctamente');
      logout();
    } else {
      // Si no está autenticado, redirigir a login
      router.push('/login');
    }
  }, [isAuthenticated, logout, router, showInfo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Cerrando sesión...
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Te estamos redirigiendo al login
        </p>
      </div>
    </div>
  );
}