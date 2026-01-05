'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrderTracking } from '@/contexts/OrderTrackingContext';
import { Order } from '@/shared/types/domain';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package, RefreshCw, Download } from '@/lib/icons';
import { formatDate } from '@/features/orders/utils/orderUtils';

// Modular Components
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { OrderIcon } from '@/features/orders/components/OrderIcon';
import { OrderProgress } from '@/features/orders/components/OrderProgress';
import { OrderTimeline } from '@/features/orders/components/OrderTimeline';
import { OrderCustomerInfo } from '@/features/orders/components/OrderCustomerInfo';
import { OrderItemsList } from '@/features/orders/components/OrderItemsList';
import { OrderFinancialSummary } from '@/features/orders/components/OrderFinancialSummary';
import { OrderDocuments } from '@/features/orders/components/OrderDocuments';
import { OrderSupportSidebar } from '@/features/orders/components/OrderSupportSidebar';

export default function OrderDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { orders, loadOrders } = useOrderTracking();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    const orderId = params.id as string;
    
    if (orders.length === 0) {
      loadOrders().then(() => setLoading(false));
    } else {
      const foundOrder = orders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      }
      setLoading(false);
    }
  }, [params.id, orders, loadOrders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Pedido no encontrado</h2>
            <p className="text-muted-foreground text-center mb-4">
              El pedido que buscas no existe o no tienes permisos para verlo.
            </p>
            <Link href="/pedidos">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Pedidos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/pedidos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Pedido #{order.id.substring(0, 8).toUpperCase()}
              </h1>
              <div className="flex items-center space-x-2">
                <OrderIcon status={order.status} />
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <p className="text-muted-foreground mt-1">
              {order.userName} • Creado el {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <OrderProgress order={order} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
            </TabsList>

            {/* Timeline */}
            <TabsContent value="timeline" className="space-y-6">
              <OrderTimeline order={order} />
            </TabsContent>

            {/* Detalles */}
            <TabsContent value="details" className="space-y-6">
              <OrderCustomerInfo order={order} />
              <OrderItemsList order={order} />
              <OrderFinancialSummary order={order} />
            </TabsContent>

            {/* Documentos */}
            <TabsContent value="documents" className="space-y-6">
              <OrderDocuments order={order} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <OrderSupportSidebar />
        </div>
      </div>
    </div>
  );
}
