'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ADMIN_EMAILS } from '@/config/roles';
import { ShieldAlert } from '@/lib/icons';
import { useAdminProtection, useAdminPermissions } from '../hooks/useAdminProtection';

interface AdminProtectionProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator';
}

export default function AdminProtection({ children, requiredRole = 'admin' }: AdminProtectionProps) {
  const router = useRouter();

  // Desactivamos la redirección automática para evitar bucles infinitos y mostrar la pantalla de error/debug
  const { checking, hasAccess, user, isAuthReady } = useAdminProtection({ 
    requiredRole,
    redirectOnFail: false 
  });

  // [SUPER ADMIN FAST-TRACK]
  // Verificación directa de emails hardcodeados para evitar latencia o fallos de Firestore/Service
  const isHardcodedAdmin = React.useMemo(() => {
    if (!user?.email) return false;
    return ADMIN_EMAILS.includes(user.email.toLowerCase().trim());
  }, [user?.email]);

  // 0. ACCESO INMEDIATO PARA SUPER ADMINS (Validación Cliente 100%)
  // Si el email está en la lista blanca, entramos directo.
  // Esta validación NO depende de Firestore, solo de Firebase Auth (email).
  if (isHardcodedAdmin) {
    return <>{children}</>;
  }

  // 1. ESPERA DE AUTH (Solo Firebase Auth, no Firestore)
  // isAuthReady indica que onAuthStateChanged ya disparó.
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Cargando sesión...
          </p>
        </div>
      </div>
    );
  }

  // 2. REDIRECCIÓN SI NO HAY USUARIO (Anon)
  if (!user) {
    // En lugar de redirigir inmediatamente, mostramos una pantalla de "Sesión no detectada"
    // Esto ayuda a evitar bucles si la sesión se recupera o si es un error transitorio.
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <ShieldAlert className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Sesión no detectada
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            No pudimos verificar tu sesión. Si acabas de recargar, espera un momento.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Recargar Página
            </Button>
            <Button onClick={() => router.push('/login')}>
              Ir al Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. CHECKING DE PERMISOS (Firestore / Custom Claims)
  // Si llegamos aquí, hay usuario pero no es hardcoded admin.
  // Esperamos la validación "fina" (checking = true).
  if (checking) {
     return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Verificando permisos...
          </p>
        </div>
      </div>
    );
  }

  // 4. ACCESO DENEGADO (Final state)
  // Terminó checking y hasAccess es false.
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <ShieldAlert className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Acceso Restringido
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Tu cuenta ({user?.email}) no tiene permisos de administrador.
            Si esto es un error, verifica tu conexión o contacta al desarrollador.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
            <Button onClick={() => router.push('/')}>
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 5. ACCESO PERMITIDO
  return <>{children}</>;
}

// Re-exportamos para mantener compatibilidad si se importa desde aquí
export { useAdminPermissions };
