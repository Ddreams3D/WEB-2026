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
  getDoc,
  runTransaction
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderStatus, OrderHistoryEntry } from '@/shared/types/domain';

const COLLECTION_NAME = 'orders';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for orders (more volatile)

const VALID_STATUSES: OrderStatus[] = ['quote_requested', 'pending_payment', 'paid', 'processing', 'ready', 'shipped', 'completed', 'cancelled', 'refunded'];

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

    // Validation
    if (!orderData.userId) throw new Error('User ID is required');
    if (!orderData.items || orderData.items.length === 0) throw new Error('Order must have at least one item');
    if (typeof orderData.total !== 'number' || orderData.total < 0) throw new Error('Invalid total amount');

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

    // Runtime Validation
    if (!VALID_STATUSES.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}`);
    }

    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db!, COLLECTION_NAME, id);
        const orderDoc = await transaction.get(orderRef);
        
        if (!orderDoc.exists()) {
            throw new Error('Order not found');
        }

        const orderData = orderDoc.data();
        const currentStatus = orderData.status as OrderStatus;

        // Validation: Prevent invalid backward transitions
        if (currentStatus !== newStatus) {
            if ((currentStatus === 'completed' || currentStatus === 'refunded') && 
                (newStatus === 'quote_requested' || newStatus === 'pending_payment')) {
                throw new Error(`Cannot revert order from ${currentStatus} to ${newStatus}`);
            }
        }

        const now = new Date();
        const newHistoryEntry: OrderHistoryEntry = {
            status: newStatus,
            timestamp: now,
            note: note || `Estado actualizado a ${newStatus}`,
            updatedBy
        };

        const updates: any = {
            status: newStatus,
            updatedAt: now,
            history: [...(orderData.history || []), newHistoryEntry]
        };

        // Auto-update payment status if needed
        if (newStatus === 'paid' || newStatus === 'processing' || newStatus === 'shipped' || newStatus === 'completed') {
            if (orderData.paymentStatus === 'pending') {
                updates.paymentStatus = 'paid';
            }
        }
        
        if (newStatus === 'refunded') {
            updates.paymentStatus = 'refunded';
        }

        transaction.update(orderRef, updates);
      });

      ordersCache = null;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Add Order Note (Admin or User)
  async addOrderNote(id: string, note: string, updatedBy: string = 'system', isPrivate: boolean = false): Promise<void> {
    if (!db) return;

    if (note.length > 5000) {
        throw new Error('Note is too long (max 5000 chars)');
    }

    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db!, COLLECTION_NAME, id);
        const orderDoc = await transaction.get(orderRef);
        
        if (!orderDoc.exists()) throw new Error('Order not found');
        
        const orderData = orderDoc.data();
        const now = new Date();
        const updates: any = { updatedAt: now };

        if (isPrivate) {
            updates.adminNotes = orderData.adminNotes 
              ? `${orderData.adminNotes}\n[${now.toLocaleString()}] ${note}`
              : `[${now.toLocaleString()}] ${note}`;
        } else {
            const newHistoryEntry: OrderHistoryEntry = {
                status: orderData.status,
                timestamp: now,
                note: note,
                updatedBy
            };
            updates.history = [...(orderData.history || []), newHistoryEntry];
        }

        transaction.update(orderRef, updates);
      });

      ordersCache = null;
    } catch (error) {
      console.error('Error adding order note:', error);
      throw error;
    }
  },

  // Send Order Notification (via API)
  async sendOrderNotification(id: string, message: string, type: 'email' | 'sms' = 'email'): Promise<void> {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, message, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      // Log the notification in order history/notes
      await this.addOrderNote(id, `Notificación enviada (${type}): "${message}"`, 'system', false);
    } catch (error) {
      console.error('Error sending notification:', error);
      // Fallback: log locally if API fails
      await this.addOrderNote(id, `Error enviando notificación (${type}): "${message}"`, 'system', false);
    }
  },

  // Calculate delivery date (via API)
  async calculateDeliveryDate(order: Order): Promise<Date> {
      try {
        const response = await fetch('/api/orders/estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order }),
        });

        if (!response.ok) {
           throw new Error('Failed to calculate delivery date');
        }

        const data = await response.json();
        return new Date(data.estimatedDeliveryDate);
      } catch (error) {
        console.error('Error calculating delivery date via API, falling back to local logic:', error);
        return this.calculateDeliveryDateLocal(order);
      }
  },

  // Local fallback logic
  calculateDeliveryDateLocal(order: Order): Date {
      let baseDays = 7;
      
      // Ajustar días según estado actual
      switch (order.status) {
        case 'quote_requested': baseDays = 10; break;
        case 'pending_payment': baseDays = 7; break;
        case 'processing': baseDays = 5; break;
        case 'ready': baseDays = 1; break; // Listo para recoger/enviar
        case 'shipped': baseDays = 2; break; // Tiempo de tránsito promedio
        default: baseDays = 7;
      }

      // Ajustar si hay servicios personalizados (toman más tiempo)
      const hasCustomServices = order.items.some(i => i.type === 'service'); 
      if (hasCustomServices) {
        baseDays += 5;
      }

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + baseDays);

      // Saltar fines de semana (simple)
      const day = estimatedDelivery.getDay();
      if (day === 0) estimatedDelivery.setDate(estimatedDelivery.getDate() + 1); // Domingo -> Lunes
      if (day === 6) estimatedDelivery.setDate(estimatedDelivery.getDate() + 2); // Sábado -> Lunes

      return estimatedDelivery;
  },

  // Calculate and Update Estimated Delivery Date
  async updateEstimatedDeliveryDate(id: string, date: Date): Promise<void> {
    if (!db) return;
    
    try {
      const orderRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(orderRef, {
        estimatedDeliveryDate: date,
        updatedAt: new Date()
      });
      ordersCache = null;
    } catch (error) {
      console.error('Error updating estimated delivery date:', error);
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
