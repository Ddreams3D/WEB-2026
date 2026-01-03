'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search as MagnifyingGlassIcon, 
  Filter, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Eye, 
  XCircle,
  Calendar,
  User as UserIcon,
  Phone,
  Mail,
  FileText
} from '@/lib/icons';
import { cn } from '@/lib/utils';
import { OrderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/shared/types/domain';
import { useOrderTrackingHook } from '@/hooks/useOrderTracking';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { ProductImage } from '@/shared/components/ui/DefaultImage';

// --- Components ---

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const styles = {
    quote_requested: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800',
    pending_payment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    ready: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    shipped: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  };

  const labels = {
    quote_requested: 'Cotización',
    pending_payment: 'Pendiente de Pago',
    paid: 'Pagado',
    processing: 'En Proceso',
    ready: 'Listo',
    shipped: 'Enviado',
    completed: 'Completado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado'
  };

  const icons = {
    quote_requested: FileText,
    pending_payment: Clock,
    paid: DollarSign,
    processing: Package,
    ready: CheckCircle,
    shipped: Truck,
    completed: CheckCircle,
    cancelled: XCircle,
    refunded: AlertCircle
  };

  const Icon = icons[status] || AlertCircle;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      styles[status] || styles.pending_payment
    )}>
      <Icon className="w-3 h-3 mr-1" />
      {labels[status]}
    </span>
  );
}

function OrderDetailsModal({ 
  order, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  onEstimateDelivery,
  onSendNotification
}: {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
  onEstimateDelivery: (id: string) => Promise<Date>;
  onSendNotification: (id: string, message: string) => Promise<void>;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
      setNotificationMessage(`Hola ${order.userName}, tu pedido #${order.id.slice(0, 8)} está ahora: ${getStatusLabel(order.status)}.`);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const getStatusLabel = (s: string) => {
    const labels: Record<string, string> = {
      quote_requested: 'en cotización',
      pending_payment: 'pendiente de pago',
      paid: 'pagado',
      processing: 'en proceso',
      ready: 'listo',
      shipped: 'enviado',
      completed: 'completado',
      cancelled: 'cancelado',
      refunded: 'reembolsado'
    };
    return labels[s] || s;
  };

  const handleStatusChange = async () => {
    if (!newStatus || newStatus === order.status) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, newStatus);
      // Update notification message suggestion
      setNotificationMessage(`Hola ${order.userName}, tu pedido #${order.id.slice(0, 8)} ha sido actualizado a: ${getStatusLabel(newStatus)}.`);
    } catch (error) {
      alert('Error al actualizar estado');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEstimateDelivery = async () => {
    setIsEstimating(true);
    try {
      await onEstimateDelivery(order.id);
    } catch (error) {
      alert('Error al estimar fecha');
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationMessage) return;
    setIsNotifying(true);
    try {
      await onSendNotification(order.id, notificationMessage);
      alert('Notificación enviada correctamente');
    } catch (error) {
      alert('Error al enviar notificación');
    } finally {
      setIsNotifying(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-background/80 backdrop-blur-sm" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-card shadow-xl rounded-2xl border border-border">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Pedido #{order.id.slice(0, 8)}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {order.createdAt.toLocaleDateString('es-PE', { 
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XCircle className="w-6 h-6" />
            </Button>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-muted/30 rounded-xl border border-border/50">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Cliente
              </h4>
              <p className="text-sm">{order.userName}</p>
              <p className="text-sm text-muted-foreground">{order.userEmail}</p>
              {order.customerPhone && <p className="text-sm text-muted-foreground flex items-center mt-1"><Phone className="w-3 h-3 mr-1"/> {order.customerPhone}</p>}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                Envío ({order.shippingMethod === 'pickup' ? 'Recojo' : 'Delivery'})
              </h4>
              {order.shippingAddress ? (
                <div className="text-sm">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Recojo en tienda</p>
              )}
              
              <div className="mt-3 pt-3 border-t border-border/50">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Entrega Estimada:</span>
                    {order.estimatedDeliveryDate ? (
                        <span className="text-sm font-medium">
                            {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                        </span>
                    ) : (
                        <span className="text-sm text-yellow-600">Pendiente</span>
                    )}
                 </div>
                 <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs mt-1" 
                    onClick={handleEstimateDelivery}
                    disabled={isEstimating}
                 >
                    {isEstimating ? 'Calculando...' : (order.estimatedDeliveryDate ? 'Recalcular fecha' : 'Calcular fecha')}
                 </Button>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">Productos</h4>
            <div className="border rounded-lg divide-y divide-border max-h-40 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    {item.image && (
                      <div className="w-10 h-10 mr-3 relative shrink-0">
                         <ProductImage src={item.image} alt={item.name} fill className="object-cover rounded-md" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type === 'service' ? 'Servicio' : 'Producto'} x{item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-3">
               <p className="text-lg font-bold">Total: {formatCurrency(order.total)}</p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-4">
            
            {/* Status Change */}
            <div className="p-4 bg-muted/20 rounded-lg border border-border">
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Actualizar Estado
                </label>
                <div className="flex gap-2">
                    <select 
                      value={newStatus} 
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="flex-1 px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    >
                      <option value="quote_requested">Cotización Solicitada</option>
                      <option value="pending_payment">Pendiente de Pago</option>
                      <option value="paid">Pagado</option>
                      <option value="processing">En Proceso</option>
                      <option value="ready">Listo</option>
                      <option value="shipped">Enviado</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                      <option value="refunded">Reembolsado</option>
                    </select>
                    <Button 
                      onClick={handleStatusChange} 
                      disabled={isUpdating || newStatus === order.status}
                      size="sm"
                    >
                      {isUpdating ? '...' : 'Actualizar'}
                    </Button>
                </div>
            </div>

            {/* Notifications */}
            <div className="p-4 bg-muted/20 rounded-lg border border-border">
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Notificar al Cliente
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        className="flex-1 px-3 py-2 border border-input rounded-lg text-sm bg-background"
                        placeholder="Mensaje para el cliente..."
                    />
                    <Button 
                      onClick={handleSendNotification} 
                      disabled={isNotifying || !notificationMessage}
                      variant="outline"
                      size="sm"
                    >
                      {isNotifying ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" /> : <Mail className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function OrdersPage() {
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
  }, []);

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
                      #{order.id.slice(0, 6)}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{order.userName}</div>
                      <div className="text-xs text-muted-foreground">{order.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className="font-normal">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-foreground">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                      {order.createdAt.toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedOrderId(order.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4 text-primary" />
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
        onEstimateDelivery={estimateDelivery}
        onSendNotification={sendStatusUpdate}
      />
    </div>
  );
}
