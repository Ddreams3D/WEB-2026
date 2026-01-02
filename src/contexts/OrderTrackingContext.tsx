'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/shared/types/domain';

// Notification interface (kept local for now as it might not be in domain yet)
export interface Notification {
  id: string;
  orderId: string;
  type: 'status_change' | 'delay' | 'quality_issue' | 'delivery' | 'urgent';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface OrderTrackingContextType {
  // State
  orders: Order[];
  notifications: Notification[];
  loading: boolean;
  
  // Order Functions
  loadOrders: () => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  
  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationsCount: () => number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  
  // Utilities
  getDelayedOrders: () => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

const OrderTrackingContext = createContext<OrderTrackingContextType | undefined>(undefined);

export const useOrderTracking = () => {
  const context = useContext(OrderTrackingContext);
  if (context === undefined) {
    throw new Error('useOrderTracking must be used within an OrderTrackingProvider');
  }
  return context;
};

interface OrderTrackingProviderProps {
  children: ReactNode;
}

export const OrderTrackingProvider: React.FC<OrderTrackingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async (): Promise<void> => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userOrders = await OrderService.getUserOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load orders when user changes
  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [user, loadOrders]);

  const getOrderById = useCallback((id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  }, [orders]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const getUnreadNotificationsCount = useCallback((): number => {
    return notifications.filter(notif => !notif.read).length;
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const getDelayedOrders = useCallback((): Order[] => {
    const now = new Date();
    return orders.filter(order => {
      if (!order.estimatedDeliveryDate) return false;
      const estimatedDelivery = new Date(order.estimatedDeliveryDate);
      return estimatedDelivery < now && order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'refunded';
    });
  }, [orders]);

  const getOrdersByStatus = useCallback((status: OrderStatus): Order[] => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const value: OrderTrackingContextType = useMemo(() => ({
    orders,
    notifications,
    loading,
    loadOrders,
    getOrderById,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationsCount,
    addNotification,
    getDelayedOrders,
    getOrdersByStatus
  }), [
    orders,
    notifications,
    loading,
    loadOrders,
    getOrderById,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationsCount,
    addNotification,
    getDelayedOrders,
    getOrdersByStatus
  ]);

  return (
    <OrderTrackingContext.Provider value={value}>
      {children}
    </OrderTrackingContext.Provider>
  );
};

export default OrderTrackingProvider;
