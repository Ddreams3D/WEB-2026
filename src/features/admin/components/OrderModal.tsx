'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from '@/lib/icons';
import { Order, OrderStatus } from '@/shared/types/domain';
import { useOrderForm } from '../hooks/useOrderForm';
import { OrderModalStatus } from './order-modal/OrderModalStatus';
import { OrderModalCustomerInfo } from './order-modal/OrderModalCustomerInfo';
import { OrderModalPaymentInfo } from './order-modal/OrderModalPaymentInfo';
import { OrderModalItems } from './order-modal/OrderModalItems';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderId: string, status: OrderStatus) => Promise<void> | void;
  order: Order | null;
}

export default function OrderModal({ isOpen, onClose, onSave, order }: OrderModalProps) {
  const {
    status,
    setStatus,
    isSubmitting,
    handleSubmit
  } = useOrderForm({ order, isOpen, onSave, onClose });

  if (!isOpen || !order) return null;

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
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
          
          <OrderModalStatus status={status} setStatus={setStatus} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <OrderModalCustomerInfo order={order} />
            <OrderModalPaymentInfo order={order} />
          </div>

          <OrderModalItems order={order} />

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
