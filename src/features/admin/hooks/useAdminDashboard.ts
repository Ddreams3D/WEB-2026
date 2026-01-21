import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit, getCountFromServer, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StoreProduct } from '@/shared/types/domain';
import { useToast } from '@/components/ui/ToastManager';

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
  type: 'product' | 'service' | 'order';
}

export function useAdminDashboard() {
  const { showError } = useToast();
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

    let unsubRecent: (() => void) | undefined;
    let isMounted = true;

    const fetchData = async () => {
      try {
        // 1. Contadores Optimizados (Aggregation Queries)
        // Evita descargar todos los documentos, solo cuenta usando índices
        // Filtramos 'isDeleted' != true para mostrar solo items activos/existentes
        const [productsSnap, servicesSnap, ordersSnap, usersSnap] = await Promise.all([
          getCountFromServer(query(collection(db!, 'products'), where('isDeleted', '!=', true))),
          getCountFromServer(query(collection(db!, 'services'), where('isDeleted', '!=', true))),
          getCountFromServer(query(collection(db!, 'orders'), where('isDeleted', '!=', true))),
          getCountFromServer(collection(db!, 'users'))
        ]);

        if (isMounted) {
          setStats({
            products: productsSnap.data().count,
            services: servicesSnap.data().count,
            orders: ordersSnap.data().count,
            users: usersSnap.data().count
          });
        }

        // 2. Actividad Reciente (Tiempo Real Optimizado)
        // Solo escuchamos los últimos 5 documentos, no toda la colección
        const qRecentProducts = query(
          collection(db!, 'products'), 
          orderBy('createdAt', 'desc'), 
          limit(5)
        );
        
        unsubRecent = onSnapshot(qRecentProducts, {
          next: (snap) => {
            if (!isMounted) return;
            
            const recent = snap.docs
              .map(doc => ({ id: doc.id, ...doc.data() } as StoreProduct))
              .map(p => ({
                id: p.id,
                title: p.name,
                subtitle: `Categoría: ${p.categoryName || 'General'}`,
                time: 'Disponible', // Idealmente usar p.createdAt y formatear fecha relativa
                image: p.images?.[0]?.url,
                type: 'product' as const
              }));
            
            setRecentItems(recent);
            setLoading(false);
          },
          error: (error) => {
            console.error("Firestore Error (Recent Activity):", error);
            if (isMounted) {
              showError("Error al cargar actividad reciente");
              setLoading(false);
            }
          }
        });

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        if (isMounted) {
          showError("Error cargando estadísticas generales");
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (unsubRecent) unsubRecent();
    };
  }, [showError]); // Dependencia segura ya que useToast retorna funciones estables

  return { stats, recentItems, loading };
}
