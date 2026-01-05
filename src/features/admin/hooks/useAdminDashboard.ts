import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StoreProduct } from '@/shared/types/domain';

export interface DashboardStats {
  products: number;
  services: number;
  orders: number;
  users: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  image?: string;
  type: 'product' | 'service' | 'order'; // Added type for icon selection in UI
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    services: 0,
    orders: 0,
    users: 0
  });
  const [recentItems, setRecentItems] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    let unsubs: (() => void)[] = [];
    let isMounted = true;

    const setupListeners = async () => {
      try {
        // Products listener
        const qProducts = query(collection(db!, 'products'), orderBy('createdAt', 'desc'));
        
        const unsubProd = onSnapshot(qProducts, {
          next: (snap) => {
            if (!isMounted) return;
            setStats(prev => ({ ...prev, products: snap.size }));
            
            const recent = snap.docs
              .slice(0, 5)
              .map(doc => ({ id: doc.id, ...doc.data() } as StoreProduct))
              .map(p => ({
                id: p.id,
                title: p.name,
                subtitle: `Categoría: ${p.categoryName || 'General'}`,
                time: 'Disponible',
                image: p.images?.[0]?.url,
                type: 'product' as const
              }));
            setRecentItems(recent);
          },
          error: (error) => console.error("Firestore Error (Products):", error)
        });
        if (isMounted) unsubs.push(unsubProd); else unsubProd();

        // Services listener
        const unsubServ = onSnapshot(collection(db!, 'services'), {
          next: (snap) => {
            if (!isMounted) return;
            setStats(prev => ({ ...prev, services: snap.size }));
          },
          error: (error) => console.error("Firestore Error (Services):", error)
        });
        if (isMounted) unsubs.push(unsubServ); else unsubServ();

        // Orders listener
        const unsubOrd = onSnapshot(collection(db!, 'orders'), {
          next: (snap) => {
            if (!isMounted) return;
            setStats(prev => ({ ...prev, orders: snap.size }));
          },
          error: (error) => console.error("Firestore Error (Orders):", error)
        });
        if (isMounted) unsubs.push(unsubOrd); else unsubOrd();

        // Users listener
        const unsubUsr = onSnapshot(collection(db!, 'users'), {
          next: (snap) => {
            if (!isMounted) return;
            setStats(prev => ({ ...prev, users: snap.size }));
          },
          error: (error) => console.error("Firestore Error (Users):", error)
        });
        if (isMounted) unsubs.push(unsubUsr); else unsubUsr();

        if (isMounted) setLoading(false);
      } catch (err) {
        console.error("Error setting up Firestore listeners:", err);
        if (isMounted) setLoading(false);
      }
    };

    setupListeners();

    return () => {
      isMounted = false;
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  return {
    stats,
    recentItems,
    loading
  };
}
