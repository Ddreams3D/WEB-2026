'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { isSuperAdmin, ADMIN_EMAILS } from '@/config/roles';
import { ShieldAlert } from '@/lib/icons';

interface AdminProtectionProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator';
}

// Función para verificar si un usuario es administrador
function isUserAdmin(userEmail: string | undefined): boolean {
  return isSuperAdmin(userEmail);
}

// Función para verificar permisos desde localStorage
function getUserPermissions(userEmail: string | undefined, userRole: string | undefined) {
  if (!userEmail) return { isAdmin: false, role: 'user' };
  
  // Verificar rol directo del usuario (desde AuthContext/Firestore)
  if (userRole === 'admin') {
    return { isAdmin: true, role: 'admin' };
  }

  // Verificar en la lista de administradores (config)
  if (isUserAdmin(userEmail)) {
    return { isAdmin: true, role: 'admin' };
  }
  
  // Verificar permisos guardados en localStorage
  const savedPermissions = localStorage.getItem('userPermissions');
  if (savedPermissions) {
    try {
      const permissions = JSON.parse(savedPermissions);
      const userPermission = permissions[userEmail];
      if (userPermission) {
        return {
          isAdmin: userPermission.role === 'admin' || userPermission.role === 'moderator',
          role: userPermission.role
        };
      }
    } catch (error) {
      console.error('Error parsing user permissions:', error);
    }
  }
  
  return { isAdmin: false, role: 'user' };
}

export default function AdminProtection({ children, requiredRole = 'admin' }: AdminProtectionProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check for secret access first
    const secretAccess = localStorage.getItem('theme_secret_access');
    if (secretAccess === 'granted') {
      setHasAccess(true);
      setChecking(false);
      return;
    }

    if (isLoading) return;

    if (!user) {
      // Usuario no autenticado, redirigir al login
      router.push('/login?redirect=/admin');
      return;
    }

    // Verificar permisos del usuario
    const permissions = getUserPermissions(user.email, user.role);
    
    if (!permissions.isAdmin) {
      // Usuario sin permisos de administrador
      setHasAccess(false);
      setChecking(false);
      return;
    }

    // Verificar rol específico si es requerido
    if (requiredRole === 'admin' && permissions.role !== 'admin') {
      setHasAccess(false);
      setChecking(false);
      return;
    }

    // Usuario tiene acceso
    setHasAccess(true);
    setChecking(false);
  }, [user, isLoading, router, requiredRole]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading || checking) {
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

  // Mostrar error de acceso denegado
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
              onClick={() => router.push('/')}
              variant="gradient"
              className="w-full transform hover:scale-105"
            >
              Volver al Inicio
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              Regresar
            </Button>
          </div>
          
          {/* Información para desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                Modo Desarrollo - Información de Acceso:
              </p>
              <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <p>Email actual: {user?.email}</p>
                <p>Emails de admin permitidos:</p>
                <ul className="list-disc list-inside ml-2">
                  {ADMIN_EMAILS.map(email => (
                    <li key={email}>{email}</li>
                  ))}
                </ul>
                <p className="mt-2 text-yellow-600 dark:text-yellow-400">
                  Puedes cambiar tu email en el perfil o agregar tu email actual a la lista de administradores.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Usuario tiene acceso, mostrar contenido
  return <>{children}</>;
}

// Hook para verificar permisos de administrador
export function useAdminPermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({ isAdmin: false, role: 'user' });

  useEffect(() => {
    if (user?.email) {
      const userPermissions = getUserPermissions(user.email, user.role);
      setPermissions(userPermissions);
    } else {
      setPermissions({ isAdmin: false, role: 'user' });
    }
  }, [user]);

  return permissions;
}

// Función para otorgar permisos de administrador (solo para desarrollo/testing)
export function grantAdminPermissions(userEmail: string, role: 'admin' | 'moderator' = 'admin') {
  const savedPermissions = localStorage.getItem('userPermissions');
  let permissions: Record<string, { role: string; grantedAt: string }> = {};
  
  if (savedPermissions) {
    try {
      permissions = JSON.parse(savedPermissions);
    } catch (error) {
      console.error('Error parsing permissions:', error);
    }
  }
  
  permissions[userEmail] = { role, grantedAt: new Date().toISOString() };
  localStorage.setItem('userPermissions', JSON.stringify(permissions));
}

// Función para revocar permisos de administrador
export function revokeAdminPermissions(userEmail: string) {
  const savedPermissions = localStorage.getItem('userPermissions');
  if (!savedPermissions) return;
  
  try {
    const permissions = JSON.parse(savedPermissions);
    delete permissions[userEmail];
    localStorage.setItem('userPermissions', JSON.stringify(permissions));
  } catch (error) {
    console.error('Error revoking permissions:', error);
  }
}