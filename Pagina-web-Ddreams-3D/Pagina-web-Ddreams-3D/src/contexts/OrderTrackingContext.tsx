'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipo para el status actual del pedido
type OrderStatusType = 'received' | 'in-production' | 'quality-control' | 'packaging' | 'shipped' | 'delivered' | 'cancelled';

// Interfaz para el historial de estados
interface OrderStatus {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  completed: boolean;
  estimatedDuration?: number; // minutos
  actualDuration?: number; // minutos
}

interface PrintingProgress {
  currentLayer: number;
  totalLayers: number;
  percentage: number;
  timeRemaining: number; // minutos
  temperature: {
    nozzle: number;
    bed: number;
  };
  speed: number; // mm/s
}

interface OrderItem {
  id: string;
  fileName: string;
  material: string;
  quantity: number;
  status: 'pending' | 'printing' | 'post-processing' | 'quality-check' | 'completed';
  printingProgress?: PrintingProgress;
  startTime?: string;
  completedTime?: string;
  qualityNotes?: string;
}

interface Order {
  id: string;
  companyId: string;
  orderNumber: string;
  title: string;
  items: OrderItem[];
  status: OrderStatusType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDelivery: string;
  actualDelivery?: string;
  statusHistory: OrderStatus[];
  timeline: OrderStatus[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes?: string;
  trackingNumber?: string;
}

interface Notification {
  id: string;
  orderId: string;
  companyId: string;
  type: 'status_change' | 'delay' | 'quality_issue' | 'delivery' | 'urgent';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface OrderTrackingContextType {
  // Estado
  orders: Order[];
  notifications: Notification[];
  loading: boolean;
  realTimeEnabled: boolean;
  
  // Funciones de órdenes
  loadOrders: () => Promise<void>;
  getOrderById: (id: string) => Order | null;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<boolean>;
  updateItemStatus: (orderId: string, itemId: string, newStatus: OrderItem['status']) => Promise<boolean>;
  addStatusToHistory: (orderId: string, status: Omit<OrderStatus, 'id'>) => void;
  
  // Seguimiento en tiempo real
  enableRealTimeTracking: () => void;
  disableRealTimeTracking: () => void;
  updatePrintingProgress: (orderId: string, itemId: string, progress: PrintingProgress) => void;
  
  // Notificaciones
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationsCount: () => number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  
  // Utilidades
  calculateEstimatedDelivery: (items: OrderItem[]) => string;
  getOrderProgress: (order: Order) => number;
  getDelayedOrders: () => Order[];
  getOrdersByStatus: (status: Order['status']) => Order[];
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  // Simulación de actualizaciones en tiempo real
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      // Simular actualizaciones de progreso de impresión
      setOrders(prevOrders => 
        prevOrders.map(order => ({
          ...order,
          items: order.items.map(item => {
            if (item.status === 'printing' && item.printingProgress) {
              const progress = item.printingProgress;
              const newLayer = Math.min(progress.currentLayer + 1, progress.totalLayers);
              const newPercentage = Math.round((newLayer / progress.totalLayers) * 100);
              const newTimeRemaining = Math.max(0, progress.timeRemaining - 1);
              
              return {
                ...item,
                printingProgress: {
                  ...progress,
                  currentLayer: newLayer,
                  percentage: newPercentage,
                  timeRemaining: newTimeRemaining
                }
              };
            }
            return item;
          })
        }))
      );
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [realTimeEnabled]);

  const loadOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      // Simular carga de órdenes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockOrders: Order[] = [
        {
          id: 'order-1',
          companyId: '1',
          orderNumber: 'DD3D-2024-001',
          title: 'Prototipos Automotrices - Lote 1',
          items: [
            {
              id: 'item-1',
              fileName: 'brake_caliper.stl',
              material: 'ABS',
              quantity: 5,
              status: 'printing',
              printingProgress: {
                currentLayer: 150,
                totalLayers: 300,
                percentage: 50,
                timeRemaining: 180,
                temperature: { nozzle: 240, bed: 80 },
                speed: 50
              },
              startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'item-2',
              fileName: 'gear_housing.stl',
              material: 'PETG',
              quantity: 3,
              status: 'pending'
            }
          ],
          status: 'in-production',
          priority: 'high',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          totalAmount: 450.00,
          statusHistory: [
            {
              id: 'status-1',
              name: 'Pedido Recibido',
              description: 'Orden confirmada y en cola de producción',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              completed: true,
              estimatedDuration: 30,
              actualDuration: 25
            },
            {
              id: 'status-2',
              name: 'En Producción',
              description: 'Impresión iniciada',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              completed: false,
              estimatedDuration: 480
            }
          ],
          timeline: [
            {
              id: 'status-1',
              name: 'Pedido Recibido',
              description: 'Orden confirmada y en cola de producción',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              completed: true,
              estimatedDuration: 30,
              actualDuration: 25
            },
            {
              id: 'status-2',
              name: 'En Producción',
              description: 'Impresión iniciada',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              completed: false,
              estimatedDuration: 480
            }
          ],
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          assignedTo: 'operator-1'
        },
        {
          id: 'order-2',
          companyId: '1',
          orderNumber: 'DD3D-2024-002',
          title: 'Componentes Médicos',
          items: [
            {
              id: 'item-3',
              fileName: 'surgical_guide.stl',
              material: 'PLA',
              quantity: 10,
              status: 'completed',
              startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
              completedTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              qualityNotes: 'Excelente calidad, sin defectos'
            }
          ],
          status: 'quality-control',
          priority: 'urgent',
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          totalAmount: 750.00,
          statusHistory: [
            {
              id: 'status-3',
              name: 'Pedido Recibido',
              description: 'Orden confirmada',
              timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
              completed: true
            },
            {
              id: 'status-4',
              name: 'Producción Completada',
              description: 'Todas las piezas impresas',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              completed: true
            },
            {
              id: 'status-5',
              name: 'Control de Calidad',
              description: 'Revisión de calidad en proceso',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              completed: false
            }
          ],
          timeline: [
            {
              id: 'status-3',
              name: 'Pedido Recibido',
              description: 'Orden confirmada',
              timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
              completed: true
            },
            {
              id: 'status-4',
              name: 'Producción Completada',
              description: 'Todas las piezas impresas',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              completed: true
            },
            {
              id: 'status-5',
              name: 'Control de Calidad',
              description: 'Revisión de calidad en proceso',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              completed: false
            }
          ],
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'operator-2'
        }
      ];
      
      setOrders(mockOrders);
      
      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: 'notif-1',
          orderId: 'order-1',
          companyId: 'company-1',
          type: 'status_change',
          title: 'Progreso de Impresión',
          message: 'La pieza brake_caliper.stl ha alcanzado el 50% de progreso',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false,
          priority: 'medium'
        },
        {
          id: 'notif-2',
          orderId: 'order-2',
          companyId: 'company-2',
          type: 'quality_issue',
          title: 'Control de Calidad',
          message: 'Orden DD3D-2024-002 lista para revisión final',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: 'high'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = (id: string): Order | null => {
    return orders.find(order => order.id === id) || null;
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<boolean> => {
    try {
      setLoading(true);
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: newStatus, 
                updatedAt: new Date().toISOString() 
              }
            : order
        )
      );
      
      // Agregar notificación
      const order = orders.find(o => o.id === orderId);
      if (order) {
        addNotification({
          orderId,
          companyId: order.companyId,
          type: 'status_change',
          title: 'Estado Actualizado',
          message: `La orden ha cambiado a estado: ${newStatus}`,
          read: false,
          priority: 'medium'
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (orderId: string, itemId: string, newStatus: OrderItem['status']): Promise<boolean> => {
    try {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? {
                ...order,
                items: order.items.map(item => 
                  item.id === itemId 
                    ? { 
                        ...item, 
                        status: newStatus,
                        ...(newStatus === 'completed' && { completedTime: new Date().toISOString() })
                      }
                    : item
                ),
                updatedAt: new Date().toISOString()
              }
            : order
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error updating item status:', error);
      return false;
    }
  };

  const addStatusToHistory = (orderId: string, status: Omit<OrderStatus, 'id'>) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? {
              ...order,
              statusHistory: [
                ...order.statusHistory,
                {
                  ...status,
                  id: `status-${Date.now()}`
                }
              ],
              updatedAt: new Date().toISOString()
            }
          : order
      )
    );
  };

  const enableRealTimeTracking = () => {
    setRealTimeEnabled(true);
  };

  const disableRealTimeTracking = () => {
    setRealTimeEnabled(false);
  };

  const updatePrintingProgress = (orderId: string, itemId: string, progress: PrintingProgress) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? {
              ...order,
              items: order.items.map(item => 
                item.id === itemId 
                  ? { ...item, printingProgress: progress }
                  : item
              ),
              updatedAt: new Date().toISOString()
            }
          : order
      )
    );
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getUnreadNotificationsCount = (): number => {
    return notifications.filter(notif => !notif.read).length;
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const calculateEstimatedDelivery = (items: OrderItem[]): string => {
    // Lógica simple de estimación basada en cantidad y complejidad
    const totalHours = items.reduce((total, item) => {
      const baseHours = item.quantity * 2; // 2 horas por pieza base
      return total + baseHours;
    }, 0);
    
    const deliveryDate = new Date(Date.now() + (totalHours + 24) * 60 * 60 * 1000); // +24h para post-procesamiento
    return deliveryDate.toISOString();
  };

  const getOrderProgress = (order: Order): number => {
    const totalItems = order.items.length;
    const completedItems = order.items.filter(item => item.status === 'completed').length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const getDelayedOrders = (): Order[] => {
    const now = new Date();
    return orders.filter(order => {
      const estimatedDelivery = new Date(order.estimatedDelivery);
      return estimatedDelivery < now && order.status !== 'delivered';
    });
  };

  const getOrdersByStatus = (status: Order['status']): Order[] => {
    return orders.filter(order => order.status === status);
  };

  const value: OrderTrackingContextType = {
    orders,
    notifications,
    loading,
    realTimeEnabled,
    loadOrders,
    getOrderById,
    updateOrderStatus,
    updateItemStatus,
    addStatusToHistory,
    enableRealTimeTracking,
    disableRealTimeTracking,
    updatePrintingProgress,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationsCount,
    addNotification,
    calculateEstimatedDelivery,
    getOrderProgress,
    getDelayedOrders,
    getOrdersByStatus
  };

  return (
    <OrderTrackingContext.Provider value={value}>
      {children}
    </OrderTrackingContext.Provider>
  );
};

export default OrderTrackingProvider;

// Exportar tipos para uso en otros archivos
export type { Order, OrderStatus, OrderStatusType, OrderItem, Notification, PrintingProgress, OrderTrackingContextType };