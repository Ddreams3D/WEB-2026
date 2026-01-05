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
    const userData: User = {
      id: firebaseUser.uid,
      username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || '',
      role: isSuperAdmin(firebaseUser.email) ? 'admin' : 'user'
    };

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
      // Handle popup errors/fallbacks here if needed, or propagate
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
         throw error;
      }
      // Attempt redirect fallback for network/internal errors
      if (error.code === 'auth/network-request-failed' || error.message?.includes('INTERNAL ASSERTION FAILED')) {
         const redirectProvider = new GoogleAuthProvider();
         await signInWithRedirect(auth, redirectProvider);
         return { success: true, isNewUser: false };
      }
      throw error;
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
