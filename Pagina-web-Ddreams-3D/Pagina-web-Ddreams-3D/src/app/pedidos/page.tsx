'use client';

import { useState, useEffect } from 'react';
import { useB2B } from '@/contexts/B2BContext';
import { useOrderTracking } from '@/contexts/OrderTrackingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Package, Search, Filter, Eye, Download, Bell, Clock, CheckCircle, AlertCircle, XCircle, Truck, Factory, Calendar, MapPin, User, Phone, Mail, Printer, Wrench, PackageCheck, ArrowRight, RefreshCw, BarChart3, TrendingUp, Activity } from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

type OrderStatus = 'pending' | 'confirmed' | 'in-production' | 'quality-check' | 'packaging' | 'shipped' | 'delivered' | 'cancelled';
type FilterStatus = OrderStatus | 'all';

interface OrderTimeline {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  location?: string;
}

export default function PedidosPage() {
  const { currentCompany } = useB2B();
  const { orders, notifications, loadOrders, markNotificationAsRead } = useOrderTracking();
  
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    
    // Filtrar por tab activo
    if (activeTab === 'active') {
      filtered = filtered.filter(order => 
        !['delivered', 'cancelled'].includes(order.status)
      );
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(order => 
        ['delivered', 'cancelled'].includes(order.status)
      );
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [orders, activeTab, searchTerm, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'in-production':
        return <Factory className="h-4 w-4 text-purple-500" />;
      case 'quality-check':
        return <Wrench className="h-4 w-4 text-orange-500" />;
      case 'packaging':
        return <PackageCheck className="h-4 w-4 text-indigo-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'pending': 'outline',
      'confirmed': 'secondary',
      'in-production': 'secondary',
      'quality-check': 'secondary',
      'packaging': 'secondary',
      'shipped': 'default',
      'delivered': 'default',
      'cancelled': 'destructive'
    };
    
    const labels: Record<string, string> = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'in-production': 'En Producción',
      'quality-check': 'Control de Calidad',
      'packaging': 'Empaquetado',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getProgressPercentage = (status: string) => {
    const statusProgress: Record<string, number> = {
      'pending': 10,
      'confirmed': 20,
      'in-production': 50,
      'quality-check': 75,
      'packaging': 85,
      'shipped': 95,
      'delivered': 100,
      'cancelled': 0
    };
    
    return statusProgress[status] || 0;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
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

  const getEstimatedDelivery = (order: any) => {
    // Calcular fecha estimada basada en el estado actual
    const baseDate = new Date(order.createdAt);
    let daysToAdd = 7; // Por defecto 7 días
    
    switch (order.status) {
      case 'pending':
      case 'confirmed':
        daysToAdd = 7;
        break;
      case 'in-production':
        daysToAdd = 5;
        break;
      case 'quality-check':
      case 'packaging':
        daysToAdd = 2;
        break;
      case 'shipped':
        daysToAdd = 1;
        break;
      default:
        daysToAdd = 7;
    }
    
    const estimatedDate = new Date(baseDate);
    estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);
    return estimatedDate;
  };

  if (!currentCompany) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Empresarial Requerido</h2>
            <p className="text-muted-foreground text-center">
              Para ver el seguimiento de pedidos, necesitas iniciar sesión con una cuenta empresarial.
            </p>
          </CardContent>
        </Card>
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

      {/* Notificaciones */}
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
                      {orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}
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
                    <p className="text-sm font-medium text-muted-foreground">En Producción</p>
                    <p className="text-2xl font-bold">
                      {orders.filter(o => o.status === 'in-production').length}
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
                          .filter(o => !['delivered', 'cancelled'].includes(o.status))
                          .reduce((sum, order) => sum + order.totalAmount, 0)
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
                    placeholder="Buscar por número de orden o título..."
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
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="in-production">En Producción</SelectItem>
                    <SelectItem value="quality-check">Control de Calidad</SelectItem>
                    <SelectItem value="packaging">Empaquetado</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
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
                              {order.orderNumber}
                            </h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-muted-foreground mb-2">{order.title}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Creado: {formatDate(order.createdAt)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Entrega estimada: {formatDate(getEstimatedDelivery(order).toISOString())}
                            </span>
                            <span className="font-medium text-primary">
                              {formatCurrency(order.totalAmount)}
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
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
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
                    {order.timeline && order.timeline.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Última actualización:</span>
                          <span className="font-medium">
                            {order.timeline[order.timeline.length - 1]?.name}
                          </span>
                          <span className="text-muted-foreground">
                            • {formatDate(order.timeline[order.timeline.length - 1]?.timestamp)}
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
                {orders.filter(o => ['delivered', 'cancelled'].includes(o.status)).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold">{order.orderNumber}</h3>
                        <p className="text-sm text-muted-foreground">{order.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(order.status)}
                      <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
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
                      {orders.filter(o => o.status === 'delivered').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">En proceso:</span>
                    <span className="font-medium text-blue-600">
                      {orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}
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