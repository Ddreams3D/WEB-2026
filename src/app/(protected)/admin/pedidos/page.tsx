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
  User as UserIcon
} from '@/lib/icons';
import { cn } from '@/lib/utils';
import { OrderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/shared/types/domain';
import { Badge } from '@/components/ui/badge';

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

function OrderDetailsModal({ order, isOpen, onClose, onUpdateStatus }: {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');

  useEffect(() => {
    if (order) setNewStatus(order.status);
  }, [order]);

  if (!isOpen || !order) return null;

  const handleStatusChange = async () => {
    if (!newStatus || newStatus === order.status) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, newStatus);
      onClose();
    } catch (error) {
      alert('Error al actualizar estado');
    } finally {
      setIsUpdating(false);
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
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">Productos</h4>
            <div className="border rounded-lg divide-y divide-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover mr-3" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type === 'service' ? 'Servicio Personalizado' : 'Producto'}
                        {item.customizations && (
                          <span className="ml-1 px-1 bg-primary/10 text-primary rounded text-[10px]">
                            Personalizado
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(item.total)}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-3">
               <p className="text-lg font-bold">Total: {formatCurrency(order.total)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
             <div className="flex-1 mr-4">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Cambiar Estado
                </label>
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
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
             </div>
             <div className="flex items-end">
                <Button 
                  onClick={handleStatusChange} 
                  disabled={isUpdating || newStatus === order.status}
                  variant="gradient"
                >
                  {isUpdating ? 'Actualizando...' : 'Actualizar Estado'}
                </Button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      await OrderService.seedInitialOrders(); // Ensure seed data exists
      const data = await OrderService.getAllOrders(true);
      setOrders(data);
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
    await OrderService.updateOrderStatus(id, status, undefined, 'admin'); // TODO: Use real admin ID
    await fetchOrders();
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
            {formatCurrency(orders.reduce((acc, o) => o.status !== 'cancelled' ? acc + o.total : acc, 0))}
          </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
           <p className="text-xs text-muted-foreground uppercase font-bold">Pendientes</p>
           <p className="text-2xl font-bold mt-1 text-yellow-600">
             {orders.filter(o => o.status === 'pending_payment').length}
           </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
           <p className="text-xs text-muted-foreground uppercase font-bold">En Proceso</p>
           <p className="text-2xl font-bold mt-1 text-purple-600">
             {orders.filter(o => o.status === 'processing').length}
           </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
           <p className="text-xs text-muted-foreground uppercase font-bold">Completados</p>
           <p className="text-2xl font-bold mt-1 text-green-600">
             {orders.filter(o => o.status === 'completed').length}
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
            onChange={(e) => setStatusFilter(e.target.value as any)}
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
                        onClick={() => setSelectedOrder(order)}
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
        onClose={() => setSelectedOrder(null)} 
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
