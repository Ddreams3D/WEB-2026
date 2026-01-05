import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isSuperAdmin } from '@/config/roles';

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
  if (typeof window !== 'undefined') {
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
  }
  
  return { isAdmin: false, role: 'user' };
}

interface UseAdminProtectionProps {
  requiredRole?: 'admin' | 'moderator';
  redirectOnFail?: boolean;
  redirectPath?: string;
}

export function useAdminProtection({ 
  requiredRole = 'admin', 
  redirectOnFail = true,
  redirectPath = '/login?redirect=/admin' 
}: UseAdminProtectionProps = {}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check for secret access first
    if (typeof window !== 'undefined') {
      const secretAccess = localStorage.getItem('theme_secret_access');
      if (secretAccess === 'granted') {
        setHasAccess(true);
        setChecking(false);
        return;
      }
    }

    if (isLoading) return;

    if (!user) {
      // Usuario no autenticado
      if (redirectOnFail) {
        router.push(redirectPath);
      }
      setChecking(false);
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
  }, [user, isLoading, router, requiredRole, redirectOnFail, redirectPath]);

  return { checking, hasAccess, user, isLoading };
}

// Hook simple para verificar permisos sin redirección (para UI condicional)
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
  if (typeof window === 'undefined') return;
  
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
  if (typeof window === 'undefined') return;

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
