'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useB2B } from '@/contexts/B2BContext';
import { useOrderTracking, OrderStatusType } from '@/contexts/OrderTrackingContext';
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

interface TimelineEvent {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  location?: string;
  images?: string[];
  documents?: string[];
  notes?: string;
}

export default function OrderDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { currentCompany } = useB2B();
  const { orders, updateOrderStatus } = useOrderTracking();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    const orderId = params.id as string;
    const foundOrder = orders.find(o => o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
    
    setLoading(false);
  }, [params.id, orders]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'in_production': 'bg-purple-100 text-purple-800 border-purple-200',
      'quality_check': 'bg-orange-100 text-orange-800 border-orange-200',
      'ready_to_ship': 'bg-green-100 text-green-800 border-green-200',
      'shipped': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'pending': <Clock className="h-4 w-4" />,
      'confirmed': <CheckCircle className="h-4 w-4" />,
      'in_production': <Factory className="h-4 w-4" />,
      'quality_check': <Wrench className="h-4 w-4" />,
      'ready_to_ship': <PackageCheck className="h-4 w-4" />,
      'shipped': <Truck className="h-4 w-4" />,
      'delivered': <Package className="h-4 w-4" />,
      'cancelled': <XCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'in_production': 'En Producción',
      'quality_check': 'Control de Calidad',
      'ready_to_ship': 'Listo para Envío',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  };

  const getProgressPercentage = (status: string) => {
    const progress: Record<string, number> = {
      'pending': 10,
      'confirmed': 25,
      'in_production': 50,
      'quality_check': 75,
      'ready_to_ship': 85,
      'shipped': 95,
      'delivered': 100,
      'cancelled': 0
    };
    return progress[status] || 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleStatusUpdate = async (newStatus: OrderStatusType) => {
    if (!order) return;
    
    try {
      await updateOrderStatus(order.id, newStatus);
      // Actualizar el estado local
      setOrder({ ...order, status: newStatus });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Mock timeline data
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      status: 'pending',
      title: 'Pedido Creado',
      description: 'El pedido ha sido creado y está pendiente de confirmación',
      timestamp: order?.createdAt || new Date().toISOString(),
      user: 'Sistema',
      location: 'Portal Web'
    },
    {
      id: '2',
      status: 'confirmed',
      title: 'Pedido Confirmado',
      description: 'El pedido ha sido confirmado y enviado a producción',
      timestamp: order?.confirmedAt || new Date().toISOString(),
      user: 'Equipo de Ventas',
      location: 'Oficina Principal'
    }
  ];

  if (!currentCompany) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Empresarial Requerido</h2>
            <p className="text-muted-foreground text-center">
              Para ver detalles de pedidos, necesitas iniciar sesión con una cuenta empresarial.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                Pedido #{order.orderNumber}
              </h1>
              <Badge className={`${getStatusColor(order.status)} border`}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{getStatusLabel(order.status)}</span>
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {order.customerName} • Creado el {formatDate(order.createdAt)}
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
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Compartir
          </Button>
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="communication">Comunicación</TabsTrigger>
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
                    {timelineEvents.map((event, index) => (
                      <div key={event.id} className="relative">
                        {index < timelineEvents.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                        )}
                        
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-background border-2 border-border rounded-full flex items-center justify-center">
                            {getStatusIcon(event.status)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-semibold">{event.title}</h3>
                              <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              {event.user && (
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {event.user}
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                            
                            {event.images && event.images.length > 0 && (
                              <div className="mt-2">
                                <div className="flex space-x-2">
                                  {event.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                                      <Camera className="h-6 w-6 text-gray-400" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {event.notes && (
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                {event.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
                        <p className="font-medium">{order.customerName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{order.customerEmail}</span>
                      </div>
                      {order.customerPhone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{order.customerPhone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {order.shippingAddress && (
                        <div>
                          <span className="text-sm text-muted-foreground">Dirección de Envío:</span>
                          <p className="font-medium">{order.shippingAddress}</p>
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Entrega estimada: {formatDate(order.estimatedDelivery)}</span>
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
                    {order.items?.map((item: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                              <div>
                                <span>Cantidad: </span>
                                <span className="font-medium text-foreground">{item.quantity}</span>
                              </div>
                              <div>
                                <span>Precio Unitario: </span>
                                <span className="font-medium text-foreground">{formatCurrency(item.price)}</span>
                              </div>
                              <div>
                                <span>Estado: </span>
                                <Badge variant="outline" className="text-xs">
                                  {getStatusLabel(item.status || order.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatCurrency(item.quantity * item.price)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Especificaciones técnicas */}
              {order.specifications && (
                <Card>
                  <CardHeader>
                    <CardTitle>Especificaciones Técnicas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(order.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Documentos */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Documentos del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">Orden de Compra</p>
                          <p className="text-sm text-muted-foreground">Generado el {formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="font-medium">Factura Proforma</p>
                          <p className="text-sm text-muted-foreground">Generado el {formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comunicación */}
            <TabsContent value="communication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Historial de Comunicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sin mensajes</h3>
                    <p className="text-muted-foreground">
                      Las comunicaciones relacionadas con este pedido aparecerán aquí.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto space-y-6">
          {/* Resumen del pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IGV (18%):</span>
                  <span className="font-semibold">{formatCurrency((order.subtotal || 0) * 0.18)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(order.totalAmount || 0)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha de pedido:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                {order.estimatedDelivery && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entrega estimada:</span>
                    <span>{formatDate(order.estimatedDelivery)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Descargar Orden
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Share className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contactar Soporte
              </Button>
            </CardContent>
          </Card>

          {/* Estado y notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Actualizaciones por email</p>
                  <p className="text-xs text-muted-foreground">Recibe notificaciones sobre cambios de estado</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Notificaciones SMS</p>
                  <p className="text-xs text-muted-foreground">Alertas importantes por mensaje de texto</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}