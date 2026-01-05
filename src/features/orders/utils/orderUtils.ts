import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Order, OrderStatus } from '@/shared/types/domain';

export const getProgressPercentage = (status: OrderStatus) => {
  const statusProgress: Record<string, number> = {
    'quote_requested': 5,
    'pending_payment': 10,
    'paid': 25,
    'processing': 50,
    'ready': 75,
    'shipped': 90,
    'completed': 100,
    'cancelled': 0,
    'refunded': 0
  };
  
  return statusProgress[status] || 0;
};

export const formatDate = (date: Date | string) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy HH:mm', { locale: es });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

export const getOrderTitle = (order: Order) => {
  if (order.items.length === 0) return 'Pedido sin items';
  const firstItem = order.items[0];
  const otherItemsCount = order.items.length - 1;
  return otherItemsCount > 0 
    ? `${firstItem.name} + ${otherItemsCount} más`
    : firstItem.name;
};
