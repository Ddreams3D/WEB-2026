'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package as PackageIcon, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  MoreVertical as MoreVerticalIcon,
  Eye as EyeIcon,
  Check as CheckIcon,
  X as XIcon,
  Clock as ClockIcon,
  Truck as TruckIcon
} from '@/lib/icons';
import { Button } from '@/components/ui';
import { Order, OrderStatus } from '@/shared/types/order';
import { OrderService } from '@/services/order.service';
import OrderModal from '@/features/admin/components/OrderModal';
import { useToast } from '@/components/ui/ToastManager';

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'shipped':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'processing': return 'Procesando';
    case 'shipped': return 'Enviado';
    case 'delivered': return 'Entregado';
    case 'cancelled': return 'Cancelado';
    default: return status;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { showSuccess, showError } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await OrderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      showError('Error', 'No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleSaveStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, status);
      await loadOrders();
      showSuccess('Pedido actualizado', `El estado del pedido #${orderId} se ha actualizado a ${getStatusLabel(status)}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating order:', error);
      showError('Error', 'No se pudo actualizar el estado del pedido');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 tracking-tight">
            <PackageIcon className="w-8 h-8 text-primary" />
            Gestión de Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra y realiza seguimiento de los pedidos de la tienda
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button onClick={() => loadOrders()} variant="outline" className="gap-2">
             <ClockIcon className="w-4 h-4" /> Actualizar
           </Button>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground transition-all duration-200 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground transition-all duration-200 outline-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="processing">Procesando</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-sm font-semibold text-foreground">ID Pedido</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Cliente</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Fecha</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Total</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Cargando pedidos...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleViewOrder(order)}>
                    <td className="px-6 py-4">
                      <span className="font-medium text-primary">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1.5 ${getStatusColor(order.status)}`}>
                        {order.status === 'pending' && <ClockIcon className="w-3 h-3" />}
                        {order.status === 'processing' && <ClockIcon className="w-3 h-3" />}
                        {order.status === 'shipped' && <TruckIcon className="w-3 h-3" />}
                        {order.status === 'delivered' && <CheckIcon className="w-3 h-3" />}
                        {order.status === 'cancelled' && <XIcon className="w-3 h-3" />}
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      S/ {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleViewOrder(order); }}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" 
                          title="Ver detalles"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStatus}
        order={selectedOrder}
      />
    </div>
  );
}
