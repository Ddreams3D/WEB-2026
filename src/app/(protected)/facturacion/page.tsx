'use client';

import { useState, useEffect } from 'react';
import { useBilling } from '@/contexts/BillingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Download, Send, Eye, Edit, Copy, Trash2, FileText, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, BarChart3, PieChart, Building, CreditCard, Receipt, Mail, Phone, MapPin, Settings, RefreshCw, ArrowUpRight, ArrowDownRight } from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function BillingPage() {
  const { 
    invoices, 
    stats, 
    loadInvoices, 
    sendInvoice,
    markAsPaid,
    markAsOverdue,
    duplicateInvoice,
    deleteInvoice,
    exportInvoiceToPDF
  } = useBilling();
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('invoices');

  useEffect(() => {
    const loadData = async () => {
      await loadInvoices();
      setLoading(false);
    };
    
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'draft': 'outline',
      'sent': 'secondary',
      'paid': 'default',
      'overdue': 'destructive',
      'cancelled': 'outline'
    };
    
    const labels: Record<string, string> = {
      'draft': 'Borrador',
      'sent': 'Enviada',
      'paid': 'Pagada',
      'overdue': 'Vencida',
      'cancelled': 'Cancelada'
    };
    
    const icons: Record<string, React.ReactNode> = {
      'draft': <Edit className="h-3 w-3 mr-1" />,
      'sent': <Send className="h-3 w-3 mr-1" />,
      'paid': <CheckCircle className="h-3 w-3 mr-1" />,
      'overdue': <AlertTriangle className="h-3 w-3 mr-1" />,
      'cancelled': <XCircle className="h-3 w-3 mr-1" />
    };
    
    return (
      <Badge variant={variants[status] || 'outline'} className="text-xs">
        {icons[status]}
        {labels[status] || status}
      </Badge>
    );
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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const invoiceDate = new Date(invoice.issueDate);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = invoiceDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = invoiceDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = invoiceDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleBulkAction = async (action: string) => {
    for (const invoiceId of selectedInvoices) {
      switch (action) {
        case 'send':
          await sendInvoice(invoiceId);
          break;
        case 'paid':
          await markAsPaid(invoiceId, {
            invoiceId: invoiceId,
            amount: 0, // Se debería obtener del invoice
            paymentDate: new Date().toISOString(),
            paymentMethod: 'bank_transfer',
            reference: `PAY-${Date.now()}`,
            notes: 'Pago marcado manualmente'
          });
          break;
        case 'delete':
          await deleteInvoice(invoiceId);
          break;
        case 'export':
          await exportInvoiceToPDF(invoiceId);
          break;
      }
    }
    setSelectedInvoices([]);
  };

  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const selectAllInvoices = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Facturación</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona facturas, pagos y términos comerciales
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <Link href="/facturacion/nueva">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Factura
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Facturas */}
        <TabsContent value="invoices" className="space-y-6">
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Facturado</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats?.totalInvoiced || 0)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">+12.5%</span>
                  <span className="text-muted-foreground ml-1">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendiente de Cobro</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats?.totalPending || 0)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-muted-foreground">{stats?.invoiceCount?.sent || 0} facturas</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vencidas</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats?.totalOverdue || 0)}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-red-500">{stats?.invoiceCount?.overdue || 0} facturas</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Promedio de Pago</p>
                    <p className="text-2xl font-bold">{stats?.averagePaymentTime || 0} días</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">-2 días</span>
                  <span className="text-muted-foreground ml-1">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros y búsqueda */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por número de factura o cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="sent">Enviada</SelectItem>
                    <SelectItem value="paid">Pagada</SelectItem>
                    <SelectItem value="overdue">Vencida</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las fechas</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mes</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Más filtros
                </Button>
              </div>
              
              {/* Acciones en lote */}
              {selectedInvoices.length > 0 && (
                <div className="flex items-center justify-between mt-4 p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">
                    {selectedInvoices.length} factura(s) seleccionada(s)
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('send')}>
                      <Send className="h-4 w-4 mr-1" />
                      Enviar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('paid')}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar Pagadas
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de facturas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Facturas</CardTitle>
                  <CardDescription>
                    {filteredInvoices.length} de {invoices.length} facturas
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={selectAllInvoices}>
                    {selectedInvoices.length === filteredInvoices.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredInvoices.length > 0 ? (
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => toggleInvoiceSelection(invoice.id)}
                            className="rounded"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                              {getStatusBadge(invoice.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium text-foreground">{invoice.companyName}</span>
                                <p>Cliente</p>
                              </div>
                              <div>
                                <span className="font-medium text-foreground">{formatDate(invoice.issueDate)}</span>
                                <p>Fecha de emisión</p>
                              </div>
                              <div>
                                <span className="font-medium text-foreground">{formatDate(invoice.dueDate)}</span>
                                <p>Fecha de vencimiento</p>
                              </div>
                              <div>
                                <span className="font-medium text-foreground text-lg">{formatCurrency(invoice.totalAmount)}</span>
                                <p>Total</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link href={`/facturacion/${invoice.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => exportInvoiceToPDF(invoice.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => duplicateInvoice(invoice.id)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteInvoice(invoice.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay facturas</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                      ? 'No se encontraron facturas con los filtros aplicados.'
                      : 'Aún no has creado ninguna factura.'}
                  </p>
                  <Link href="/facturacion/nueva">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primera Factura
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Ingresos Mensuales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Gráfico de ingresos mensuales
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Estados de Facturas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Gráfico de estados de facturas
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Facturación</CardTitle>
              <CardDescription>
                Configura términos de pago, impuestos y otros ajustes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  La configuración de facturación estará disponible próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}