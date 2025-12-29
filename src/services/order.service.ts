import { Order, OrderStatus } from '@/shared/types/order';
import { orders } from '@/data/orders.data';

// Simple in-memory cache
let ordersCache: { data: Order[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const OrderService = {
  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    // Check cache
    if (ordersCache && (Date.now() - ordersCache.timestamp < CACHE_DURATION)) {
      return ordersCache.data;
    }

    // Sort by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Update cache
    ordersCache = {
      data: sortedOrders,
      timestamp: Date.now()
    };
    
    return sortedOrders;
  },

  // Get order by ID
  async getOrderById(id: string): Promise<Order | undefined> {
    const allOrders = await this.getAllOrders();
    return allOrders.find(o => o.id === id);
  },

  // Get orders by status
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const allOrders = await this.getAllOrders();
    return allOrders.filter(o => o.status === status);
  },

  // Update order status (Mock)
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    if (!ordersCache) {
      await this.getAllOrders();
    }
    
    if (ordersCache) {
      const index = ordersCache.data.findIndex(o => o.id === id);
      if (index !== -1) {
        const updatedOrder = {
          ...ordersCache.data[index],
          status: status,
          updatedAt: new Date()
        };
        ordersCache.data[index] = updatedOrder;
        return updatedOrder;
      }
    }
    return null;
  },

  // Delete order (Mock)
  async deleteOrder(id: string): Promise<boolean> {
    if (ordersCache) {
      ordersCache.data = ordersCache.data.filter(o => o.id !== id);
      return true;
    }
    return true;
  },
  
  // Create order (Mock)
  async createOrder(order: Partial<Order>): Promise<Order> {
    if (!ordersCache) {
      await this.getAllOrders();
    }

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customer: { name: 'Guest', email: 'guest@example.com' },
      date: new Date().toISOString(),
      status: 'pending',
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...order
    } as Order;

    if (ordersCache) {
      ordersCache.data.unshift(newOrder);
    }
    
    return newOrder;
  }
};
