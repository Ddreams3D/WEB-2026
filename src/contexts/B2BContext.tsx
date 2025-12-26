'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Company {
  id: string;
  name: string;
  ruc: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  paymentTerms: number; // días
  creditLimit: number;
  isActive: boolean;
  createdAt: string;
  description?: string;
  website?: string;
  employeeCount?: number;
}

interface B2BUser {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  permissions: string[];
  isActive: boolean;
}

interface B2BContextType {
  // Estado
  currentCompany: Company | null;
  currentUser: B2BUser | null;
  isB2BUser: boolean;
  loading: boolean;
  
  // Funciones
  loginB2B: (email: string, password: string) => Promise<boolean>;
  logoutB2B: () => void;
  restoreB2BSession: () => boolean;
  updateCompany: (data: Partial<Company>) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  switchCompany: (companyId: string) => Promise<boolean>;
}

const B2BContext = createContext<B2BContextType | undefined>(undefined);

export const useB2B = () => {
  const context = useContext(B2BContext);
  if (context === undefined) {
    throw new Error('useB2B must be used within a B2BProvider');
  }
  return context;
};

interface B2BProviderProps {
  children: ReactNode;
}

export const B2BProvider: React.FC<B2BProviderProps> = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentUser, setCurrentUser] = useState<B2BUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializar estado desde localStorage después del montaje para evitar errores de hidratación
  useEffect(() => {
    try {
      const savedCompany = localStorage.getItem('b2b_company');
      if (savedCompany) {
        setCurrentCompany(JSON.parse(savedCompany));
      }
      
      const savedUser = localStorage.getItem('b2b_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error restoring B2B session:', e);
    }
  }, []);

  const isB2BUser = currentUser !== null && currentCompany !== null;

  // Simular carga inicial
  useEffect(() => {
    const initializeB2B = async () => {
      try {
        // Intentar restaurar sesión si existe
        restoreB2BSession();
        setLoading(false);
      } catch (error) {
        console.error('Error initializing B2B:', error);
        setLoading(false);
      }
    };

    initializeB2B();
  }, []);

  const loginB2B = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simular autenticación B2B
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data para desarrollo
      const mockUser: B2BUser = {
        id: '1',
        companyId: '1',
        name: 'Juan Pérez',
        email: email,
        role: 'admin',
        permissions: ['quotes', 'orders', 'billing', 'legal'],
        isActive: true
      };
      
      const mockCompany: Company = {
        id: '1',
        name: 'Empresa Demo S.A.C.',
        ruc: '20123456789',
        email: 'contacto@empresademo.com',
        phone: '+51 999 888 777',
        address: 'Av. Principal 123, Lima, Perú',
        contactPerson: 'Juan Pérez',
        industry: 'Manufactura',
        size: 'medium',
        paymentTerms: 30,
        creditLimit: 50000,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      setCurrentUser(mockUser);
      setCurrentCompany(mockCompany);
      
      // Guardar en localStorage
      localStorage.setItem('b2b_user', JSON.stringify(mockUser));
      localStorage.setItem('b2b_company', JSON.stringify(mockCompany));
      
      return true;
    } catch (error) {
      console.error('B2B login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutB2B = () => {
    setCurrentUser(null);
    setCurrentCompany(null);
    localStorage.removeItem('b2b_user');
    localStorage.removeItem('b2b_company');
  };

  const restoreB2BSession = () => {
    try {
      const savedUser = localStorage.getItem('b2b_user');
      const savedCompany = localStorage.getItem('b2b_company');
      
      if (savedUser && savedCompany) {
        setCurrentUser(JSON.parse(savedUser));
        setCurrentCompany(JSON.parse(savedCompany));
        return true;
      }
    } catch (error) {
      console.error('Error restoring B2B session:', error);
    }
    return false;
  };

  const updateCompany = async (data: Partial<Company>): Promise<boolean> => {
    if (!currentCompany) return false;
    
    try {
      const updatedCompany = { ...currentCompany, ...data };
      setCurrentCompany(updatedCompany);
      localStorage.setItem('b2b_company', JSON.stringify(updatedCompany));
      return true;
    } catch (error) {
      console.error('Error updating company:', error);
      return false;
    }
  };

  const hasPermission = (permission: string): boolean => {
    return currentUser?.permissions.includes(permission) || false;
  };

  const switchCompany = async (companyId: string): Promise<boolean> => {
    // Implementar cambio de empresa para usuarios multi-empresa
    try {
      // Mock implementation
      return true;
    } catch (error) {
      console.error('Error switching company:', error);
      return false;
    }
  };

  const value: B2BContextType = {
    currentCompany,
    currentUser,
    isB2BUser,
    loading,
    loginB2B,
    logoutB2B,
    restoreB2BSession,
    updateCompany,
    hasPermission,
    switchCompany
  };

  return (
    <B2BContext.Provider value={value}>
      {children}
    </B2BContext.Provider>
  );
};

export default B2BProvider;