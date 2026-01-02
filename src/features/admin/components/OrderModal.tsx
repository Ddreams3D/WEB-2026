'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Check, Clock, Truck, Eye } from '@/lib/icons';
import { Order, OrderStatus } from '@/shared/types/domain';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderId: string, status: OrderStatus) => Promise<void> | void;
  order: Order | null;
}

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case 'quote_requested': return 'Cotización';
    case 'pending_payment': return 'Pendiente de Pago';
    case 'paid': return 'Pagado';
    case 'processing': return 'En Proceso';
    case 'ready': return 'Listo';
    case 'shipped': return 'Enviado';
    case 'completed': return 'Completado';
    case 'cancelled': return 'Cancelado';
    case 'refunded': return 'Reembolsado';
    default: return status;
  }
};

export default function OrderModal({ isOpen, onClose, onSave, order }: OrderModalProps) {
  const [status, setStatus] = useState<OrderStatus>('quote_requested');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === order.status) return;
    
    setIsSubmitting(true);
    try {
      await onSave(order.id, status);
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const formatAddress = (addr?: { street: string; city: string; state: string; zip: string; country: string; reference?: string }) => {
    if (!addr) return 'No especificada';
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}${addr.reference ? ` (Ref: ${addr.reference})` : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 border border-neutral-200 dark:border-neutral-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              Pedido #{order.id.substring(0, 8).toUpperCase()}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Realizado el {formatDate(order.createdAt)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Status Section */}
          <section className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Estado del Pedido</h3>
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="flex-1 min-w-[200px] px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800 dark:text-white"
              >
                <option value="quote_requested">Cotización</option>
                <option value="pending_payment">Pendiente de Pago</option>
                <option value="paid">Pagado</option>
                <option value="processing">En Proceso</option>
                <option value="ready">Listo</option>
                <option value="shipped">Enviado</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
                <option value="refunded">Reembolsado</option>
              </select>
              <div className="text-sm text-neutral-500">
                Cambiar el estado notificará al cliente (simulado)
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <section>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">Información del Cliente</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-24 text-neutral-500 dark:text-neutral-400">Nombre:</div>
                  <div className="font-medium text-neutral-900 dark:text-white">{order.userName}</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-24 text-neutral-500 dark:text-neutral-400">Email:</div>
                  <div className="text-neutral-900 dark:text-white">{order.userEmail}</div>
                </div>
                {order.customerPhone && (
                  <div className="flex items-start gap-3">
                    <div className="w-24 text-neutral-500 dark:text-neutral-400">Teléfono:</div>
                    <div className="text-neutral-900 dark:text-white">{order.customerPhone}</div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-24 text-neutral-500 dark:text-neutral-400">Dirección:</div>
                  <div className="text-neutral-900 dark:text-white">{formatAddress(order.shippingAddress)}</div>
                </div>
              </div>
            </section>

            {/* Payment Info */}
            <section>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">Pago y Envío</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-24 text-neutral-500 dark:text-neutral-400">Método:</div>
                  <div className="font-medium text-neutral-900 dark:text-white">{order.paymentMethod || 'No especificado'}</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-24 text-neutral-500 dark:text-neutral-400">Envío:</div>
                  <div className="text-neutral-900 dark:text-white">{order.shippingMethod === 'pickup' ? 'Recojo en Tienda' : 'Envío a Domicilio'}</div>
                </div>
                {order.notes && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-xs">
                    <strong>Nota del cliente:</strong> {order.notes}
                  </div>
                )}
                {order.adminNotes && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs">
                    <strong>Nota Admin:</strong> {order.adminNotes}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Items */}
          <section>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">Productos</h3>
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300">Producto</th>
                    <th className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300 text-center">Cant.</th>
                    <th className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300 text-right">Precio</th>
                    <th className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {order.items.map((item, idx) => (
                    <tr key={item.id || idx} className="bg-white dark:bg-neutral-800">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <div className="w-10 h-10 rounded bg-neutral-100 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <span className="font-medium text-neutral-900 dark:text-white">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-400">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-neutral-600 dark:text-neutral-400">S/ {item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-medium text-neutral-900 dark:text-white">S/ {item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right text-neutral-600 dark:text-neutral-400">Subtotal:</td>
                    <td className="px-4 py-2 text-right font-medium text-neutral-900 dark:text-white">S/ {order.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right text-neutral-600 dark:text-neutral-400">Impuestos:</td>
                    <td className="px-4 py-2 text-right font-medium text-neutral-900 dark:text-white">S/ {order.tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right text-neutral-600 dark:text-neutral-400">Envío:</td>
                    <td className="px-4 py-2 text-right font-medium text-neutral-900 dark:text-white">S/ {order.shippingCost.toFixed(2)}</td>
                  </tr>
                  <tr className="text-lg">
                    <td colSpan={3} className="px-4 py-3 text-right font-bold text-neutral-900 dark:text-white">Total:</td>
                    <td className="px-4 py-3 text-right font-bold text-primary-600 dark:text-primary-400">S/ {order.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 flex justify-end gap-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-b-2xl">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || status === order.status}>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}
