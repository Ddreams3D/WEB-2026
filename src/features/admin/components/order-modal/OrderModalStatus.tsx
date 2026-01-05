import React from 'react';
import { OrderStatus } from '@/shared/types/domain';

interface OrderModalStatusProps {
  status: OrderStatus;
  setStatus: (status: OrderStatus) => void;
}

export function OrderModalStatus({ status, setStatus }: OrderModalStatusProps) {
  return (
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
  );
}
