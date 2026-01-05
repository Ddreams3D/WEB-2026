import React from 'react';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/shared/types/domain';
import { 
  FileText, 
  Clock, 
  DollarSign, 
  Package, 
  CheckCircle, 
  Truck, 
  XCircle, 
  AlertCircle 
} from '@/lib/icons';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
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
