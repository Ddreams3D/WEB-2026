'use client';

import { useState, useEffect } from 'react';
import { useOrderTracking } from '@/contexts/OrderTrackingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Package, Search, Filter, Eye, Download, Bell, Clock, CheckCircle, AlertCircle, XCircle, Truck, Factory, Calendar, MapPin, User, Phone, Mail, Printer, Wrench, PackageCheck, ArrowRight, RefreshCw, BarChart3, TrendingUp, Activity, FileText } from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Order, OrderStatus } from '@/shared/types/domain';

type FilterStatus = OrderStatus | 'all';

export default function PedidosPage() {
  const { orders, notifications, loadOrders, markNotificationAsRead } = useOrderTracking();
  
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    let filtered = orders;
    
    // Filtrar por tab activo
    if (activeTab === 'active') {
      filtered = filtered.filter(order => 
        !['completed', 'cancelled', 'refunded'].includes(order.status)
      );
    } else if (activeTab === 'completed') {
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
    
    setFilteredOrders(filtered);
  }, [orders, activeTab, searchTerm, statusFilter]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'quote_requested':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'pending_payment':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Factory className="h-4 w-4 text-purple-500" />;
      case 'ready':
        return <PackageCheck className="h-4 w-4 text-indigo-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4 text-gray-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'quote_requested': 'outline',
      'pending_payment': 'outline',
      'paid': 'secondary',
      'processing': 'secondary',
      'ready': 'secondary',
      'shipped': 'default',
      'completed': 'default',
      'cancelled': 'destructive',
      'refunded': 'outline'
    };
    
    const labels: Record<string, string> = {
      'quote_requested': 'Cotización',
      'pending_payment': 'Pendiente de Pago',
      'paid': 'Pagado',
      'processing': 'En Proceso',
      'ready': 'Listo',
      'shipped': 'Enviado',
      'completed': 'Completado',
      'cancelled': 'Cancelado',
      'refunded': 'Reembolsado'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getProgressPercentage = (status: OrderStatus) => {
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

  const formatDate = (date: Date | string) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const refreshOrders = async () => {
    setLoading(true);
    await loadOrders();
    setLoading(false);
  };

  const getOrderTitle = (order: Order) => {
    if (order.items.length === 0) return 'Pedido sin items';
    const firstItem = order.items[0];
    const otherItemsCount = order.items.length - 1;
    return otherItemsCount > 0 
      ? `${firstItem.name} + ${otherItemsCount} más`
      : firstItem.name;
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
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Activos</p>
                    <p className="text-2xl font-bold">
                      {orders.filter(o => !['completed', 'cancelled', 'refunded'].includes(o.status)).length}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">En Proceso</p>
                    <p className="text-2xl font-bold">
                      {orders.filter(o => o.status === 'processing').length}
                    </p>
                  </div>
                  <Factory className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enviados</p>
                    <p className="text-2xl font-bold">
                      {orders.filter(o => o.status === 'shipped').length}
                    </p>
                  </div>
                  <Truck className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        orders
                          .filter(o => !['completed', 'cancelled', 'refunded'].includes(o.status))
                          .reduce((sum, order) => sum + order.total, 0)
                      )}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por ID de orden o producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as FilterStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="quote_requested">Cotización</SelectItem>
                    <SelectItem value="pending_payment">Pendiente de Pago</SelectItem>
                    <SelectItem value="paid">Pagado</SelectItem>
                    <SelectItem value="processing">En Proceso</SelectItem>
                    <SelectItem value="ready">Listo</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="refunded">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de pedidos */}
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
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(order.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              #{order.id.substring(0, 8).toUpperCase()}
                            </h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-muted-foreground mb-2">{getOrderTitle(order)}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Creado: {formatDate(order.createdAt)}
                            </span>
                            {order.estimatedDeliveryDate && (
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Entrega estimada: {formatDate(order.estimatedDeliveryDate)}
                              </span>
                            )}
                            <span className="font-medium text-primary">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/pedidos/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso del pedido</span>
                        <span className="font-medium">{getProgressPercentage(order.status)}%</span>
                      </div>
                      <Progress value={getProgressPercentage(order.status)} className="h-2" />
                    </div>
                    
                    {/* Timeline resumido */}
                    {order.history && order.history.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Último movimiento:</span>
                          <span className="font-medium">
                            {order.history[order.history.length - 1]?.note || 'Actualización de estado'}
                          </span>
                          <span className="text-muted-foreground">
                            • {formatDate(order.history[order.history.length - 1]?.timestamp)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Pedidos Completados */}
        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Completados</CardTitle>
              <CardDescription>
                Historial de pedidos entregados y cancelados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(o => ['completed', 'cancelled', 'refunded'].includes(o.status)).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold">#{order.id.substring(0, 8).toUpperCase()}</h3>
                        <p className="text-sm text-muted-foreground">{getOrderTitle(order)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(order.status)}
                      <span className="font-medium">{formatCurrency(order.total)}</span>
                      <Link href={`/pedidos/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analíticas */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pedidos totales:</span>
                    <span className="font-medium">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entregados:</span>
                    <span className="font-medium text-green-600">
                      {orders.filter(o => o.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">En proceso:</span>
                    <span className="font-medium text-blue-600">
                      {orders.filter(o => !['completed', 'cancelled', 'refunded'].includes(o.status)).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cancelados:</span>
                    <span className="font-medium text-red-600">
                      {orders.filter(o => o.status === 'cancelled').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tiempo Promedio de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">5.2 días</div>
                  <p className="text-muted-foreground">Tiempo promedio desde confirmación hasta entrega</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}