import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp,
  DocumentData,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppNotification } from '@/shared/types/domain';

const COLLECTION_NAME = 'notifications';

const mapToNotification = (id: string, data: DocumentData): AppNotification => {
  return {
    ...data,
    id,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
  } as AppNotification;
};

export const NotificationService = {
  // Subscribe to notifications for a user (or system-wide if userId is null/undefined)
  subscribeToNotifications(userId: string | undefined, callback: (notifications: AppNotification[]) => void) {
    if (!db) return () => {};

    let q;
    
    // If userId is provided, get user's notifications + system-wide (userId == null)
    // Firestore OR queries are limited, so we might need two listeners or just fetch user specific ones.
    // For now, let's keep it simple:
    // - Admin sees everything? No, admin sees system notifications + their own.
    // - User sees their own.
    
    // Let's assume for now we pass userId. If userId is admin, we might want to fetch all system notifications.
    // But typically "userId" field in notification means "target user".
    // If "userId" is missing, it means broadcast/admin notification.
    
    if (userId) {
       // Query for notifications targeted to this user OR system notifications (where userId is null)
       // Firestore doesn't support OR in a simple way with complex ordering easily without indexes.
       // Let's stick to simple query: Target specific user.
       q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
    } else {
      // System wide notifications (for admins)
      // Or maybe we want to show ALL notifications to admin? 
      // Usually admin wants to see "Orders placed", "Errors", etc. which might be system notifications.
      q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', null), // System notifications
        orderBy('createdAt', 'desc'),
        limit(50)
      );
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const notifications = snapshot.docs.map(doc => mapToNotification(doc.id, doc.data()));
        callback(notifications);
      },
      (error) => {
        console.error('Error in notification subscription:', error);
        // We could call callback([]) or handle error state if we had a way to propagate it
      }
    );

    return unsubscribe;
  },

  // Subscribe to ALL notifications (for Super Admin debug or monitoring)
  subscribeToAllNotifications(callback: (notifications: AppNotification[]) => void) {
    if (!db) return () => {};
    
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, 
      (snapshot) => {
        const notifications = snapshot.docs.map(doc => mapToNotification(doc.id, doc.data()));
        callback(notifications);
      },
      (error) => {
        console.error('Error in all notifications subscription:', error);
      }
    );
  },

  async createNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) {
    if (!db) return;

    try {
      // Ensure userId is null if undefined, to match the query 'where userId == null'
      const data = {
        ...notification,
        userId: notification.userId || null,
        read: false,
        createdAt: Timestamp.now()
      };
      
      await addDoc(collection(db, COLLECTION_NAME), data);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: string) {
    if (!db) return;
    const ref = doc(db, COLLECTION_NAME, notificationId);
    await updateDoc(ref, { read: true });
  },

  async markAllAsRead(userId?: string) {
    if (!db) return;
    
    // This requires finding all unread notifications first
    // For performance, we might want to batch this.
    // But for now, let's keep it simple or skip implementation if too heavy.
    // A better approach is to have a "lastReadTimestamp" on User profile, but we have individual read status.
    
    try {
      let q;
      if (userId) {
        q = query(
            collection(db, COLLECTION_NAME), 
            where('userId', '==', userId), 
            where('read', '==', false)
        );
      } else {
        q = query(
            collection(db, COLLECTION_NAME), 
            where('userId', '==', null), 
            where('read', '==', false)
        );
      }

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  },

  async deleteNotification(notificationId: string) {
    if (!db) return;
    await deleteDoc(doc(db, COLLECTION_NAME, notificationId));
  }
};
