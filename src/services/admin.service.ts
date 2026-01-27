import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isSuperAdmin } from '@/config/roles';

export const AdminService = {
  /**
   * Verifies if a user has admin privileges.
   * Checks both the hardcoded list (bootstrap) and the Firestore 'users' collection.
   */
  async checkIsAdmin(uid: string, email: string | null): Promise<boolean> {
    // console.log(`[AdminService] Checking admin status for: ${email} (uid: ${uid})`);
    
    // 1. Check Hardcoded List (Bootstrap/Emergency Access)
    if (isSuperAdmin(email)) {
      // console.debug(`[AdminService] Access granted via hardcoded email: ${email}`);
      return true;
    }

    // console.log(`[AdminService] Hardcoded check failed for: ${email}. Checking Firestore...`);

    // 2. Check Firestore Role
    if (!uid) return false;

    if (!db) {
      console.warn('Firestore not initialized');
      return false;
    }

    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const isAdmin = userData.role === 'admin';
        if (isAdmin) console.debug(`[AdminService] Access granted via Firestore role for uid: ${uid}`);
        return isAdmin;
      }
    } catch (error) {
      console.error('Error checking admin status in Firestore:', error);
    }

    return false;
  },

  /**
   * Promotes a user to admin role.
   * Only callable by an existing admin (enforced by Firestore Rules).
   */
  async grantAdminRole(targetUid: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    const userRef = doc(db, 'users', targetUid);
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: new Date()
    });
  },

  /**
   * Revokes admin role from a user.
   */
  async revokeAdminRole(targetUid: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    const userRef = doc(db, 'users', targetUid);
    await updateDoc(userRef, {
      role: 'user',
      updatedAt: new Date()
    });
  }
};
