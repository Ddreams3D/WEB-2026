'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationService } from '@/services/notification.service';
import { AppNotification } from '@/shared/types/domain';
import { isSuperAdmin } from '@/config/roles';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addSystemNotification: (title: string, message: string, type?: AppNotification['type']) => Promise<void>;
  addLocalNotification: (title: string, message: string, type?: AppNotification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Separate states for merging
  const [userNotifications, setUserNotifications] = useState<AppNotification[]>([]);
  const [systemNotifications, setSystemNotifications] = useState<AppNotification[]>([]);
  const [localNotifications, setLocalNotifications] = useState<AppNotification[]>([]);
  const [inboxNotifications, setInboxNotifications] = useState<AppNotification[]>([]);

  // --- INBOX POLLING SYSTEM ---
  useEffect(() => {
    if (!user) return;
    
    // Only check inbox if user is admin
    const isAdmin = user.role === 'admin' || isSuperAdmin(user.email);
    if (!isAdmin) return;

    // Dynamically import InboxService to avoid circular deps or server issues
    const checkInbox = async () => {
      try {
        const { InboxService } = await import('@/features/admin/finances/services/InboxService');
        const inboxItems = await InboxService.getInbox();
        
        if (inboxItems.length > 0) {
          // Convert inbox items to notifications
          // We filter out items that are already processed locally (handled by InboxService/FinanceView logic, 
          // but here we just show what is in the cloud inbox)
          
          const notis: AppNotification[] = inboxItems.map(item => ({
            id: `inbox-${item.id}`,
            userId: user.id,
            title: item.type === 'expense' ? 'Nuevo Gasto (Bot)' : 'Nuevo Ingreso (Bot)',
            message: `${item.currency} ${item.amount} - ${item.description}`,
            type: 'inbox',
            read: false,
            createdAt: new Date(item.createdAt),
            link: undefined, // Action handled by modal
            actionRequired: true,
            metadata: item
          }));
          
          setInboxNotifications(notis);
        } else {
            setInboxNotifications([]);
        }
      } catch (error) {
        console.error('Error checking inbox:', error);
      }
    };

    // Check immediately and then every 30 seconds
    checkInbox();
    const interval = setInterval(checkInbox, 30000);

    return () => clearInterval(interval);
  }, [user]);

  // --- LOCAL EDUCATIONAL NOTIFICATIONS SYSTEM ---
  useEffect(() => {
    // Solo activar en el cliente y si el usuario está logueado
    if (!user) return;

    const educationalFacts = [
      { title: 'Arquitectura: Next.js', msg: 'Tu web usa Next.js 14, lo que mejora el SEO y la velocidad de carga inicial.' },
      { title: 'Base de Datos: Firestore', msg: 'Usas una base de datos NoSQL que escala automáticamente con tus usuarios.' },
      { title: 'Diseño: Tailwind CSS', msg: 'El diseño se genera con "clases utilitarias", reduciendo el peso del código CSS en un 70%.' },
      { title: 'Seguridad: Roles', msg: 'El sistema verifica tu rol de "Admin" en cada petición a la base de datos.' },
      { title: 'UI: Shadcn/UI', msg: 'Tus componentes son accesibles y cumplen estándares WAI-ARIA para lectores de pantalla.' },
      { title: 'Assets: Firebase Storage', msg: 'Las imágenes se sirven desde una CDN global para cargar rápido en cualquier país.' },
      { title: 'Estado: React Context', msg: 'Estas notificaciones funcionan gracias a un "Estado Global" sin recargar la página.' },
      { title: 'Rendimiento: Server Components', msg: 'Gran parte de tu web se renderiza en el servidor antes de llegar al navegador.' },
      { title: 'Iconos: Lucide React', msg: 'Usas iconos SVG optimizados que pesan menos de 1kb cada uno.' },
      { title: 'Infraestructura: Serverless', msg: 'No pagas por servidores inactivos. Tu web "duerme" cuando nadie la usa.' }
    ];

    // Verificar si ya hemos mostrado notificaciones recientemente para no saturar
    const lastNotiTime = parseInt(localStorage.getItem('last_edu_noti_time') || '0');
    const now = Date.now();
    
    // Intervalo de chequeo (cada 2 minutos intenta lanzar una)
    const interval = setInterval(() => {
      const shouldTrigger = Math.random() > 0.6; // 40% de probabilidad
      if (shouldTrigger) {
        const randomFact = educationalFacts[Math.floor(Math.random() * educationalFacts.length)];
        
        const newNoti: AppNotification = {
          id: `local-${Date.now()}`,
          userId: user.id,
          title: randomFact.title,
          message: randomFact.msg,
          type: 'info',
          read: false,
          createdAt: new Date(),
          link: '/admin/configuracion?tab=glossary' // Link educativo
        };

        setLocalNotifications(prev => [newNoti, ...prev].slice(0, 10)); // Mantener solo las ultimas 10
        localStorage.setItem('last_edu_noti_time', Date.now().toString());
      }
    }, 120000); // 2 minutos

    // Lanzar una inmediata si es la primera vez
    if (now - lastNotiTime > 3600000) { // Si pasó más de 1 hora
       const welcomeNoti: AppNotification = {
          id: `local-welcome-${Date.now()}`,
          userId: user.id,
          title: 'Panel Listo',
          message: 'Bienvenido de nuevo. El sistema está optimizado y listo.',
          type: 'success',
          read: false,
          createdAt: new Date()
       };
       setLocalNotifications([welcomeNoti]);
    }

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Subscribe to User Notifications
    const unsubUser = NotificationService.subscribeToNotifications(user.id, (data) => {
      setUserNotifications(data);
    });

    // 2. Subscribe to System Notifications (if Admin)
    // We check if the user is admin/superadmin to show system alerts
    const isAdmin = user.role === 'admin' || isSuperAdmin(user.email);
    let unsubSystem = () => {};

    if (isAdmin) {
      unsubSystem = NotificationService.subscribeToNotifications(undefined, (data) => {
        setSystemNotifications(data);
      });
    } else {
      setSystemNotifications([]);
    }

    return () => {
      unsubUser();
      unsubSystem();
    };
  }, [user]);

  // Merge and Sort
  useEffect(() => {
    // Combine arrays
    const combined = [...userNotifications, ...systemNotifications, ...localNotifications, ...inboxNotifications];
    
    // Remove duplicates (just in case, though IDs should be unique unless system and user overlap)
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

    // Sort by date desc
    unique.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    setNotifications(unique);
    setLoading(false);
  }, [userNotifications, systemNotifications, localNotifications, inboxNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await NotificationService.markAsRead(id);
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await NotificationService.markAllAsRead(user?.id);
    if (user?.role === 'admin' || (user?.email && isSuperAdmin(user.email))) {
      await NotificationService.markAllAsRead(undefined); // System notifications
    }
  };

  const deleteNotification = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.filter(n => n.id !== id));
    await NotificationService.deleteNotification(id);
  };

  const addSystemNotification = async (title: string, message: string, type: AppNotification['type'] = 'info') => {
    // Helper to easily add a system notification from client (mostly for testing/demos, usually done by backend)
    await NotificationService.createNotification({
        title,
        message,
        type,
        userId: undefined, // System wide
    });
  };

  const addLocalNotification = (title: string, message: string, type: AppNotification['type'] = 'info') => {
    if (!user) return;
    const newNoti: AppNotification = {
      id: `local-action-${Date.now()}`,
      userId: user.id,
      title,
      message,
      type,
      read: false,
      createdAt: new Date(),
    };
    setLocalNotifications(prev => [newNoti, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addSystemNotification,
      addLocalNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
