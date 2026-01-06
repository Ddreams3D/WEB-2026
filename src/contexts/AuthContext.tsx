'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  onAuthStateChanged, 
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/ToastManager';
import { isSuperAdmin } from '@/config/roles';
import { User, AuthContextType } from '@/features/auth/types/auth.types';
import { AuthService } from '@/features/auth/services/auth.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales simuladas para fallback (admin legacy)
const MOCK_CREDENTIALS = [
  {
    username: 'admin',
    password: 'admin123',
    user: {
      id: 'admin-legacy',
      username: 'Admin User',
      email: 'admin@ddreams3d.com',
      role: 'admin'
    } as User
  }
];

const AUTH_TOKEN_KEY = 'ddreams_auth_token';
const AUTH_USER_KEY = 'ddreams_auth_user';

// Variables globales para control de sincronización (Singleton pattern)
let globalLastSync = 0;
let globalIsSyncing = false;

const setAdminCookie = () => {
  document.cookie = "ddreams_admin_session=true; path=/; max-age=86400; SameSite=Strict";
};

const removeAdminCookie = () => {
  document.cookie = "ddreams_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const isAuthenticated = !!user;

  // Función auxiliar para comparar usuarios y evitar re-renders innecesarios
  const setUserIfChanged = (newUser: User | null) => {
    setUser(prevUser => {
      if (JSON.stringify(prevUser) === JSON.stringify(newUser)) {
        return prevUser;
      }
      return newUser;
    });
  };

  const checkStoredAuth = useCallback(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      
      if (storedUser && token) {
        if (token.startsWith('mock_token_')) {
          // Solo permitir tokens mock en desarrollo
          if (process.env.NODE_ENV === 'development') {
            setUserIfChanged(JSON.parse(storedUser));
          } else {
            console.warn('[AuthContext] Mock token detected in production. Clearing session.');
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
            removeAdminCookie();
            setUserIfChanged(null);
          }
        } else {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
          removeAdminCookie();
          setUser(null);
        }
      } else {
        removeAdminCookie();
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
      setUser(null);
    }
  }, []);

  // Inicializar estado desde localStorage después del montaje
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (storedUser) {
        setUserIfChanged(JSON.parse(storedUser));
      }
    } catch (e) {
      // Ignore error parsing stored user
    }
  }, []);

  // Verificar autenticación al cargar la aplicación con Firebase
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
        if (isLoading) {
            console.warn('[AuthContext] Safety timeout triggered. Forcing isLoading=false');
            setIsLoading(false);
        }
    }, 5000);

    console.log('[AuthContext] Initializing auth check...');
    if (!auth) {
      console.log('[AuthContext] No auth instance, checking stored auth');
      checkStoredAuth();
      setIsLoading(false);
      clearTimeout(safetyTimeout);
      return;
    }

    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log('[AuthContext] Persistence set'))
      .catch((err) => console.error("Error setting persistence:", err));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthContext] Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
      clearTimeout(safetyTimeout);
      
      try {
        if (firebaseUser) {
          if (globalIsSyncing) return;
          
          const now = Date.now();
          if (now - globalLastSync < 5000) {
             setIsLoading(false);
             return;
          }

          const lastSyncTimeStr = localStorage.getItem('last_auth_sync');
          const lastSyncTime = lastSyncTimeStr ? parseInt(lastSyncTimeStr) : 0;
          const shouldSync = !lastSyncTime || (now - lastSyncTime > 5 * 60 * 1000);
          
          const storedUserJson = localStorage.getItem(AUTH_USER_KEY);
          let storedUser: User | null = null;
          try {
            if (storedUserJson) storedUser = JSON.parse(storedUserJson);
          } catch (e) { console.error(e); }

          if (storedUser && storedUser.id === firebaseUser.uid && !shouldSync) {
              setUserIfChanged(storedUser);
              setIsLoading(false);
              return;
          }

          globalIsSyncing = true;

          try {
            if (shouldSync) {
              globalLastSync = now;
              localStorage.setItem('last_auth_sync', now.toString());
            }

            const userData = await AuthService.syncUserWithFirestore(firebaseUser, shouldSync);
            
            setUserIfChanged(userData);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
            localStorage.setItem(AUTH_TOKEN_KEY, await firebaseUser.getIdToken());
            
            if (userData.role === 'admin' || isSuperAdmin(userData.email)) {
              setAdminCookie();
            } else {
              removeAdminCookie();
            }
          } catch (error) {
            console.error('Error syncing user:', error);
            showError('Conexión inestable', 'No se pudieron sincronizar todos los datos.');
          } finally {
            globalIsSyncing = false;
          }
        } else {
          // No user
          const token = localStorage.getItem(AUTH_TOKEN_KEY);
          if (token && token.startsWith('mock_token_')) {
            checkStoredAuth();
          } else {
            if (user) { 
              localStorage.removeItem(AUTH_TOKEN_KEY);
              localStorage.removeItem(AUTH_USER_KEY);
              removeAdminCookie();
              setUserIfChanged(null);
            }
          }
        }
      } catch (globalError) {
          console.error('Critical Auth Error:', globalError);
          setIsLoading(false);
      }
      setIsLoading(false);
    }, (error) => {
         console.error('Firebase Auth Observer Error:', error);
         setIsLoading(false);
         const firebaseError = error as { code?: string; message?: string };
         if (firebaseError.code === 'auth/network-request-failed') {
              showError('Error de red', 'Verifica tu conexión a internet.');
         }
     });

    return () => unsubscribe();
  }, [checkStoredAuth, showError, isLoading, user]); // Incluye dependencias para satisfacer linter

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (auth) {
        try {
          await AuthService.loginWithEmail(username, password);
          return true;
        } catch (firebaseError: any) {
          console.warn('[AuthContext] Firebase login failed:', firebaseError.code, firebaseError.message);
          if (firebaseError.code === 'auth/network-request-failed') {
             showError('Error de conexión', 'No se pudo conectar con el servidor.');
          }
        }
      }
      
      // Mock Credentials (DEV ONLY)
      if (process.env.NODE_ENV === 'development') {
        const validCredential = MOCK_CREDENTIALS.find(
          cred => (cred.username === username || cred.user.email === username) && cred.password === password
        );
        
        if (validCredential) {
          console.warn('[AuthContext] Using MOCK credentials (DEV ONLY)');
          const token = `mock_token_${Date.now()}`;
          const userData = validCredential.user;
          
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
          setUser(userData);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await AuthService.registerWithEmail(email, password);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      showError('Error de registro', error.message || 'No se pudo crear la cuenta');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; isNewUser: boolean }> => {
    try {
      setIsLoading(true);
      const result = await AuthService.loginWithGoogle();
      showSuccess('Bienvenido', 'Has iniciado sesión con Google correctamente');
      return result;
    } catch (error: any) {
      console.error('Google login failed:', error);
      
      if (error.code === 'auth/network-request-failed') {
          showError('Error de conexión', 'Verifica tu conexión a internet.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed Google popup');
      } else {
        showError('Error de inicio de sesión', error.message || 'No se pudo iniciar sesión');
      }
      
      setIsLoading(false);
      return { success: false, isNewUser: false };
    }
  };

  const updateUser = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      // Mock user
      if (user.id === 'admin-legacy' || user.id.startsWith('mock_')) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
        showSuccess('Perfil actualizado', 'Datos guardados localmente (Modo Mock)');
        return true;
      }

      await AuthService.updateUserProfile(user.id, data);
      
      // Update local state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
      
      showSuccess('Perfil actualizado', 'Tus datos se han guardado correctamente');
      return true;
    } catch (error: any) {
      console.error('Error updating user:', error);
      showError('Error', error.message || 'No se pudo actualizar el perfil');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const checkAuth = (): boolean => {
    return !!user;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    checkAuth,
    updateUser
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
