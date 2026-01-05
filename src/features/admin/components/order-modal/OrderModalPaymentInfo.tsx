import React from 'react';
import { Order } from '@/shared/types/domain';

interface OrderModalPaymentInfoProps {
  order: Order;
}

export function OrderModalPaymentInfo({ order }: OrderModalPaymentInfoProps) {
  return (
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
  );
}
