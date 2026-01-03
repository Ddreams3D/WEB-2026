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
    const combined = [...userNotifications, ...systemNotifications];
    
    // Remove duplicates (just in case, though IDs should be unique unless system and user overlap)
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

    // Sort by date desc
    unique.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    setNotifications(unique);
    setLoading(false);
  }, [userNotifications, systemNotifications]);

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

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addSystemNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
