import React from 'react';
import { Order } from '@/shared/types/domain';

interface OrderModalCustomerInfoProps {
  order: Order;
}

export function OrderModalCustomerInfo({ order }: OrderModalCustomerInfoProps) {
  const formatAddress = (addr?: { street: string; city: string; state: string; zip: string; country: string; reference?: string }) => {
    if (!addr) return 'No especificada';
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}${addr.reference ? ` (Ref: ${addr.reference})` : ''}`;
  };

  return (
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
  );
}
