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
  };
};

export const UserService = {
  // Get all users
  async getAllUsers(forceRefresh = false): Promise<User[]> {
    // Check cache
    if (!forceRefresh && usersCache && (Date.now() - usersCache.timestamp < CACHE_DURATION)) {
      return usersCache.data;
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
    
    return users;
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

  // Delete user (Admin action)
  async deleteUser(id: string): Promise<void> {
    if (!db) return;

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      usersCache = null;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Seed initial users
  async seedInitialUsers(): Promise<void> {
    if (!db) return;
    
    // We force upsert of dummy users to ensure latest data structure (stats in Soles)
    // In a real app, this would be a migration script
    const dummyUsers: User[] = [
      {
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
      },
      {
        id: 'user-demo-1',
        email: 'cliente@ejemplo.com',
        username: 'Cliente Demo',
        role: 'user',
        status: 'active',
        totalOrders: 5,
        totalSpent: 450.50, // S/. 450.50
        lastOrderDate: new Date('2024-02-15'),
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date(),
        lastLogin: new Date(),
      },
       {
        id: 'user-banned-1',
        email: 'spammer@malicioso.com',
        username: 'Spammer',
        role: 'user',
        status: 'banned',
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        lastLogin: new Date('2024-01-01')
      },
      {
        id: 'user-vip-1',
        email: 'vip@cliente.com',
        username: 'Cliente VIP',
        role: 'user',
        status: 'active',
        totalOrders: 25,
        totalSpent: 3500.00, // S/. 3500.00
        lastOrderDate: new Date('2024-03-01'),
        createdAt: new Date('2023-03-10'),
        updatedAt: new Date(),
        lastLogin: new Date(),
      }
    ];

    for (const user of dummyUsers) {
      await setDoc(doc(db, COLLECTION_NAME, user.id), user);
    }
    
    usersCache = null;
  }
};
