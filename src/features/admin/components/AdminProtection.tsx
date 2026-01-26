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
    // Si no hay usuario, redirigimos al login
    if (typeof window !== 'undefined') {
       router.replace('/login');
    }
    return null;
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
    // Si el usuario está logueado pero NO es admin, redirigimos al home.
    if (typeof window !== 'undefined') {
       router.replace('/');
    }
    return null;
  }

  // 5. ACCESO PERMITIDO
  return <>{children}</>;
}

// Re-exportamos para mantener compatibilidad si se importa desde aquí
export { useAdminPermissions };
