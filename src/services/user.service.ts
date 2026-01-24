import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp,
  updateDoc,
  deleteDoc,
  where,
  onSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, UserRole, UserStatus } from '@/shared/types/domain';

const COLLECTION_NAME = 'users';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// In-memory cache
let usersCache: { data: User[], timestamp: number } | null = null;

const mapToUser = (data: DocumentData): User => {
  return {
    ...data as User, // We assume data structure matches, but handle dates below
    role: data.role || 'user', // Default role
    totalOrders: data.totalOrders || 0,
    totalSpent: data.totalSpent || 0,
    lastOrderDate: data.lastOrderDate instanceof Timestamp ? data.lastOrderDate.toDate() : (data.lastOrderDate ? new Date(data.lastOrderDate) : undefined),
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt || Date.now()),
    lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin.toDate() : new Date(data.lastLogin || Date.now()),
    notificationPreferences: data.notificationPreferences || {
      email: true,
      push: false,
      marketing: false
    },
  };
};

export const UserService = {
  // Get all users
  async getAllUsers(forceRefresh = false, includeDeleted = false): Promise<User[]> {
    // Check cache
    if (!forceRefresh && usersCache && (Date.now() - usersCache.timestamp < CACHE_DURATION)) {
      const cachedUsers = usersCache.data;
      return includeDeleted ? cachedUsers : cachedUsers.filter(u => !u.isDeleted);
    }

    let users: User[] = [];

    if (db) {
      try {
        console.log('[UserService] Querying users collection...');
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        console.log(`[UserService] Found ${snapshot.size} users`);

        if (!snapshot.empty) {
          users = snapshot.docs.map((doc) => mapToUser(doc.data()));
        }
      } catch (error) {
        console.error('[UserService] Error fetching users from Firestore:', error);
        // Si falla el orderBy por falta de índice, intentamos sin ordenamiento
        if ((error as any)?.code === 'failed-precondition') {
             console.log('[UserService] Retrying without orderBy...');
             try {
                // Keep the filter
                const q = query(collection(db, COLLECTION_NAME));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    users = snapshot.docs.map((doc) => mapToUser(doc.data()));
                    // Ordenar en memoria
                    users.sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                    });
                }
             } catch (retryError) {
                 console.error('[UserService] Retry failed:', retryError);
                 throw retryError;
             }
        } else {
            throw error;
        }
      }
    }

    // Update cache
    usersCache = {
      data: users,
      timestamp: Date.now()
    };
    
    return includeDeleted ? users : users.filter(u => !u.isDeleted);
  },

  // Subscribe to real-time user updates
  subscribeToUsers(callback: (users: User[]) => void): () => void {
    if (!db) return () => {};

    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs
        .map((doc) => mapToUser(doc.data()))
        .filter(u => !u.isDeleted); // Filter soft-deleted users
      callback(users);
    }, (error) => {
      console.error('Error in user subscription:', error);
    });
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | undefined> {
    const allUsers = await this.getAllUsers();
    return allUsers.find(u => u.id === id);
  },

  // Create or Update user (Sync)
  async syncUser(userData: Partial<User> & { id: string; email: string }): Promise<void> {
    if (!db) return;

    try {
      const userRef = doc(db, COLLECTION_NAME, userData.id);
      
      // We use setDoc with merge: true to update existing fields or create if not exists
      const now = new Date();
      
      const payload: Partial<User> & { updatedAt: Date; lastLogin: Date } = {
        ...userData,
        updatedAt: now,
        lastLogin: now,
      };

      // Ensure defaults for new users
      if (!userData.createdAt) {
         // Check if document exists first to avoid overwriting createdAt? 
         // merge: true preserves existing fields not in payload.
         // But if it's new, we need createdAt. 
         // Actually, simpler to just set createdAt if we are creating.
         // Let's assume the caller handles this or we check existence.
         // For sync, usually we just update lastLogin and basic info.
      }

      await setDoc(userRef, payload, { merge: true });
      
      // Invalidate cache
      usersCache = null;
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error;
    }
  },

  // Update specific user fields (Admin action)
  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    if (!db) return;

    try {
      // Remove undefined values from updates to prevent Firestore errors
      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          (acc as any)[key] = value;
        }
        return acc;
      }, {} as Partial<User>);

      const userRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(userRef, {
        ...cleanUpdates,
        updatedAt: new Date()
      });

      // Invalidate cache
      usersCache = null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Soft Delete user
  async deleteUser(id: string): Promise<void> {
    if (!db) return;

    try {
      const userRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(userRef, {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'inactive' // Optional: Mark as inactive too
      });
      usersCache = null;
    } catch (error) {
      console.error('Error soft deleting user:', error);
      throw error;
    }
  },

  // Restore user
  async restoreUser(id: string): Promise<void> {
    if (!db) return;

    try {
      const userRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(userRef, {
        isDeleted: false,
        deletedAt: null, // or deleteField()
        status: 'active' // Optional: Reactivate
      });
      usersCache = null;
    } catch (error) {
      console.error('Error restoring user:', error);
      throw error;
    }
  },

  // Permanent Delete user (Admin action)
  async permanentDeleteUser(id: string): Promise<void> {
    if (!db) return;

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      usersCache = null;
    } catch (error) {
      console.error('Error permanently deleting user:', error);
      throw error;
    }
  },

  // Seed initial users
  async seedInitialUsers(): Promise<void> {
    if (!db) return;
    
    // Disable seeding in production to prevent overwriting live data
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    console.log('[UserService] Seeding initial users...');

    // 1. Cleanup old dummy users (Fix for "Cliente VIP" reappearing)
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, 'user-vip-1'));
      console.log('[UserService] Cleaned up legacy user-vip-1');
    } catch (e) {
      console.warn('[UserService] Failed to cleanup user-vip-1', e);
    }
    
    // 2. Ensure Admin exists
    const adminUser: User = {
      id: 'admin-user-1',
      email: 'admin@ddreams3d.com',
      username: 'Admin Principal',
      role: 'admin',
      status: 'active',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date(),
      lastLogin: new Date(),
      phoneNumber: '+51 900 000 000'
    };

    // Use setDoc with merge to preserve existing data (like profile changes)
    await setDoc(doc(db, COLLECTION_NAME, adminUser.id), adminUser, { merge: true });
    
    usersCache = null;
  }
};
