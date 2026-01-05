'use client';

import { useEffect, useState } from 'react';
import { useOrderTracking } from '@/contexts/OrderTrackingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, RefreshCw, BarChart3, Activity, Package } from '@/lib/icons';
import { OrderStats } from '@/features/orders/components/OrderStats';
import { OrderFilters } from '@/features/orders/components/OrderFilters';
import { ActiveOrderCard } from '@/features/orders/components/ActiveOrderCard';
import { CompletedOrdersList } from '@/features/orders/components/CompletedOrdersList';
import { OrderAnalytics } from '@/features/orders/components/OrderAnalytics';
import { useOrderFiltering } from '@/features/orders/hooks/useOrderFiltering';

export default function PedidosPage() {
  const { orders, notifications, loadOrders, markNotificationAsRead } = useOrderTracking();
  const [loading, setLoading] = useState(false);
  
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOrders
  } = useOrderFiltering(orders);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const refreshOrders = async () => {
    setLoading(true);
    await loadOrders();
    setLoading(false);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Seguimiento de Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitorea el estado de tus pedidos en tiempo real
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={refreshOrders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Reportes
          </Button>
        </div>
      </div>

      {/* Notificaciones (Simplified/Hidden if empty) */}
      {notifications.filter(n => !n.read).length > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
              <Bell className="h-5 w-5 mr-2" />
              Notificaciones ({notifications.filter(n => !n.read).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications.filter(n => !n.read).slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    Marcar como leída
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Pedidos Activos</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        {/* Pedidos Activos */}
        <TabsContent value="active" className="space-y-6">
          <OrderStats orders={orders} />
          
          <OrderFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay pedidos activos</h3>
                  <p className="text-muted-foreground text-center">
                    Cuando tengas pedidos en proceso, aparecerán aquí.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <ActiveOrderCard key={order.id} order={order} />
              ))
            )}
          </div>
        </TabsContent>

        {/* Pedidos Completados */}
        <TabsContent value="completed" className="space-y-6">
          <CompletedOrdersList orders={orders} />
        </TabsContent>

        {/* Analíticas */}
        <TabsContent value="analytics" className="space-y-6">
          <OrderAnalytics orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
