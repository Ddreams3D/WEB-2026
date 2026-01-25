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
  const [isBypassed, setIsBypassed] = React.useState(false);

  // Verificación de bypass segura para hidratación
  React.useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('ddreams_admin_bypass') === 'true') {
      setIsBypassed(true);
    }
  }, []);

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

  // 0. BYPASS DE EMERGENCIA (Estado controlado)
  if (isBypassed) {
    return <>{children}</>;
  }

  // 0.5. ACCESO INMEDIATO PARA SUPER ADMINS (Validación Cliente 100%)
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
  // Si terminó de cargar y no hay user, mostramos debug en lugar de redirigir
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
             <ShieldAlert className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Sesión No Detectada
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            La aplicación no detecta ningún usuario conectado.
          </p>
          
          <div className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded text-left text-xs font-mono mb-4 overflow-auto max-h-40">
            <p><strong>isAuthReady:</strong> {String(isAuthReady)}</p>
            <p><strong>User:</strong> null</p>
            <p><strong>Checking:</strong> {String(checking)}</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                window.location.href = '/login';
              }}
              variant="default"
              className="w-full"
            >
              Ir al Login
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Reintentar
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
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Acceso Denegado
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            No tienes permisos para acceder a esta área administrativa.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/admin')} 
              variant={hasAccess ? "default" : "secondary"}
              className="w-full"
            >
              Ir al Panel Admin
            </Button>
          </div>
          
          {/* Información para desarrollo y depuración - SIEMPRE VISIBLE POR AHORA */}
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-left animate-pulse">
              <p className="text-xs text-red-800 dark:text-red-200 font-bold mb-2 uppercase">
                ⚠️ MODO DEPURACIÓN ACTIVO v2.0 (NO REDIRECT)
              </p>
              <div className="text-xs text-red-700 dark:text-red-300 space-y-1">
                <p><strong>Tu Email:</strong> "{user?.email}"</p>
                <p><strong>Tu UID:</strong> {user?.id}</p>
                <p><strong>Estado Auth:</strong> {checking ? 'Verificando...' : (hasAccess ? 'Acceso Permitido' : 'DENEGADO')}</p>
                <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
                <p><strong>Causa probable:</strong> Tu email no coincide exactamente con la lista autorizada o Firestore no tiene el rol 'admin'.</p>
                
                <details className="mt-2" open>
                  <summary className="cursor-pointer font-medium hover:underline">Lista de Emails Autorizados:</summary>
                  <ul className="list-disc list-inside ml-2 mt-1 font-mono">
                    {ADMIN_EMAILS.map(email => (
                      <li key={email} className={email === user?.email ? "font-bold text-green-600 border border-green-500 bg-green-100 dark:bg-green-900 px-1" : ""}>{email}</li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>

            {/* Emergency Password Access - Restaurando la "ventana de contraseña" solicitada */}
            <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-sm text-neutral-500 mb-2">¿Eres el administrador y tienes problemas de acceso?</p>
              <details className="cursor-pointer">
                <summary className="text-sm font-medium text-primary hover:underline select-none">
                  Ingresar Clave Maestra de Recuperación
                </summary>
                <div className="mt-3 flex gap-2">
                  <input 
                    type="password" 
                    placeholder="Clave de admin..." 
                    className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val === 'ddreams2026' || val === 'admin123') { // Claves de emergencia
                          localStorage.setItem('ddreams_admin_bypass', 'true');
                          localStorage.setItem('adminDarkMode', 'true');
                          window.location.reload();
                        } else {
                          alert('Clave incorrecta');
                        }
                      }
                    }}
                  />
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                      if (input.value === 'ddreams2026' || input.value === 'admin123') {
                        localStorage.setItem('ddreams_admin_bypass', 'true');
                        localStorage.setItem('adminDarkMode', 'true');
                        window.location.reload();
                      } else {
                        alert('Clave incorrecta');
                      }
                    }}
                  >
                    Entrar
                  </Button>
                </div>
              </details>
            </div>
        </div>
      </div>
    );
  }

  // Usuario tiene acceso, mostrar contenido
  return <>{children}</>;
}

// Re-exportamos para mantener compatibilidad si se importa desde aquí
export { useAdminPermissions };
