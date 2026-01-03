'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
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
  address?: string; // Dirección principal (legacy)
  addresses?: Address[]; // Lista de direcciones
  favorites?: string[]; // Lista de IDs de productos favoritos
  birthDate?: string;
}

export interface Address {
  id: string;
  label: string; // "Casa", "Trabajo", etc.
  recipientName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<{ success: boolean; isNewUser: boolean }>;
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

  const checkStoredAuth = React.useCallback(() => {
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
    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
        if (isLoading) {
            console.warn('[AuthContext] Safety timeout triggered. Forcing isLoading=false');
            setIsLoading(false);
        }
    }, 5000);

    console.log('[AuthContext] Initializing auth check...');
    // Si Firebase no está configurado, verificar sesión mock y salir
    if (!auth) {
      console.log('[AuthContext] No auth instance, checking stored auth');
      checkStoredAuth();
      setIsLoading(false);
      clearTimeout(safetyTimeout);
      return;
    }

    // Asegurar persistencia local
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log('[AuthContext] Persistence set'))
      .catch((firebaseError: unknown) => {
        console.error("Error setting persistence:", firebaseError);
      });

    // Escuchar cambios de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthContext] Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
      clearTimeout(safetyTimeout);
      
      try {
        if (firebaseUser) {
          // 1. Evitar sincronizaciones concurrentes (Global lock)
          if (globalIsSyncing) {
              console.log('[AuthContext] Sync in progress, skipping');
              return;
          }
          
          // 2. Throttle global en memoria (5 segundos) para evitar rebotes rápidos
          const now = Date.now();
          if (now - globalLastSync < 5000) {
             console.log('[AuthContext] Throttled sync');
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
              console.log('[AuthContext] Using cached user');
              setUserIfChanged(storedUser);
              setIsLoading(false);
              return;
          }

          // Iniciar sincronización
          console.log('[AuthContext] Starting sync...');
          globalIsSyncing = true;

          // Usuario base de Firebase
          const userData: User = {
            id: firebaseUser.uid,
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            role: isSuperAdmin(firebaseUser.email) ? 'admin' : 'user'
          };

          // Sincronizar con Firestore
          try {
            // Actualizar timestamps
            if (shouldSync) {
              globalLastSync = now;
              localStorage.setItem('last_auth_sync', now.toString());
            }

            if (!db) {
               console.warn('Firestore is not initialized, skipping user sync');
               throw new Error('Firestore is not initialized');
            }
            const firestore = db;

            const userRef = doc(firestore, 'users', firebaseUser.uid);
            
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
            // En caso de error de red, usar datos básicos de auth
            showError('Conexión inestable', 'No se pudieron sincronizar todos los datos, pero puedes continuar.');
          } finally {
            console.log('[AuthContext] Sync finished');
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
          console.log('[AuthContext] No firebase user');
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
      } catch (globalError) {
          console.error('Critical Auth Error:', globalError);
          // Fallback para evitar bloqueo total
          setIsLoading(false);
      }
      setIsLoading(false);
    }, (error) => {
         // Manejador de errores del observer de Firebase
         console.error('Firebase Auth Observer Error:', error);
         setIsLoading(false);
         // Type assertion safely since Firebase errors usually have a code property
         const firebaseError = error as { code?: string; message?: string };
         if (firebaseError.code === 'auth/network-request-failed') {
              showError('Error de red', 'Verifica tu conexión a internet.');
         }
     });

    return () => unsubscribe();
  }, [checkStoredAuth]);



  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 1. Intentar Login con Firebase (Email/Password)
      if (auth) {
        try {
          await signInWithEmailAndPassword(auth, username, password);
          return true; // onAuthStateChanged manejará el estado
        } catch (firebaseError: unknown) {
          // Tipado seguro del error
          const fbError = firebaseError as { code?: string; message?: string };
          console.warn('[AuthContext] Firebase login failed:', fbError.code, fbError.message);
          
          if (fbError.code === 'auth/network-request-failed') {
             showError('Error de conexión', 'No se pudo conectar con el servidor. Verificando acceso local...');
             // No retornamos false aquí para permitir que intente el Mock (acceso de emergencia/legacy)
             // pero ya le avisamos al usuario que hay un problema de red.
          }
        }
      }
      
      // 2. Intentar Mock Credentials (SOLO DESARROLLO)
      // Esto permite trabajar offline o sin configurar Firebase en local
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
      if (auth) {
        await createUserWithEmailAndPassword(auth, email, password);
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudo crear la cuenta';
      showError('Error de registro', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; isNewUser: boolean }> => {
    try {
      if (!auth) {
        showError('Error', 'Firebase no está configurado. No se puede iniciar sesión con Google.');
        return { success: false, isNewUser: false };
      }
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const additionalUserInfo = getAdditionalUserInfo(result);
      const isNewUser = additionalUserInfo?.isNewUser || false;

      // onAuthStateChanged manejará el resto
      showSuccess('Bienvenido', 'Has iniciado sesión con Google correctamente');
      return { success: true, isNewUser };
    } catch (error: unknown) {
      console.error('Google login failed:', error);
      
      const fbError = error as { code?: string; message?: string };
      
      if (fbError.code === 'auth/network-request-failed') {
        showError('Error de conexión', 'No se pudo conectar con los servidores de Google. Verifica tu internet.');
      } else if (fbError.code === 'auth/popup-closed-by-user') {
        // User closed popup, just ignore or show mild warning
        console.log('User closed Google popup');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'No se pudo iniciar sesión con Google';
        showError('Error de inicio de sesión', errorMessage);
      }
      
      setIsLoading(false);
      return { success: false, isNewUser: false };
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
    } catch (error: unknown) {
      console.error('Error updating user:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudo actualizar el perfil';
      showError('Error', errorMessage);
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
