import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  signInWithEmailAndPassword,
  signOut, 
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '../types/auth.types';
import { isSuperAdmin } from '@/config/roles';

export const AuthService = {
  async syncUserWithFirestore(firebaseUser: FirebaseUser, shouldSync: boolean): Promise<User> {
    if (!db) throw new Error('Firestore is not initialized');

    const userRef = doc(db, 'users', firebaseUser.uid);
    
    // Base user data from Firebase Auth
    // Ensure no undefined values are passed to Firestore (though ignoreUndefinedProperties is now enabled)
    const userData: User = {
      id: firebaseUser.uid,
      username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || '',
      role: isSuperAdmin(firebaseUser.email) ? 'admin' : 'user',
    };

    if (firebaseUser.phoneNumber) {
      userData.phoneNumber = firebaseUser.phoneNumber;
    }

    try {
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user
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
        // Existing user
        const currentData = userSnap.data();
        let userRole = currentData.role || 'user';
        
        // Force admin if applicable
        if (isSuperAdmin(firebaseUser.email) && userRole !== 'admin') {
          userRole = 'admin';
          await setDoc(userRef, { role: 'admin' }, { merge: true });
        }

        userData.role = userRole;
        userData.name = currentData.name || userData.username;
        userData.phone = currentData.phone;
        userData.phoneNumber = currentData.phoneNumber || userData.phoneNumber;
        userData.address = currentData.address;
        userData.birthDate = currentData.birthDate;
        userData.addresses = currentData.addresses;
        userData.favorites = currentData.favorites;
        userData.notificationPreferences = currentData.notificationPreferences;

        // Update lastLogin if needed
        if (shouldSync) {
          await setDoc(userRef, {
            lastLogin: serverTimestamp()
          }, { merge: true });
        }
      }
      return userData;
    } catch (error) {
      console.error('Error syncing user to Firestore:', error);
      throw error;
    }
  },

  async loginWithEmail(email: string, password: string): Promise<void> {
    if (!auth) throw new Error('Firebase Auth not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  },

  async registerWithEmail(email: string, password: string): Promise<void> {
    if (!auth) throw new Error('Firebase Auth not initialized');
    await createUserWithEmailAndPassword(auth, email, password);
  },

  async loginWithGoogle(): Promise<{ success: boolean; isNewUser: boolean }> {
    if (!auth) throw new Error('Firebase Auth not initialized');
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const additionalUserInfo = getAdditionalUserInfo(result);
      return { 
        success: true, 
        isNewUser: additionalUserInfo?.isNewUser || false 
      };
    } catch (error: any) {
      console.error('Login error (Popup):', error);

      // 1. Si el usuario cerró el popup explícitamente, no hacemos nada más.
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
         throw error;
      }

      // 2. Para cualquier otro error (popup bloqueado, error de red, "Unable to open", etc.), intentamos Redirect.
      // El error "Failed to execute 'open' on 'Window'" es común en entornos restringidos.
      try {
         console.log('Falling back to signInWithRedirect...');
         const redirectProvider = new GoogleAuthProvider();
         await signInWithRedirect(auth, redirectProvider);
         // El navegador redireccionará, por lo que este return no suele alcanzarse, 
         // pero mantenemos la firma de la función.
         return { success: true, isNewUser: false };
      } catch (redirectError) {
         console.error('Login error (Redirect):', redirectError);
         // Si falla también el redirect, lanzamos el error original para que el UI muestre algo.
         throw error;
      }
    }
  },

  async logout(): Promise<void> {
    if (auth) {
      await signOut(auth);
    }
  },

  async updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
};
