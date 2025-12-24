'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../shared/lib/supabase';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales simuladas para el sistema sin backend
const MOCK_CREDENTIALS = [
  {
    username: 'admin',
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      email: 'admin@ddreams3d.com'
    }
  },
  {
    username: 'dreamings.desings.3d@gmail.com',
    password: 'cuentaadmin1',
    user: {
      id: '2',
      username: 'dreamings.desings.3d',
      email: 'dreamings.desings.3d@gmail.com'
    }
  }
];

const AUTH_TOKEN_KEY = 'ddreams_auth_token';
const AUTH_USER_KEY = 'ddreams_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkStoredAuth();
    
    // Escuchar cambios de autenticación de Supabase
    let subscription: { unsubscribe: () => void } | null = null;

    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const userData = {
              id: session.user.id,
              username: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
              email: session.user.email || ''
            };
            setUser(userData);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
          }
          setIsLoading(false);
        }
      );
      subscription = data.subscription;
    } else {
      // Si no hay Supabase, terminamos la carga
      setIsLoading(false);
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const checkStoredAuth = () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      
      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
      // Limpiar datos corruptos
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validar credenciales
      const validCredential = MOCK_CREDENTIALS.find(
        cred => (cred.username === username || cred.user.email === username) && cred.password === password
      );
      
      if (validCredential) {
        // Generar token simulado
        const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Guardar en localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(validCredential.user));
        
        // Actualizar estado
        setUser(validCredential.user);
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      if (!supabase) {
        console.warn('Supabase no está configurado. Login con Google no disponible.');
        return;
      }
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/protegido`
        }
      });
      
      if (error) {
        console.error('Error during Google login:', error);
        setIsLoading(false);
        throw error;
      }
      
      // En el navegador, signInWithOAuth redirige automáticamente
      // No necesitamos hacer nada más aquí
    } catch (error) {
      console.error('Google login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Logout de Supabase
      if (supabase) {
        await supabase.auth.signOut();
      }
      
      // Limpiar localStorage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      
      // Limpiar estado
      setUser(null);
      
      // Redirigir a login
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const checkAuth = (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    return !!(token && storedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
