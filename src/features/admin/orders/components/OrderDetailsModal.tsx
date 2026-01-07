import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  XCircle,
  Calendar,
  User as UserIcon,
  Phone,
  Mail
} from '@/lib/icons';
import { Order, OrderStatus } from '@/shared/types/domain';
import { ProductImage } from '@/shared/components/ui/DefaultImage';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onEstimateDelivery: (orderId: string) => Promise<void>;
  onSendNotification: (orderId: string, message: string) => Promise<void>;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onEstimateDelivery,
  onSendNotification, // Keeping this prop for compatibility, but we might use server action directly if parent doesn't handle it
}: OrderDetailsModalProps) {
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
