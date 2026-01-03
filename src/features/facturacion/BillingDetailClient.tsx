'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBilling } from '@/contexts/BillingContext';
import type { Invoice } from '@/contexts/BillingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Download,
  Send,
  Edit,
  Copy,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Receipt,
  Printer,
  Share,
  RefreshCw,
  MessageSquare,
  History,
  Settings,
  ExternalLink,
  Archive,
  RotateCcw,
  Plus
} from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  notes?: string;
}

interface InvoiceActivity {
  id: string;
  type: 'created' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled' | 'edited';
  description: string;
  timestamp: string;
  user?: string;
  details?: Record<string, unknown>;
}

export default function BillingDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { 
    invoices, 
    getInvoiceById,
    sendInvoice,
    markAsPaid,
    markAsOverdue,
    cancelInvoice,
    duplicateInvoice,
    deleteInvoice,
    exportInvoiceToPDF,
    sendPaymentReminder
  } = useBilling();
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [activityHistory, setActivityHistory] = useState<InvoiceActivity[]>([]);

  const loadInvoiceData = useCallback(async () => {
    // Si hay facturas en el contexto, buscar la que coincida
    const foundInvoice = invoices.find(inv => inv.id === params.id);
    
    if (foundInvoice) {
      setInvoice(foundInvoice);
      // Cargar pagos (mock data)
      setPaymentHistory([
        {
          id: '1',
          amount: foundInvoice.totalAmount * 0.5,
          date: '2024-01-15T10:30:00Z',
          method: 'Transferencia Bancaria',
          reference: 'TXN-001234',
          notes: 'Pago parcial'
        }
      ]);
      
      // Cargar historial de actividad (mock data)
      setActivityHistory([
        {
          id: '1',
          type: 'created',
          description: 'Factura creada',
          timestamp: foundInvoice.createdAt,
          user: 'Sistema'
        },
        {
          id: '2',
          type: 'sent',
          description: 'Factura enviada al cliente',
          timestamp: foundInvoice.status === 'sent' ? foundInvoice.updatedAt : foundInvoice.createdAt,
          user: 'Admin'
        }
      ]);
    }
    
    setLoading(false);
  }, [invoices, params.id]);

  useEffect(() => {
    loadInvoiceData();
  }, [loadInvoiceData]);

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
      'draft': <Edit className="h-4 w-4 mr-1" />,
      'sent': <Send className="h-4 w-4 mr-1" />,
      'paid': <CheckCircle className="h-4 w-4 mr-1" />,
      'overdue': <AlertTriangle className="h-4 w-4 mr-1" />,
      'cancelled': <XCircle className="h-4 w-4 mr-1" />
    };
    
    return (
      <Badge variant={variants[status] || 'outline'} className="text-sm">
        {icons[status]}
        {labels[status] || status}
      </Badge>
    );
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'created': <FileText className="h-4 w-4" />,
      'sent': <Send className="h-4 w-4" />,
      'viewed': <Eye className="h-4 w-4" />,
      'paid': <CheckCircle className="h-4 w-4" />,
      'overdue': <AlertTriangle className="h-4 w-4" />,
      'cancelled': <XCircle className="h-4 w-4" />,
      'edited': <Edit className="h-4 w-4" />
    };
    
    return icons[type] || <Clock className="h-4 w-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: invoice?.currency || 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const handleAction = async (action: string) => {
    if (!invoice) return;
    
    try {
      switch (action) {
        case 'send':
          await sendInvoice(invoice.id);
          break;
        case 'paid':
          await markAsPaid(invoice.id, {
            invoiceId: invoice.id,
            amount: invoice.totalAmount,
            paymentDate: new Date().toISOString(),
            paymentMethod: 'bank_transfer',
            reference: `PAY-${Date.now()}`,
            notes: 'Pago registrado manualmente'
          });
          break;
        case 'overdue':
          await markAsOverdue(invoice.id);
          break;
        case 'cancel':
          await cancelInvoice(invoice.id, 'Cancelada por el usuario');
          break;
        case 'duplicate':
          const newInvoiceId = await duplicateInvoice(invoice.id);
          router.push(`/facturacion/${newInvoiceId}`);
          break;
        case 'delete':
          await deleteInvoice(invoice.id);
          router.push('/facturacion');
          break;
        case 'export':
          await exportInvoiceToPDF(invoice.id);
          break;
        case 'reminder':
          await sendPaymentReminder(invoice.id);
          break;
      }
      
      // Recargar datos
      const updatedInvoice = await getInvoiceById(invoice.id);
      if (updatedInvoice) {
        setInvoice(updatedInvoice);
      }
    } catch (error) {
      console.error(`Error executing action ${action}:`, error);
    }
  };

  const calculatePaidAmount = () => {
    return paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const calculateRemainingAmount = () => {
    return invoice ? invoice.totalAmount - calculatePaidAmount() : 0;
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

  if (!invoice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Factura no encontrada</h2>
            <p className="text-muted-foreground text-center mb-4">
              La factura que buscas no existe o no tienes permisos para verla.
            </p>
            <Link href="/facturacion">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Facturación
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
          <Link href="/facturacion">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {invoice.invoiceNumber}
              </h1>
              {getStatusBadge(invoice.status)}
            </div>
            <p className="text-muted-foreground mt-1">
              {invoice.companyName} • Creada el {formatDate(invoice.issueDate)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleAction('export')}>
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAction('duplicate')}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicar
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          {invoice.status === 'draft' && (
            <Button onClick={() => handleAction('send')}>
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          )}
          {invoice.status === 'sent' && (
            <Button onClick={() => handleAction('paid')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar Pagada
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="payments">Pagos</TabsTrigger>
              <TabsTrigger value="activity">Actividad</TabsTrigger>
              <TabsTrigger value="preview">Vista Previa</TabsTrigger>
            </TabsList>

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
                        <span className="text-sm text-muted-foreground">Nombre / Razón Social:</span>
                        <p className="font-medium">{invoice.companyName}</p>
                      </div>
                      {invoice.companyTaxId && (
                        <div>
                          <span className="text-sm text-muted-foreground">RUC / DNI:</span>
                          <p className="font-medium">{invoice.companyTaxId}</p>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{invoice.contactEmail}</span>
                      </div>

                    </div>
                    
                    <div className="space-y-3">
                      {invoice.companyAddress && (
                        <div>
                          <span className="text-sm text-muted-foreground">Dirección:</span>
                          <p className="font-medium">{invoice.companyAddress}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items de la factura */}
              <Card>
                <CardHeader>
                  <CardTitle>Items de la Factura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoice.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.description}</h4>
                            <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                              <div>
                                <span>Cantidad: </span>
                                <span className="font-medium text-foreground">{item.quantity}</span>
                              </div>
                              <div>
                                <span>Precio Unitario: </span>
                                <span className="font-medium text-foreground">{formatCurrency(item.unitPrice)}</span>
                              </div>
                              <div>
                                <span>IGV: </span>
                                <span className="font-medium text-foreground">{item.taxRate}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatCurrency(item.quantity * item.unitPrice)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notas y términos */}
              {(invoice.notes || invoice.termsAndConditions) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notas y Términos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {invoice.notes && (
                      <div>
                        <h4 className="font-medium mb-2">Notas:</h4>
                        <p className="text-muted-foreground">{invoice.notes}</p>
                      </div>
                    )}
                    {invoice.termsAndConditions && (
                      <div>
                        <h4 className="font-medium mb-2">Términos y Condiciones:</h4>
                        <p className="text-muted-foreground">{invoice.termsAndConditions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Pagos */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Historial de Pagos
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Pago
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentHistory.length > 0 ? (
                    <div className="space-y-4">
                      {paymentHistory.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <div>
                                <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                                <p className="text-sm text-muted-foreground">{payment.method}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{formatDate(payment.date)}</p>
                              <p className="text-xs text-muted-foreground">{payment.reference}</p>
                            </div>
                          </div>
                          {payment.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{payment.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Sin pagos registrados</h3>
                      <p className="text-muted-foreground">
                        Los pagos de esta factura aparecerán aquí.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Actividad */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Historial de Actividad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityHistory.map((activity, index) => (
                      <div key={activity.id} className="relative">
                        {index < activityHistory.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                        )}
                        
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-background border-2 border-border rounded-full flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-semibold">{activity.description}</h3>
                              <span className="text-xs text-muted-foreground">{formatDateTime(activity.timestamp)}</span>
                            </div>
                            {activity.user && (
                              <p className="text-xs text-muted-foreground">por {activity.user}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vista Previa */}
            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Vista Previa de la Factura
                  </CardTitle>
                  <CardDescription>
                    Así se verá la factura cuando se genere el PDF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white text-black p-8 rounded border shadow-sm">
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-bold mb-2">FACTURA</h1>
                      <p className="text-lg">{invoice.invoiceNumber}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="font-semibold mb-2">De:</h3>
                        <p className="font-medium">Ddreams 3D</p>
                        <p>Av. Ejemplo 123</p>
                        <p>RUC: 20123456789</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Para:</h3>
                        <p className="font-medium">{invoice.companyName}</p>
                        {invoice.companyAddress && <p>{invoice.companyAddress}</p>}
                        {invoice.companyTaxId && <p>RUC: {invoice.companyTaxId}</p>}
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Descripción</th>
                            <th className="border border-gray-300 p-2 text-center">Cantidad</th>
                            <th className="border border-gray-300 p-2 text-right">Precio Unit.</th>
                            <th className="border border-gray-300 p-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.items.map((item, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 p-2">{item.description}</td>
                              <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                              <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                              <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="w-64">
                        <div className="flex justify-between mb-2">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(invoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>IGV (18%):</span>
                          <span>{formatCurrency(invoice.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>{formatCurrency(invoice.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto space-y-6">
          {/* Resumen financiero */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Resumen Financiero
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pagado:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(calculatePaidAmount())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pendiente:</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(calculateRemainingAmount())}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha de emisión:</span>
                  <span>{formatDate(invoice.issueDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha de vencimiento:</span>
                  <span>{formatDate(invoice.dueDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleAction('export')}>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleAction('duplicate')}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar Factura
              </Button>
              {invoice.status === 'sent' && (
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleAction('reminder')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Recordatorio
                </Button>
              )}
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Share className="h-4 w-4 mr-2" />
                Compartir Enlace
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </CardContent>
          </Card>

          {/* Estado y configuración */}
          <Card>
            <CardHeader>
              <CardTitle>Estado y Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Estado actual:</span>
                <div className="mt-1">{getStatusBadge(invoice.status)}</div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                {invoice.status === 'draft' && (
                  <Button size="sm" className="w-full" onClick={() => handleAction('send')}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Factura
                  </Button>
                )}
                
                {invoice.status === 'sent' && (
                  <Button size="sm" className="w-full" onClick={() => handleAction('paid')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Pagada
                  </Button>
                )}
                
                {['draft', 'sent'].includes(invoice.status) && (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleAction('cancel')}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar Factura
                  </Button>
                )}
                
                <Button variant="destructive" size="sm" className="w-full" onClick={() => handleAction('delete')}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Factura
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}