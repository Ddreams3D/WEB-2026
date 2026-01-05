import { useState, useMemo } from 'react';
import { Order, OrderStatus } from '@/shared/types/domain';

export type FilterStatus = OrderStatus | 'all';

export function useOrderFiltering(orders: Order[]) {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    
    // Filtrar por tab activo
    if (activeTab === 'active') {
      filtered = filtered.filter(order => 
        !['completed', 'cancelled', 'refunded'].includes(order.status)
      );
    } else if (activeTab === 'completed') {
      // Logic handled by CompletedOrdersList, but if we want to filter generic list:
      filtered = filtered.filter(order => 
        ['completed', 'cancelled', 'refunded'].includes(order.status)
      );
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    return filtered;
  }, [orders, activeTab, searchTerm, statusFilter]);

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOrders
  };
}
