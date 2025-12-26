'use client';

import { useEffect, useState } from 'react';
import { useB2B } from '@/contexts/B2BContext';
import { useOrderTracking } from '@/contexts/OrderTrackingContext';
import { useBilling } from '@/contexts/BillingContext';
import { useQuote } from '@/contexts/QuoteContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building2, FileText, Package, CreditCard, TrendingUp, Clock, AlertCircle, CheckCircle, DollarSign, Users, Calendar } from '@/lib/icons';
import Link from 'next/link';

interface DashboardStats {
  activeOrders: number;
  pendingQuotes: number;
  overdueInvoices: number;
  totalSpent: number;
  avgDeliveryTime: number;
  satisfactionScore: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'quote' | 'invoice' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export default function PortalEmpresarialPage() {
  const { currentCompany, currentUser } = useB2B();
  const { orders, loadOrders, getOrdersByStatus } = useOrderTracking();
  const { invoices, loadInvoices, getOverdueInvoices } = useBilling();
  const { quotes, loadQuotes } = useQuote();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    loadOrders();
    loadInvoices();
    loadQuotes();

    // Actividad reciente simulada (cargada en cliente para evitar error de hidratación)
    setRecentActivity([
      {
        id: '1',
        type: 'order',
        title: 'Orden DD3D-2024-001',
        description: 'Progreso de impresión: 75% completado',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'info'
      },
      {
        id: '2',
        type: 'invoice',
        title: 'Factura DD3D-202401-0001',
        description: 'Factura enviada por S/ 1,121.00',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: '3',
        type: 'quote',
        title: 'Cotización Prototipos V2',
        description: 'Nueva cotización pendiente de aprobación',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'warning'
      }
    ]);
  }, []);

  // Calcular estadísticas del dashboard
  const stats: DashboardStats = {
    activeOrders: getOrdersByStatus('in-production').length + getOrdersByStatus('quality-control').length,
    pendingQuotes: quotes.filter(q => q.status === 'pending').length,
    overdueInvoices: getOverdueInvoices().length,
    totalSpent: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0),
    avgDeliveryTime: 5.2, // días promedio
    satisfactionScore: 4.8
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentCompany) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Empresarial Requerido</h2>
            <p className="text-muted-foreground text-center mb-4">
              Para acceder al portal empresarial, necesitas iniciar sesión con una cuenta empresarial.
            </p>
            <Button asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Portal Empresarial
            </h1>
            <p className="text-muted-foreground mt-1">
              Bienvenido, {currentUser?.name} - {currentCompany.name}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              <Building2 className="h-3 w-3 mr-1" />
              {currentCompany.industry}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Users className="h-3 w-3 mr-1" />
              {currentCompany.employeeCount} empleados
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Activas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground">
              En producción y control de calidad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
            <p className="text-xs text-muted-foreground">
              Esperando aprobación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Vencidas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invertido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Este año
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad Reciente */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas actualizaciones de tus órdenes y cotizaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                Ver Toda la Actividad
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Métricas de Rendimiento */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Rendimiento</CardTitle>
            <CardDescription>
              Indicadores clave de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tiempo Promedio de Entrega</span>
                <span className="text-sm text-muted-foreground">{stats.avgDeliveryTime} días</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Satisfacción del Cliente</span>
                <span className="text-sm text-muted-foreground">{stats.satisfactionScore}/5.0</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Órdenes Completadas</span>
                <span className="text-sm text-muted-foreground">23 este mes</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accede rápidamente a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link href="/cotizaciones/nueva">
                <FileText className="h-6 w-6" />
                <span>Nueva Cotización</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link href="/pedidos">
                <Package className="h-6 w-6" />
                <span>Seguir Pedidos</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link href="/facturacion">
                <CreditCard className="h-6 w-6" />
                <span>Ver Facturas</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link href="/portal-empresarial/perfil">
                <Building2 className="h-6 w-6" />
                <span>Perfil Empresa</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}