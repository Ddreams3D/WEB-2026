'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useOrderTracking, Notification } from '@/contexts/OrderTrackingContext';
import { Order, OrderStatus, OrderItem } from '@/shared/types/domain';
import { OrderService } from '@/services/order.service';

interface OrderFilters {
  status?: OrderStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
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
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  addOrderNote: (orderId: string, note: string) => Promise<void>;
  estimateDelivery: (orderId: string) => Promise<Date>;
  sendStatusUpdate: (orderId: string, message: string) => Promise<void>;
  exportOrderData: (orderIds: string[], format: 'csv' | 'pdf' | 'excel') => Promise<void>;
  bulkUpdateStatus: (orderIds: string[], status: OrderStatus) => Promise<void>;
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
  sortBy: 'date' | 'status' | 'amount' | 'delivery';
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
export const useOrderTrackingHook = (initialOrders?: Order[]): UseOrderTrackingReturn => {
  const { 
    orders: contextOrders,
    notifications: allNotifications,
    loadOrders,
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
  
  // Estado local para actualizaciones en tiempo real
  const [localUpdates, setLocalUpdates] = useState<Map<string, Order>>(new Map());

  // Filtrar pedidos (usar initialOrders si existen, sino usar del contexto)
  // Fusionar con actualizaciones locales
  const orders = useMemo(() => {
    const baseOrders = initialOrders || contextOrders;
    if (localUpdates.size === 0) return baseOrders;
    
    // Si hay actualizaciones locales, reemplazamos los pedidos correspondientes
    return baseOrders.map(order => localUpdates.get(order.id) || order);
  }, [initialOrders, contextOrders, localUpdates]);

  // Filtrar notificaciones
  const notifications = allNotifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  // Aplicar filtros y ordenamiento
  const filteredOrders = useMemo(() => {
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

    // Implementación de filtros por monto
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(order => order.total >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(order => order.total <= filters.maxAmount!);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchLower) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(searchLower)) ||
        (order.userName && order.userName.toLowerCase().includes(searchLower)) ||
        // Búsqueda en items por nombre
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
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
        case 'amount':
          comparison = a.total - b.total;
          break;
        case 'delivery':
          const aDelivery = a.estimatedDeliveryDate ? new Date(a.estimatedDeliveryDate).getTime() : 0;
          const bDelivery = b.estimatedDeliveryDate ? new Date(b.estimatedDeliveryDate).getTime() : 0;
          comparison = aDelivery - bDelivery;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [orders, filters, sortBy, sortOrder]);

  // Calcular estadísticas
  const stats = useMemo((): OrderStats => {
    const total = orders.length;
    const pending = orders.filter(o => ['quote_requested', 'pending_payment'].includes(o.status)).length;
    const inProduction = orders.filter(o => ['processing', 'ready'].includes(o.status)).length;
    const completed = orders.filter(o => ['completed', 'shipped'].includes(o.status)).length;
    const cancelled = orders.filter(o => ['cancelled', 'refunded'].includes(o.status)).length;
    const totalValue = orders.reduce((sum, o) => sum + o.total, 0);
    
    // Calcular tiempo promedio de entrega
    const completedOrders = orders.filter(o => o.status === 'completed');
    let totalDeliveryTimeMs = 0;
    let completedCount = 0;
    let onTimeCount = 0;
    let withEstimateCount = 0;

    completedOrders.forEach(order => {
      // Buscar fecha de completado en el historial o usar updatedAt
      const completedEntry = order.history?.find(h => h.status === 'completed');
      const completionDate = completedEntry ? new Date(completedEntry.timestamp) : new Date(order.updatedAt);
      const creationDate = new Date(order.createdAt);
      
      // Tiempo de entrega en milisegundos
      const deliveryTime = completionDate.getTime() - creationDate.getTime();
      if (deliveryTime > 0) {
        totalDeliveryTimeMs += deliveryTime;
        completedCount++;
      }

      // Verificar entrega a tiempo
      if (order.estimatedDeliveryDate) {
        withEstimateCount++;
        const estimatedDate = new Date(order.estimatedDeliveryDate);
        // Comparamos solo fechas sin horas para ser justos, o timestamp directo
        // Asumimos que si se entrega el mismo día, es a tiempo
        if (completionDate.getTime() <= estimatedDate.getTime() + 86400000) { // +1 día de margen
          onTimeCount++;
        }
      }
    });

    const averageDeliveryTime = completedCount > 0 
      ? (totalDeliveryTimeMs / completedCount) / (1000 * 60 * 60 * 24) // Días
      : 0;
    
    const onTimeDeliveryRate = withEstimateCount > 0
      ? (onTimeCount / withEstimateCount) * 100
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
        if (order && order.status !== 'completed') {
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
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await OrderService.updateOrderStatus(orderId, status);
      await loadOrders(); // Recargar pedidos del contexto
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
  const addOrderNote = async (orderId: string, note: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await OrderService.addOrderNote(orderId, note, 'admin'); // Defaulting to 'admin' for this hook usage
      
      // Actualizar estado local inmediatamente
      const updatedOrder = await OrderService.getOrderById(orderId);
      if (updatedOrder) {
        setLocalUpdates(prev => {
          const newMap = new Map(prev);
          newMap.set(orderId, updatedOrder);
          return newMap;
        });
      }
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

      // Calcular fecha estimada usando lógica de negocio del servicio
      const estimatedDelivery = await OrderService.calculateDeliveryDate(order);

      // Actualizar en el backend (simulado/firebase)
      await OrderService.updateEstimatedDeliveryDate(orderId, estimatedDelivery);

      // Actualizar estado local inmediatamente
      setLocalUpdates(prev => {
        const newMap = new Map(prev);
        // Ensure we create a new object reference with the updated date
        newMap.set(orderId, { 
          ...order, 
          estimatedDeliveryDate: estimatedDelivery,
          updatedAt: new Date()
        });
        return newMap;
      });

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
  const sendStatusUpdate = async (orderId: string, message: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) throw new Error('Pedido no encontrado');

      // Enviar notificación a través del servicio (API)
      await OrderService.sendOrderNotification(orderId, message, 'email', order.userEmail);
      
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
  const exportOrderData = async (orderIds: string[], format: 'csv' | 'pdf' | 'excel'): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (format !== 'csv') {
        throw new Error('Solo el formato CSV está soportado actualmente');
      }

      const ordersToExport = orders.filter(o => orderIds.includes(o.id));
      if (ordersToExport.length === 0) return;

      // Headers
      const headers = ['ID', 'Fecha', 'Cliente', 'Email', 'Estado', 'Total', 'Items'];
      
      // Rows
      const rows = ordersToExport.map(o => [
        o.id,
        new Date(o.createdAt).toLocaleDateString(),
        o.userName,
        o.userEmail,
        o.status,
        o.total.toFixed(2),
        o.items.map(i => `${i.quantity}x ${i.name}`).join('; ')
      ]);

      // CSV Content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `pedidos_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
  const bulkUpdateStatus = async (orderIds: string[], status: OrderStatus): Promise<void> => {
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
  const setFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Alternar selección de pedido
   */
  const toggleOrderSelection = useCallback((orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  }, []);

  /**
   * Seleccionar todos los pedidos filtrados
   */
  const selectAllOrders = useCallback(() => {
    const filteredIds = filteredOrders.map(o => o.id);
    setSelectedOrders(filteredIds);
  }, [filteredOrders]);

  /**
   * Limpiar selección
   */
  const clearSelection = useCallback(() => {
    setSelectedOrders([]);
  }, []);

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
  const configureRealTime = useCallback((config: Partial<RealTimeConfig>) => {
    setRealTimeConfig(prev => ({ ...prev, ...config }));
  }, []);

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
    filteredOrders,
    selectedOrders,
    filters,
    stats,
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
