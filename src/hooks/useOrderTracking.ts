'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useOrderTracking } from '@/contexts/OrderTrackingContext';
import { Order, OrderStatusType, OrderItem, Notification } from '@/contexts/OrderTrackingContext';
// import { PrintingProgress } from '@/contexts/OrderTrackingContext';

interface OrderFilters {
  status?: OrderStatusType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: ('low' | 'medium' | 'high' | 'urgent')[];
  searchTerm?: string;
  minAmount?: number;
  maxAmount?: number;
}

interface OrderStats {
  total: number;
  pending: number;
  inProduction: number;
  completed: number;
  cancelled: number;
  totalValue: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
}

interface RealTimeConfig {
  enabled: boolean;
  interval: number; // en milisegundos
  autoRefresh: boolean;
}

interface OrderTrackingActions {
  startRealTimeTracking: (orderId: string) => void;
  stopRealTimeTracking: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatusType) => Promise<void>;
  addOrderNote: (orderId: string, note: string) => Promise<void>;
  estimateDelivery: (orderId: string) => Promise<Date>;
  sendStatusUpdate: (orderId: string, message: string) => Promise<void>;
  exportOrderData: (orderIds: string[], format: 'csv' | 'pdf' | 'excel') => Promise<void>;
  bulkUpdateStatus: (orderIds: string[], status: OrderStatusType) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

interface UseOrderTrackingState {
  orders: Order[];
  filteredOrders: Order[];
  selectedOrders: string[];
  filters: OrderFilters;
  stats: OrderStats;
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  realTimeConfig: RealTimeConfig;
  trackingOrders: Set<string>;
  sortBy: 'date' | 'status' | 'priority' | 'amount' | 'delivery';
  sortOrder: 'asc' | 'desc';
}

type UseOrderTrackingReturn = UseOrderTrackingState & OrderTrackingActions & {
  setFilters: (filters: Partial<OrderFilters>) => void;
  setSortBy: (sortBy: UseOrderTrackingState['sortBy']) => void;
  setSortOrder: (sortOrder: UseOrderTrackingState['sortOrder']) => void;
  toggleOrderSelection: (orderId: string) => void;
  selectAllOrders: () => void;
  clearSelection: () => void;
  refreshOrders: () => Promise<void>;
  configureRealTime: (config: Partial<RealTimeConfig>) => void;
};

/**
 * Hook personalizado para el seguimiento de pedidos en tiempo real
 * Proporciona funcionalidades avanzadas de seguimiento
 */
export const useOrderTrackingHook = (): UseOrderTrackingReturn => {
  const { 
    orders: allOrders,
    notifications: allNotifications,
    loadOrders,
    updateOrderStatus: contextUpdateOrderStatus,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useOrderTracking();
  
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filters, setFiltersState] = useState<OrderFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<UseOrderTrackingState['sortBy']>('date');
  const [sortOrder, setSortOrder] = useState<UseOrderTrackingState['sortOrder']>('desc');
  const [trackingOrders, setTrackingOrders] = useState<Set<string>>(new Set());
  const [realTimeConfig, setRealTimeConfig] = useState<RealTimeConfig>({
    enabled: true,
    interval: 30000, // 30 segundos
    autoRefresh: true
  });
  
  const intervalRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Filtrar pedidos
  const orders = allOrders;

  // Filtrar notificaciones
  const notifications = allNotifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  // Aplicar filtros y ordenamiento
  const filteredOrders = useCallback(() => {
    let filtered = [...orders];

    // Aplicar filtros
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(order => filters.status!.includes(order.status));
    }

    if (filters.dateRange) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= filters.dateRange!.start && orderDate <= filters.dateRange!.end;
      });
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(order => filters.priority!.includes(order.priority));
    }

    // Implementación de filtros por monto
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(order => order.totalAmount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(order => order.totalAmount <= filters.maxAmount!);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchLower) ||
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.title.toLowerCase().includes(searchLower) ||
        // Búsqueda en items por nombre de archivo
        order.items.some(item => item.fileName.toLowerCase().includes(searchLower))
      );
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'priority':
          const priorityOrder: Record<'low' | 'medium' | 'high' | 'urgent', number> = { low: 1, medium: 2, high: 3, urgent: 4 };
          comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'amount':
          // TODO: Implementar ordenamiento por monto cuando esté disponible en el tipo Order
          comparison = 0;
          break;
        case 'delivery':
          const aDelivery = a.estimatedDelivery ? new Date(a.estimatedDelivery).getTime() : 0;
          const bDelivery = b.estimatedDelivery ? new Date(b.estimatedDelivery).getTime() : 0;
          comparison = aDelivery - bDelivery;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [orders, filters, sortBy, sortOrder]);

  // Calcular estadísticas
  const stats = useCallback((): OrderStats => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'received').length;
    const inProduction = orders.filter(o => o.status === 'in-production').length;
    const completed = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'shipped').length; // Usando shipped como estado final antes de delivered
    // TODO: Implementar cálculo de valor total cuando esté disponible en el tipo Order
    const totalValue = 0; // orders.reduce((sum, o) => sum + o.total, 0);
    
    // Calcular tiempo promedio de entrega
    const completedOrders = orders.filter(o => o.status === 'delivered' && o.actualDelivery);
    const averageDeliveryTime = completedOrders.length > 0 
      ? completedOrders.reduce((sum, o) => {
          const created = new Date(o.createdAt).getTime();
          const delivered = new Date(o.actualDelivery!).getTime();
          return sum + (delivered - created);
        }, 0) / completedOrders.length / (1000 * 60 * 60 * 24) // en días
      : 0;
    
    // Calcular tasa de entrega a tiempo
    const onTimeDeliveries = completedOrders.filter(o => {
      if (!o.estimatedDelivery || !o.actualDelivery) return false;
      return new Date(o.actualDelivery) <= new Date(o.estimatedDelivery);
    }).length;
    const onTimeDeliveryRate = completedOrders.length > 0 
      ? (onTimeDeliveries / completedOrders.length) * 100 
      : 0;

    return {
      total,
      pending,
      inProduction,
      completed,
      cancelled,
      totalValue,
      averageDeliveryTime,
      onTimeDeliveryRate
    };
  }, [orders]);

  /**
   * Iniciar seguimiento en tiempo real de un pedido
   */
  const startRealTimeTracking = useCallback((orderId: string) => {
    if (!realTimeConfig.enabled || trackingOrders.has(orderId)) return;

    const interval = setInterval(async () => {
      try {
        // Simular actualización en tiempo real
        const order = orders.find(o => o.id === orderId);
        if (order && order.status !== 'delivered') {
          // En una implementación real, esto haría una llamada a la API
        }
      } catch (err) {
        console.error(`Error tracking order ${orderId}:`, err);
      }
    }, realTimeConfig.interval);

    intervalRefs.current.set(orderId, interval);
    setTrackingOrders(prev => new Set([...prev, orderId]));
  }, [realTimeConfig, orders, trackingOrders]);

  /**
   * Detener seguimiento en tiempo real de un pedido
   */
  const stopRealTimeTracking = useCallback((orderId: string) => {
    const interval = intervalRefs.current.get(orderId);
    if (interval) {
      clearInterval(interval);
      intervalRefs.current.delete(orderId);
    }
    setTrackingOrders(prev => {
      const newSet = new Set(prev);
      newSet.delete(orderId);
      return newSet;
    });
  }, []);

  /**
   * Actualizar estado de pedido
   */
  const updateOrderStatus = async (orderId: string, status: OrderStatusType): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData: { status: OrderStatusType; actualDelivery?: string } = { status };
      
      if (status === 'delivered' as OrderStatusType) {
        updateData.actualDelivery = new Date().toISOString();
      }
      
      await contextUpdateOrderStatus(orderId, status);
    } catch (err) {
      const errorMessage = 'Error al actualizar estado del pedido';
      setError(errorMessage);
      console.error('Error updating order status:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Agregar nota al pedido
   */
  const addOrderNote = async (orderId: string, _note: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Pedido no encontrado');
      }
      
      // Simulación de agregar nota (ya que el contexto no soporta notas dinámicas aún)
      // En una implementación real, esto llamaría a la API o al contexto
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Nota agregada al pedido ${orderId}: ${_note}`);
      
    } catch (err) {
      const errorMessage = 'Error al agregar nota al pedido';
      setError(errorMessage);
      console.error('Error adding order note:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Estimar fecha de entrega
   */
  const estimateDelivery = async (orderId: string): Promise<Date> => {
    setIsLoading(true);
    setError(null);

    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Pedido no encontrado');
      }

      // Lógica de estimación basada en el tipo de items y carga de trabajo
      const baseDeliveryDays = 7; // días base
      const complexityFactor = order.items.reduce((factor: number, item: OrderItem) => {
        // Factores de complejidad basados en material y tamaño
        let itemFactor = 1;
        if (item.material === 'PLA') itemFactor = 1;
        else if (item.material === 'ABS') itemFactor = 1.2;
        else if (item.material === 'PETG') itemFactor = 1.3;
        else if (item.material === 'TPU') itemFactor = 1.5;
        
        return Math.max(factor, itemFactor);
      }, 1);

      const estimatedDays = Math.ceil(baseDeliveryDays * complexityFactor);
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDays);

      // TODO: Implementar actualización de fecha estimada cuando esté disponible en el contexto
      // await contextUpdateOrderStatus(orderId, order.status);
      return estimatedDelivery;
    } catch (err) {
      const errorMessage = 'Error al estimar fecha de entrega';
      setError(errorMessage);
      console.error('Error estimating delivery:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Enviar actualización de estado
   */
  const sendStatusUpdate = async (_orderId: string, _message: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular envío de notificación
      // En implementación real, esto enviaría email/SMS/push notification
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      const errorMessage = 'Error al enviar actualización de estado';
      setError(errorMessage);
      console.error('Error sending status update:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Exportar datos de pedidos
   */
  const exportOrderData = async (orderIds: string[], _format: 'csv' | 'pdf' | 'excel'): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // const ordersToExport = orders.filter(o => orderIds.includes(o.id));
      console.log('Exporting orders:', orderIds);
      
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      const errorMessage = 'Error al exportar datos de pedidos';
      setError(errorMessage);
      console.error('Error exporting order data:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualizar estado en lote
   */
  const bulkUpdateStatus = async (orderIds: string[], status: OrderStatusType): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatePromises = orderIds.map(id => updateOrderStatus(id, status));
      await Promise.all(updatePromises);
    } catch (err) {
      const errorMessage = 'Error al actualizar estado en lote';
      setError(errorMessage);
      console.error('Error bulk updating status:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  /**
   * Limpiar todas las notificaciones
   */
  const clearAllNotifications = () => {
    markAllNotificationsAsRead();
  };

  /**
   * Establecer filtros
   */
  const setFilters = (newFilters: Partial<OrderFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  /**
   * Alternar selección de pedido
   */
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  /**
   * Seleccionar todos los pedidos filtrados
   */
  const selectAllOrders = () => {
    const filteredIds = filteredOrders().map(o => o.id);
    setSelectedOrders(filteredIds);
  };

  /**
   * Limpiar selección
   */
  const clearSelection = () => {
    setSelectedOrders([]);
  };

  /**
   * Refrescar pedidos
   */
  const refreshOrders = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await loadOrders();
      // Las notificaciones se cargan automáticamente con el contexto
    } catch (err) {
      setError('Error al refrescar pedidos');
      console.error('Error refreshing orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadOrders]);

  /**
   * Configurar seguimiento en tiempo real
   */
  const configureRealTime = (config: Partial<RealTimeConfig>) => {
    setRealTimeConfig(prev => ({ ...prev, ...config }));
  };

  // Limpiar intervalos al desmontar
  useEffect(() => {
    const currentIntervals = intervalRefs.current;
    return () => {
      currentIntervals.forEach(interval => clearInterval(interval));
      currentIntervals.clear();
    };
  }, []);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (realTimeConfig.autoRefresh && realTimeConfig.enabled) {
      const interval = setInterval(refreshOrders, realTimeConfig.interval);
      return () => clearInterval(interval);
    }
  }, [realTimeConfig, refreshOrders]);

  return {
    // Estado
    orders,
    filteredOrders: filteredOrders(),
    selectedOrders,
    filters,
    stats: stats(),
    notifications,
    unreadCount,
    isLoading,
    error,
    realTimeConfig,
    trackingOrders,
    sortBy,
    sortOrder,
    
    // Acciones
    startRealTimeTracking,
    stopRealTimeTracking,
    updateOrderStatus,
    addOrderNote,
    estimateDelivery,
    sendStatusUpdate,
    exportOrderData,
    bulkUpdateStatus,
    markNotificationAsRead,
    clearAllNotifications,
    setFilters,
    setSortBy,
    setSortOrder,
    toggleOrderSelection,
    selectAllOrders,
    clearSelection,
    refreshOrders,
    configureRealTime
  };
};

export default useOrderTracking;