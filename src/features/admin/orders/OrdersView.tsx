'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search as MagnifyingGlassIcon, 
  Clock, 
  Eye
} from '@/lib/icons';
import { OrderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/shared/types/domain';
import { useOrderTrackingHook } from '@/hooks/useOrderTracking';
import { useAuth } from '@/contexts/AuthContext';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import OrderDetailsModal from '@/features/admin/orders/components/OrderDetailsModal';

interface OrdersViewProps {
  hideHeader?: boolean;
}

export function OrdersView({ hideHeader = false }: OrdersViewProps) {
  const [fetchedOrders, setFetchedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { user } = useAuth();

  const { 
    orders,
    filteredOrders, 
    stats, 
    setFilters, 
    configureRealTime,
    estimateDelivery,
    sendStatusUpdate
  } = useOrderTrackingHook(fetchedOrders);

  // Disable hook's auto-refresh on mount
  useEffect(() => {
    configureRealTime({ autoRefresh: false, enabled: false });
  }, [configureRealTime]);

  // Update hook filters when local state changes
  useEffect(() => {
    setFilters({
      searchTerm: searchTerm,
      status: statusFilter === 'all' ? undefined : [statusFilter]
    });
  }, [searchTerm, statusFilter, setFilters]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      await OrderService.seedInitialOrders(); // Ensure seed data exists
      const data = await OrderService.getAllOrders(true);
      setFetchedOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    const adminId = user?.id || user?.email || 'admin';
    await OrderService.updateOrderStatus(id, status, undefined, adminId);
    await fetchOrders();
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Gestión de Pedidos
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra y monitorea el flujo de ventas y servicios
            </p>
          </div>
          <Button onClick={() => fetchOrders()} variant="outline" className="flex items-center gap-2">
             <Clock className="w-4 h-4" /> Actualizar
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs text-muted-foreground uppercase font-bold">Total Ventas</p>
          <p className="text-2xl font-bold mt-1 text-primary">
            {formatCurrency(stats.totalValue || 0)}
          </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
           <p className="text-xs text-muted-foreground uppercase font-bold">Pendientes</p>
           <p className="text-2xl font-bold mt-1 text-yellow-600">
             {fetchedOrders.filter(o => o.status === 'pending_payment').length}
           </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
           <p className="text-xs text-muted-foreground uppercase font-bold">En Proceso</p>
           <p className="text-2xl font-bold mt-1 text-purple-600">
             {stats.inProduction || fetchedOrders.filter(o => o.status === 'processing').length}
           </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
           <p className="text-xs text-muted-foreground uppercase font-bold">Completados</p>
           <p className="text-2xl font-bold mt-1 text-green-600">
             {stats.completed || fetchedOrders.filter(o => o.status === 'completed').length}
           </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
             <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Buscar por ID, cliente o email..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 border border-input rounded-lg text-sm bg-background"
             />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-3 py-2 border border-input rounded-lg text-sm bg-background min-w-[150px]"
          >
            <option value="all">Todos los estados</option>
            <option value="quote_requested">Cotizaciones</option>
            <option value="pending_payment">Pendiente de Pago</option>
            <option value="paid">Pagado</option>
            <option value="processing">En Proceso</option>
            <option value="ready">Listo</option>
            <option value="shipped">Enviado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
           <div className="p-12 text-center text-muted-foreground">Cargando pedidos...</div>
        ) : filteredOrders.length === 0 ? (
           <div className="p-12 text-center text-muted-foreground">No se encontraron pedidos.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground uppercase">ID</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground uppercase">Cliente</th>
                  <th className="px-6 py-3 text-center font-medium text-muted-foreground uppercase">Items</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground uppercase">Total</th>
                  <th className="px-6 py-3 text-center font-medium text-muted-foreground uppercase">Estado</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground uppercase">Fecha</th>
                  <th className="px-6 py-3 text-center font-medium text-muted-foreground uppercase">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{order.userName}</div>
                      <div className="text-xs text-muted-foreground">{order.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrderId(null)} 
        onUpdateStatus={handleUpdateStatus}
        onEstimateDelivery={async (id) => { await estimateDelivery(id); }}
        onSendNotification={sendStatusUpdate}
      />
    </div>
  );
}
