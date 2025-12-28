'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/components/ui/ToastManager';
import { isSuperAdmin } from '@/config/roles';

interface User {
  id: string;
  username: string;
  email: string;
  photoURL?: string;
  role?: string;
  // Campos extendidos de perfil
  name?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  updateUser: (data: Partial<User>) => Promise<boolean>;
}

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
    }
  }
];

const AUTH_TOKEN_KEY = 'ddreams_auth_token';
const AUTH_USER_KEY = 'ddreams_auth_user';

// Variables globales para control de sincronización (Singleton pattern)
let globalLastSync = 0;
let globalIsSyncing = false;

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

  const setAdminCookie = () => {
    document.cookie = "ddreams_admin_session=true; path=/; max-age=86400; SameSite=Strict";
  };

  const removeAdminCookie = () => {
    document.cookie = "ddreams_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  // Inicializar estado desde localStorage después del montaje para evitar errores de hidratación
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
    // Si Firebase no está configurado, verificar sesión mock y salir
    if (!auth) {
      checkStoredAuth();
      setIsLoading(false);
      return;
    }

    // Asegurar persistencia local
    setPersistence(auth, browserLocalPersistence)
      .catch(() => {}); // Silenciar error de persistencia si ocurre

    // Escuchar cambios de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 1. Evitar sincronizaciones concurrentes (Global lock)
        if (globalIsSyncing) return;
        
        // 2. Throttle global en memoria (5 segundos) para evitar rebotes rápidos
        const now = Date.now();
        if (now - globalLastSync < 5000) {
           setIsLoading(false);
           return;
        }

        // 3. Verificar si necesitamos sincronizar con Firestore (5 minutos persistente)
        const lastSyncTimeStr = localStorage.getItem('last_auth_sync');
        const lastSyncTime = lastSyncTimeStr ? parseInt(lastSyncTimeStr) : 0;
        const shouldSync = !lastSyncTime || (now - lastSyncTime > 5 * 60 * 1000);
        
        // 4. Verificar caché local
        const storedUserJson = localStorage.getItem(AUTH_USER_KEY);
        let storedUser: User | null = null;
        try {
          if (storedUserJson) storedUser = JSON.parse(storedUserJson);
        } catch (e) { console.error(e); }

        // Si tenemos usuario local, coincide el ID y no toca sincronizar, usamos caché local
        if (storedUser && storedUser.id === firebaseUser.uid && !shouldSync) {
            setUserIfChanged(storedUser);
            setIsLoading(false);
            return;
        }

        // Iniciar sincronización
        globalIsSyncing = true;

        // Usuario base de Firebase
        const userData: User = {
          id: firebaseUser.uid,
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || '',
        };

        // Sincronizar con Firestore
        try {
          // Actualizar timestamps
          if (shouldSync) {
            globalLastSync = now;
            localStorage.setItem('last_auth_sync', now.toString());
          }

          const userRef = doc(db, 'users', firebaseUser.uid);
          
          // Leer de Firestore
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            // Crear nuevo usuario
            const initialRole = isSuperAdmin(firebaseUser.email) ? 'admin' : 'user';
            
            await setDoc(userRef, {
              ...userData,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              role: initialRole,
              isActive: true
            });
            userData.role = initialRole;
          } else {
            // Usuario existente
            const currentData = userSnap.data();
            let userRole = currentData.role || 'user';
            
            // Forzar admin si corresponde
            if (isSuperAdmin(firebaseUser.email) && userRole !== 'admin') {
              userRole = 'admin';
              await setDoc(userRef, { role: 'admin' }, { merge: true });
            }

            userData.role = userRole; 
            
            // Completar datos del perfil
            userData.name = currentData.name || userData.username;
            userData.phone = currentData.phone;
            userData.address = currentData.address;
            userData.birthDate = currentData.birthDate;
            
            // Actualizar lastLogin si toca sync
            if (shouldSync) {
              await setDoc(userRef, {
                lastLogin: serverTimestamp()
              }, { merge: true });
            }
          }
        } catch (error) {
          console.error('Error syncing user to Firestore:', error);
        } finally {
          globalIsSyncing = false;
        }

        setUserIfChanged(userData);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
        localStorage.setItem(AUTH_TOKEN_KEY, await firebaseUser.getIdToken());
        
        // Set admin cookie if user has admin role
        if (userData.role === 'admin' || isSuperAdmin(userData.email)) {
          setAdminCookie();
        } else {
          removeAdminCookie();
        }
      } else {
        // No hay usuario de Firebase
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token && token.startsWith('mock_token_')) {
          checkStoredAuth();
        } else {
          // Logout real
          if (user) { 
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
            removeAdminCookie();
            setUserIfChanged(null);
          }
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkStoredAuth = () => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      
      if (storedUser && token) {
        // Si hay datos en localStorage pero no en Firebase (o Firebase aún no cargó),
        // podría ser una sesión mock.
        // Pero si onAuthStateChanged disparó 'null', significa que Firebase ya verificó y no hay sesión real.
        // Solo restauramos si parece ser una sesión mock (token empieza con mock_)
        if (token.startsWith('mock_token_')) {
          setUser(JSON.parse(storedUser));
        } else {
          // Si era token real pero Firebase dice null, limpiamos
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
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 1. Intentar Login con Firebase (Email/Password)
      if (auth) {
        try {
          await signInWithEmailAndPassword(auth, username, password);
          return true; // onAuthStateChanged manejará el estado
        } catch (firebaseError: any) {
          // Si falla Firebase, intentar Mock silenciosamente
        }
      }
      
      // 2. Intentar Mock Credentials
        const validCredential = MOCK_CREDENTIALS.find(
          cred => (cred.username === username || cred.user.email === username) && cred.password === password
        );
        
        if (validCredential) {
          const token = `mock_token_${Date.now()}`;
          const userData = validCredential.user;
          
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
          setUser(userData);
          return true;
        }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      if (!auth) {
        showError('Error', 'Firebase no está configurado. No se puede iniciar sesión con Google.');
        return;
      }
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged manejará el resto
      showSuccess('Bienvenido', 'Has iniciado sesión con Google correctamente');
    } catch (error: any) {
      console.error('Google login failed:', error);
      showError('Error de inicio de sesión', error.message || 'No se pudo iniciar sesión con Google');
      setIsLoading(false);
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      // Si es un usuario legacy (mock), solo actualizamos localStorage
      if (user.id === 'admin-legacy' || user.id.startsWith('mock_')) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
        showSuccess('Perfil actualizado', 'Datos guardados localmente (Modo Mock)');
        return true;
      }

      // Usuario Firebase
      if (!db) {
        throw new Error('Firebase no está configurado');
      }
      const userRef = doc(db, 'users', user.id);
      
      // Update in Firestore
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
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
      if (auth) {
        await signOut(auth);
      }
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
