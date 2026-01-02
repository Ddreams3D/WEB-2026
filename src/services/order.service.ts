import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp,
  updateDoc,
  deleteDoc,
  where,
  limit,
  startAfter,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderStatus, OrderHistoryEntry } from '@/shared/types/domain';

const COLLECTION_NAME = 'orders';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for orders (more volatile)

// In-memory cache
let ordersCache: { data: Order[], timestamp: number } | null = null;

const mapToOrder = (data: any): Order => {
  return {
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt || Date.now()),
    estimatedDeliveryDate: data.estimatedDeliveryDate instanceof Timestamp ? data.estimatedDeliveryDate.toDate() : (data.estimatedDeliveryDate ? new Date(data.estimatedDeliveryDate) : undefined),
    history: (data.history || []).map((h: any) => ({
      ...h,
      timestamp: h.timestamp instanceof Timestamp ? h.timestamp.toDate() : new Date(h.timestamp)
    }))
  };
};

export const OrderService = {
  // Create a new order
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'history'>): Promise<string> {
    if (!db) throw new Error('Database not initialized');

    try {
      const newOrderRef = doc(collection(db, COLLECTION_NAME));
      const now = new Date();
      
      const initialHistory: OrderHistoryEntry = {
        status: orderData.status,
        timestamp: now,
        note: 'Pedido creado',
        updatedBy: orderData.userId
      };

      const newOrder: Order = {
        ...orderData,
        id: newOrderRef.id,
        createdAt: now,
        updatedAt: now,
        history: [initialHistory]
      };

      await setDoc(newOrderRef, newOrder);
      
      // Invalidate cache
      ordersCache = null;
      
      return newOrderRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get all orders (Admin)
  async getAllOrders(forceRefresh = false): Promise<Order[]> {
    if (!forceRefresh && ordersCache && (Date.now() - ordersCache.timestamp < CACHE_DURATION)) {
      return ordersCache.data;
    }

    let orders: Order[] = [];

    if (db) {
      try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          orders = snapshot.docs.map((doc) => mapToOrder(doc.data()));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
    }

    ordersCache = {
      data: orders,
      timestamp: Date.now()
    };
    
    return orders;
  },

  // Get orders by User
  async getUserOrders(userId: string): Promise<Order[]> {
    if (!db) return [];

    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map((doc) => mapToOrder(doc.data()));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Get single order
  async getOrderById(id: string): Promise<Order | undefined> {
    if (!db) return undefined;
    
    // Check cache first
    if (ordersCache) {
      const cached = ordersCache.data.find(o => o.id === id);
      if (cached) return cached;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return mapToOrder(docSnap.data());
      }
      return undefined;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update Status
  async updateOrderStatus(id: string, newStatus: OrderStatus, note?: string, updatedBy: string = 'system'): Promise<void> {
    if (!db) return;

    try {
      const order = await this.getOrderById(id);
      if (!order) throw new Error('Order not found');

      const now = new Date();
      const newHistoryEntry: OrderHistoryEntry = {
        status: newStatus,
        timestamp: now,
        note: note || `Estado actualizado a ${newStatus}`,
        updatedBy
      };

      const updates: Partial<Order> = {
        status: newStatus,
        updatedAt: now,
        history: [...order.history, newHistoryEntry]
      };

      // Auto-update payment status if needed
      if (newStatus === 'paid' || newStatus === 'processing' || newStatus === 'shipped' || newStatus === 'completed') {
        if (order.paymentStatus === 'pending') {
            updates.paymentStatus = 'paid';
        }
      }
      
      if (newStatus === 'refunded') {
        updates.paymentStatus = 'refunded';
      }

      const orderRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(orderRef, updates);

      ordersCache = null;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Seed Initial Orders (for testing)
  async seedInitialOrders(): Promise<void> {
    if (!db) return;
    
    const orders = await this.getAllOrders(true);
    if (orders.length > 0) return;

    // Use dummy users we know exist from UserService seed
    // We'll just put some random IDs if we don't know them, 
    // or we can fetch users first. For now, let's assume 'user-demo-1' exists.

    const dummyOrders: any[] = [
      {
        userId: 'user-demo-1',
        userEmail: 'cliente@ejemplo.com',
        userName: 'Cliente Demo',
        items: [
          {
            id: 'item-1',
            type: 'product',
            name: 'Maceta Geometria',
            quantity: 1,
            price: 45.00,
            total: 45.00,
            image: '/images/products/maceta-geo.jpg'
          },
          {
            id: 'item-2',
            type: 'service',
            name: 'Servicio de Impresión 3D Personalizada',
            quantity: 1,
            price: 150.00,
            total: 150.00,
            customizations: { description: 'Pieza mecánica repuesto' }
          }
        ],
        subtotal: 195.00,
        tax: 0,
        shippingCost: 15.00,
        discount: 0,
        total: 210.00,
        currency: 'PEN',
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'yape',
        shippingMethod: 'delivery',
        shippingAddress: {
          street: 'Av. Larco 123',
          city: 'Miraflores',
          state: 'Lima',
          zip: '15074',
          country: 'Peru'
        },
        createdAt: new Date('2024-03-01T10:00:00'),
        updatedAt: new Date('2024-03-01T12:00:00'),
        history: [
            { status: 'pending_payment', timestamp: new Date('2024-03-01T10:00:00'), note: 'Pedido creado', updatedBy: 'user-demo-1' },
            { status: 'paid', timestamp: new Date('2024-03-01T10:15:00'), note: 'Pago recibido por Yape', updatedBy: 'system' },
            { status: 'processing', timestamp: new Date('2024-03-01T12:00:00'), note: 'Iniciando producción', updatedBy: 'admin-user-1' }
        ]
      },
      {
        userId: 'user-vip-1',
        userEmail: 'vip@cliente.com',
        userName: 'Cliente VIP',
        items: [
          {
            id: 'item-3',
            type: 'product',
            name: 'Lámpara Voronoi',
            quantity: 2,
            price: 120.00,
            total: 240.00
          }
        ],
        subtotal: 240.00,
        tax: 0,
        shippingCost: 0, // Free shipping for VIP
        discount: 24.00, // 10% off
        total: 216.00,
        currency: 'PEN',
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'transfer',
        shippingMethod: 'delivery',
        shippingAddress: {
          street: 'Calle Los Pinos 456',
          city: 'San Isidro',
          state: 'Lima',
          zip: '15073',
          country: 'Peru'
        },
        createdAt: new Date('2024-02-15T09:00:00'),
        updatedAt: new Date('2024-02-20T16:00:00'),
        history: [
            { status: 'pending_payment', timestamp: new Date('2024-02-15T09:00:00'), note: 'Pedido creado', updatedBy: 'user-vip-1' },
            { status: 'paid', timestamp: new Date('2024-02-15T09:30:00'), note: 'Transferencia confirmada', updatedBy: 'admin-user-1' },
            { status: 'shipped', timestamp: new Date('2024-02-18T10:00:00'), note: 'Enviado con Olva Courier', updatedBy: 'admin-user-1' },
            { status: 'completed', timestamp: new Date('2024-02-20T16:00:00'), note: 'Entregado', updatedBy: 'system' }
        ]
      }
    ];

    // Direct setDoc for seed to preserve specific history and dates
    for (const order of dummyOrders) {
        const ref = doc(collection(db, COLLECTION_NAME));
        await setDoc(ref, {
            ...order,
            id: ref.id
        });
    }
    
    ordersCache = null;
  }
};
