'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useB2B } from '@/contexts/B2BContext';
// import { Company, CompanyUser } from '@/contexts/B2BContext';
// TODO: Definir tipos cuando estén disponibles
interface Company {
  id: string;
  name: string;
  // ... otros campos
}

interface B2BAuthState {
  isB2BUser: boolean;
  currentCompany: Company | null;
  userRole: string | null;
  permissions: string[];
  isLoading: boolean;
  error: string | null;
}

interface B2BAuthActions {
  switchCompany: (companyId: string) => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  checkPermission: (permission: string) => boolean;
  refreshB2BData: () => Promise<void>;
  logout: () => Promise<void>;
}

type UseB2BAuthReturn = B2BAuthState & B2BAuthActions;

/**
 * Hook personalizado para manejar la autenticación y autorización B2B
 * Proporciona funcionalidades específicas para usuarios empresariales
 */
export const useB2BAuth = (): UseB2BAuthReturn => {
  const { user, logout: authLogout } = useAuth();
  const { 
    currentCompany, 
    isB2BUser, 
    switchCompany: b2bSwitchCompany,
    updateCompany
  } = useB2B();
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Definir permisos por rol
  const rolePermissions: Record<string, string[]> = {
    admin: [
      'manage_company',
      'manage_users',
      'view_all_quotes',
      'create_quotes',
      'edit_quotes',
      'delete_quotes',
      'view_all_orders',
      'manage_billing',
      'view_invoices',
      'create_invoices',
      'edit_invoices',
      'delete_invoices',
      'manage_contracts',
      'view_analytics',
      'export_data'
    ],
    manager: [
      'view_company',
      'view_all_quotes',
      'create_quotes',
      'edit_quotes',
      'view_all_orders',
      'view_invoices',
      'create_invoices',
      'edit_invoices',
      'view_contracts',
      'create_contracts',
      'view_analytics'
    ],
    employee: [
      'view_company',
      'view_own_quotes',
      'create_quotes',
      'view_own_orders',
      'view_own_invoices',
      'view_own_contracts'
    ],
    viewer: [
      'view_company',
      'view_own_quotes',
      'view_own_orders',
      'view_own_invoices',
      'view_own_contracts'
    ]
  };

  // Cargar datos del usuario B2B al montar el componente
  useEffect(() => {
    if (user && isB2BUser && currentCompany) {
      loadUserB2BData();
    }
  }, [user, isB2BUser, currentCompany]);

  /**
   * Cargar datos específicos del usuario B2B
   */
  const loadUserB2BData = async () => {
    if (!user || !currentCompany) return;

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implementar búsqueda de usuario en empresa
      // const companyUser = currentCompany.users.find(
      //   (u: CompanyUser) => u.email === user.email
      // );
      const companyUser = null; // Temporal

      if (companyUser) {
        // TODO: Implementar cuando companyUser tenga la estructura correcta
        // setUserRole(companyUser.role);
        // setPermissions(rolePermissions[companyUser.role] || []);
        setUserRole('employee'); // Temporal
        setPermissions(rolePermissions['employee'] || []);
      } else {
        // Usuario no encontrado en la empresa
        setUserRole(null);
        setPermissions([]);
        setError('Usuario no autorizado para esta empresa');
      }
    } catch (err) {
      setError('Error al cargar datos del usuario B2B');
      console.error('Error loading B2B user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cambiar de empresa
   */
  const switchCompany = async (companyId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implementar cambio de empresa cuando esté disponible
      await b2bSwitchCompany(companyId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar de empresa');
      console.error('Error switching company:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualizar rol de usuario
   */
  const updateUserRole = async (userId: string, role: string): Promise<void> => {
    if (!currentCompany) {
      throw new Error('No hay empresa seleccionada');
    }

    if (!checkPermission('manage_users')) {
      throw new Error('No tienes permisos para gestionar usuarios');
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implementar actualización de usuario cuando esté disponible
      console.warn('updateUserRole no implementado');
      throw new Error('Función no implementada');
    } catch (err) {
      setError('Error al actualizar rol de usuario');
      console.error('Error updating user role:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  const checkPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  /**
   * Refrescar datos B2B
   */
  const refreshB2BData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implementar carga de empresas cuando esté disponible
      await loadUserB2BData();
    } catch (err) {
      setError('Error al refrescar datos B2B');
      console.error('Error refreshing B2B data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Limpiar datos B2B
      setUserRole(null);
      setPermissions([]);
      setError(null);
      
      // Cerrar sesión general
      authLogout();
    } catch (err) {
      setError('Error al cerrar sesión');
      console.error('Error during logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estado
    isB2BUser,
    currentCompany,
    userRole,
    permissions,
    isLoading,
    error,
    
    // Acciones
    switchCompany,
    updateUserRole,
    checkPermission,
    refreshB2BData,
    logout
  };
};

export default useB2BAuth;