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

const AUTH_TOKEN_KEY = 'ddreams_auth_token';
const AUTH_USER_KEY = 'ddreams_auth_user';

// Variables globales para control de sincronización (Singleton pattern)
let globalLastSync = 0;
let globalIsSyncing = false;

// [SECURITY PATCH] 
// Las funciones setAdminCookie y removeAdminCookie han sido eliminadas.
// La gestión de cookies de administración ahora es EXCLUSIVA del servidor (HttpOnly).
// El cliente NO debe tener capacidad de manipular estas credenciales.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Global loading (includes profile sync)
  const [isAuthReady, setIsAuthReady] = useState(false); // Strict Firebase Auth ready state
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
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setUser(null);
      } else {
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
    // Escuchar cambios de autenticación directamente desde Firebase
    // Eliminamos la lógica compleja de caché que causaba inconsistencias
    if (!auth) {
      console.warn('[AuthContext] Auth not initialized, checking stored mock data');
      checkStoredAuth();
      setIsLoading(false);
      setIsAuthReady(true);
      return;
    }

    // Configurar persistencia
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthContext] Auth state changed:', firebaseUser ? `User: ${firebaseUser.email}` : 'No user');
      
      try {
        if (firebaseUser) {
          // [OPTIMISTIC UI] 
          // Set user IMMEDIATELY to unblock UI (Fast-Track for AdminProtection)
          // We don't wait for Firestore to confirm identity.
          const tempUser: User = {
            id: firebaseUser.uid,
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            role: 'user', // Default safe until Firestore confirms
          };
          
          // Set optimistic state
          setUserIfChanged(tempUser);
          
          // Unblock global loading immediately too for optimistic UX
          setIsLoading(false); 
          
          // Marcar Auth como listo AHORA que tenemos usuario (evita race condition en AdminProtection)
          setIsAuthReady(true);

          // 0. TOP GLOBAL ARCHITECTURE: Custom Claims Check
          const tokenResult = await firebaseUser.getIdTokenResult();
          const hasAdminClaim = !!tokenResult.claims.admin;
          
          if (hasAdminClaim) {
             console.log('[AuthContext] 🛡️ Acceso Admin validado vía Custom Claims (Top Tier Security)');
          }

          // 1. Intentar obtener datos del usuario desde Firestore (Background Sync)
          // Esto sucede en segundo plano sin bloquear la UI
          const userData = await AuthService.syncUserWithFirestore(firebaseUser, false, hasAdminClaim);
          
          // 2. Actualizar estado con datos reales cuando lleguen
          setUserIfChanged(userData);
          
          // 3. Guardar en localStorage
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
          localStorage.setItem(AUTH_TOKEN_KEY, await firebaseUser.getIdToken());
          
        } else {
          // Usuario NO autenticado
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
          setUserIfChanged(null);
          setIsLoading(false);
          // Marcar Auth como listo (estado final: anonimo)
          setIsAuthReady(true);
        }
      } catch (error) {
        console.error('[AuthContext] Error processing auth state change:', error);
        if (!firebaseUser) {
           localStorage.removeItem(AUTH_USER_KEY);
           setUserIfChanged(null);
        }
        setIsLoading(false);
        setIsAuthReady(true); // Ensure ready even on error
      }
    });

    return () => unsubscribe();
  }, [checkStoredAuth, showError]);

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
    updateUser,
    isAuthReady
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
