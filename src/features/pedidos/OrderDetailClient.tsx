'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrderTracking } from '@/contexts/OrderTrackingContext';
import { Order, OrderStatus } from '@/shared/types/domain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package, Clock, CheckCircle, AlertCircle, XCircle, Truck, Factory, Calendar, MapPin, User, Phone, Mail, Printer, Wrench, PackageCheck, Download, Share, MessageSquare, Camera, FileText, DollarSign, Building, Activity, RefreshCw, Bell, Eye, ExternalLink } from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

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
    
    // Si orders está vacío, intentamos cargar (aunque el contexto ya lo hace)
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

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      'quote_requested': 'bg-gray-100 text-gray-800 border-gray-200',
      'pending_payment': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'paid': 'bg-blue-100 text-blue-800 border-blue-200',
      'processing': 'bg-purple-100 text-purple-800 border-purple-200',
      'ready': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'shipped': 'bg-blue-600 text-white border-blue-700',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'refunded': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'quote_requested':
        return <FileText className="h-4 w-4" />;
      case 'pending_payment':
        return <Clock className="h-4 w-4" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Factory className="h-4 w-4" />;
      case 'ready':
        return <PackageCheck className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
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
    return labels[status] || status;
  };

  const getProgressPercentage = (status: OrderStatus) => {
    const progress: Record<string, number> = {
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
    return progress[status] || 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd/MM/yyyy', { locale: es });
  };

  const formatDateTime = (date: Date | string) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd/MM/yyyy HH:mm', { locale: es });
  };

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
              <Badge className={`${getStatusColor(order.status)} border`}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{getStatusLabel(order.status)}</span>
              </Badge>
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
          {/* <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Compartir
          </Button> */}
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso del Pedido</span>
              <span>{getProgressPercentage(order.status)}%</span>
            </div>
            <Progress value={getProgressPercentage(order.status)} className="h-2" />
          </div>
        </CardContent>
      </Card>

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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Seguimiento del Pedido
                  </CardTitle>
                  <CardDescription>
                    Historial completo de eventos y actualizaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {order.history && order.history.length > 0 ? (
                      [...order.history].reverse().map((event, index) => (
                        <div key={index} className="relative">
                          {index < order.history.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                          )}
                          
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-background border-2 border-border rounded-full flex items-center justify-center">
                              {getStatusIcon(event.status)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-semibold">{getStatusLabel(event.status)}</h3>
                                <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{event.note || 'Actualización de estado'}</p>
                              
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                {event.updatedBy && (
                                  <div className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    {event.updatedBy === 'system' ? 'Sistema' : event.updatedBy}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center">No hay historial disponible.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Detalles */}
            <TabsContent value="details" className="space-y-6">
              {/* Información del cliente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Información del Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Nombre / Empresa:</span>
                        <p className="font-medium">{order.userName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{order.userEmail}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {order.shippingAddress && (
                        <div>
                          <span className="text-sm text-muted-foreground">Dirección de Envío:</span>
                          <p className="font-medium">
                            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
                          </p>
                        </div>
                      )}
                      {order.estimatedDeliveryDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Entrega estimada: {formatDate(order.estimatedDeliveryDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items del pedido */}
              <Card>
                <CardHeader>
                  <CardTitle>Items del Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                {item.type === 'service' ? 'Servicio' : 'Producto'}
                            </p>
                            
                            {item.customizations && (
                                <div className="mt-2 text-sm bg-muted p-2 rounded">
                                    <p className="font-medium text-xs text-muted-foreground mb-1">Personalización:</p>
                                    <pre className="whitespace-pre-wrap font-sans text-xs">
                                        {JSON.stringify(item.customizations, null, 2)}
                                    </pre>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                              <div>
                                <span>Cantidad: </span>
                                <span className="font-medium text-foreground">{item.quantity}</span>
                              </div>
                              <div>
                                <span>Precio Unitario: </span>
                                <span className="font-medium text-foreground">{formatCurrency(item.price)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatCurrency(item.total)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Resumen Financiero */}
               <Card>
                <CardHeader>
                  <CardTitle>Resumen Financiero</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Envío:</span>
                        <span>{formatCurrency(order.shippingCost)}</span>
                    </div>
                     {order.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Descuento:</span>
                            <span>-{formatCurrency(order.discount)}</span>
                        </div>
                    )}
                     {order.tax > 0 && (
                        <div className="flex justify-between text-sm">
                            <span>Impuestos:</span>
                            <span>{formatCurrency(order.tax)}</span>
                        </div>
                    )}
                    <Separator className="my-2"/>
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            {/* Documentos */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Documentos del Pedido
                  </CardTitle>
                  <CardDescription>
                    Documentos generados automáticamente para este pedido.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mock documents for now since Order doesn't have a documents field yet */}
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">Resumen del Pedido</p>
                          <p className="text-sm text-muted-foreground">Generado el {formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Info - Could add quick actions or contact info here */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ayuda</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        ¿Tienes problemas con tu pedido? Contáctanos.
                    </p>
                    <Button variant="outline" className="w-full justify-start mb-2">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contactar Soporte
                    </Button>
                     <Button variant="outline" className="w-full justify-start">
                        <Phone className="mr-2 h-4 w-4" />
                        Llamar
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
