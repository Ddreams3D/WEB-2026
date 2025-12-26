'use client';

import { useState, useEffect } from 'react';
import { useB2B } from '@/contexts/B2BContext';
import { useOrderTracking } from '@/contexts/OrderTrackingContext';
import { useBilling } from '@/contexts/BillingContext';
import { useQuote } from '@/contexts/QuoteContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { History, Package, FileText, CreditCard, Search, Filter, Download, Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle, XCircle, DollarSign, Eye, ExternalLink } from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  type: 'order' | 'quote' | 'invoice' | 'payment';
  title: string;
  description: string;
  status: string;
  amount?: number;
  date: string;
  reference: string;
  details?: any;
}

type FilterType = 'all' | 'order' | 'quote' | 'invoice' | 'payment';
type SortOrder = 'newest' | 'oldest' | 'amount-high' | 'amount-low';

export default function HistorialPage() {
  const { currentCompany } = useB2B();
  const { orders } = useOrderTracking();
  const { invoices } = useBilling();
  const { quotes } = useQuote();
  
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Combinar todos los elementos en un historial unificado
    const items: HistoryItem[] = [];
    
    // Agregar órdenes
    orders.forEach(order => {
      items.push({
        id: `order-${order.id}`,
        type: 'order',
        title: `Orden ${order.orderNumber}`,
        description: order.title,
        status: order.status,
        date: order.createdAt,
        reference: order.orderNumber,
        details: order
      });
    });
    
    // Agregar cotizaciones
    quotes.forEach(quote => {
      items.push({
        id: `quote-${quote.id}`,
        type: 'quote',
        title: `Cotización ${quote.id}`,
        description: quote.title,
        status: quote.status,
        amount: quote.total,
        date: quote.createdAt,
        reference: quote.id,
        details: quote
      });
    });
    
    // Agregar facturas
    invoices.forEach(invoice => {
      items.push({
        id: `invoice-${invoice.id}`,
        type: 'invoice',
        title: `Factura ${invoice.invoiceNumber}`,
        description: `Factura por ${invoice.items.length} items`,
        status: invoice.status,
        amount: invoice.totalAmount,
        date: invoice.issueDate,
        reference: invoice.invoiceNumber,
        details: invoice
      });
      
      // Agregar pagos si existen
      if (invoice.status === 'paid' && invoice.paidDate) {
        items.push({
          id: `payment-${invoice.id}`,
          type: 'payment',
          title: `Pago de ${invoice.invoiceNumber}`,
          description: `Pago recibido por factura ${invoice.invoiceNumber}`,
          status: 'completed',
          amount: invoice.totalAmount,
          date: invoice.paidDate,
          reference: invoice.invoiceNumber,
          details: invoice
        });
      }
    });
    
    setHistoryItems(items);
    setLoading(false);
  }, [orders, quotes, invoices]);

  useEffect(() => {
    let filtered = [...historyItems];
    
    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por rango de fechas
    if (dateRange.from) {
      filtered = filtered.filter(item => new Date(item.date) >= dateRange.from!);
    }
    if (dateRange.to) {
      filtered = filtered.filter(item => new Date(item.date) <= dateRange.to!);
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-high':
          return (b.amount || 0) - (a.amount || 0);
        case 'amount-low':
          return (a.amount || 0) - (b.amount || 0);
        default:
          return 0;
      }
    });
    
    setFilteredItems(filtered);
  }, [historyItems, searchTerm, filterType, sortOrder, dateRange]);

  const getStatusIcon = (type: string, status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'delivered':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
      case 'sent':
      case 'in-production':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue':
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'completed': 'default',
      'paid': 'default',
      'delivered': 'default',
      'approved': 'default',
      'pending': 'secondary',
      'sent': 'secondary',
      'in-production': 'secondary',
      'overdue': 'destructive',
      'rejected': 'destructive',
      'cancelled': 'destructive',
      'draft': 'outline'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="h-4 w-4" />;
      case 'quote': return <FileText className="h-4 w-4" />;
      case 'invoice': return <CreditCard className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const exportHistory = () => {
    // Simular exportación
    const csvContent = filteredItems.map(item => 
      `${item.date},${item.type},${item.title},${item.status},${item.amount || 0}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial-${currentCompany?.name || 'empresa'}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (!currentCompany) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <History className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Empresarial Requerido</h2>
            <p className="text-muted-foreground text-center">
              Para ver el historial, necesitas iniciar sesión con una cuenta empresarial.
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
            Historial de Actividades
          </h1>
          <p className="text-muted-foreground mt-1">
            Registro completo de órdenes, cotizaciones, facturas y pagos
          </p>
        </div>
        <Button onClick={exportHistory}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Tipo */}
            <Select value={filterType} onValueChange={(value: string) => setFilterType(value as FilterType)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="order">Órdenes</SelectItem>
                <SelectItem value="quote">Cotizaciones</SelectItem>
                <SelectItem value="invoice">Facturas</SelectItem>
                <SelectItem value="payment">Pagos</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Ordenar */}
            <Select value={sortOrder} onValueChange={(value: string) => setSortOrder(value as SortOrder)}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más reciente</SelectItem>
                <SelectItem value="oldest">Más antiguo</SelectItem>
                <SelectItem value="amount-high">Mayor monto</SelectItem>
                <SelectItem value="amount-low">Menor monto</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Rango de fechas */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd/MM/yy')} - {format(dateRange.to, 'dd/MM/yy')}
                      </>
                    ) : (
                      format(dateRange.from, 'dd/MM/yyyy')
                    )
                  ) : (
                    'Seleccionar fechas'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range && typeof range === 'object' && 'from' in range) {
                      setDateRange(range as { from?: Date; to?: Date });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{filteredItems.length}</p>
              </div>
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Órdenes</p>
                <p className="text-2xl font-bold">
                  {filteredItems.filter(item => item.type === 'order').length}
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
                <p className="text-sm font-medium text-muted-foreground">Facturas</p>
                <p className="text-2xl font-bold">
                  {filteredItems.filter(item => item.type === 'invoice').length}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Monto</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    filteredItems
                      .filter(item => item.amount)
                      .reduce((sum, item) => sum + (item.amount || 0), 0)
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de historial */}
      <Card>
        <CardHeader>
          <CardTitle>Actividades Recientes</CardTitle>
          <CardDescription>
            {filteredItems.length} elementos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron actividades</h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros para ver más resultados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(item.type, item.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getTypeIcon(item.type)}
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatDate(item.date)}
                          </span>
                          <span>Ref: {item.reference}</span>
                          {item.amount && (
                            <span className="font-medium text-primary">
                              {formatCurrency(item.amount)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}