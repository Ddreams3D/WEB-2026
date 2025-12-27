'use client';

import { useState, useEffect } from 'react';
import { useB2B } from '@/contexts/B2BContext';
import { useQuote } from '@/contexts/QuoteContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Plus, 
  Upload, 
  Calculator, 
  Send, 
  Trash2, 
  Edit, 
  Eye, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  DollarSign,
  Calendar,
  Filter,
  Search
} from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

import { QuoteStatus } from '@/contexts/QuoteContext';

export default function CotizacionesPageClient() {
  const { currentCompany } = useB2B();
  const { quotes, createQuote, updateQuote, deleteQuote } = useQuote();
  
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
  const [filteredQuotes, setFilteredQuotes] = useState(quotes);

  useEffect(() => {
    let filtered = quotes;
    
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }
    
    setFilteredQuotes(filtered);
  }, [quotes, searchTerm, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'rejected':
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'approved': 'default',
      'pending': 'secondary',
      'rejected': 'destructive',
      'expired': 'destructive',
      'draft': 'outline'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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

  const handleCreateQuote = () => {
    setActiveTab('create');
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
      await deleteQuote(quoteId);
    }
  };

  if (!currentCompany) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Empresarial Requerido</h2>
            <p className="text-muted-foreground text-center">
              Para gestionar cotizaciones, necesitas iniciar sesión con una cuenta empresarial.
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
            Cotizaciones en Lote
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona múltiples cotizaciones para proyectos de impresión 3D
          </p>
        </div>
        <Button onClick={handleCreateQuote}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cotización
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista de Cotizaciones</TabsTrigger>
          <TabsTrigger value="create">Crear Cotización</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
        </TabsList>

        {/* Lista de Cotizaciones */}
        <TabsContent value="list" className="space-y-6">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{quotes.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold">
                      {quotes.filter(q => q.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aprobadas</p>
                    <p className="text-2xl font-bold">
                      {quotes.filter(q => q.status === 'approved').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-muted-foreground" />
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
                        quotes.reduce((sum, quote) => sum + quote.total, 0)
                      )}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
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
                    placeholder="Buscar cotizaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as QuoteStatus | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="approved">Aprobada</SelectItem>
                    <SelectItem value="rejected">Rechazada</SelectItem>
                    <SelectItem value="expired">Expirada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista */}
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones</CardTitle>
              <CardDescription>
                {filteredQuotes.length} cotizaciones encontradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredQuotes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay cotizaciones</h3>
                  <p className="text-muted-foreground mb-4">
                    Crea tu primera cotización para comenzar.
                  </p>
                  <Button onClick={handleCreateQuote}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cotización
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuotes.map((quote) => (
                    <div key={quote.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(quote.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                {quote.title}
                              </h3>
                              {getStatusBadge(quote.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {quote.items.length} items • {formatCurrency(quote.total)}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(quote.createdAt)}
                              </span>
                              <span>ID: {quote.id}</span>
                              {quote.validUntil && (
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Válida hasta: {formatDate(quote.validUntil)}
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
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteQuote(quote.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crear Cotización */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nueva Cotización en Lote</CardTitle>
              <CardDescription>
                Crea una cotización para múltiples productos de impresión 3D
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Título de la Cotización</label>
                    <Input placeholder="Ej: Proyecto Prototipos Q1 2024" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Fecha de Expiración</label>
                    <Input type="date" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Descripción del Proyecto</label>
                  <Textarea 
                    placeholder="Describe los detalles del proyecto, especificaciones técnicas, plazos de entrega, etc."
                    rows={4}
                  />
                </div>

                {/* Subida de archivos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Archivos 3D</CardTitle>
                    <CardDescription>
                      Sube múltiples archivos STL, OBJ o 3MF para cotización
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Arrastra archivos aquí</h3>
                      <p className="text-muted-foreground mb-4">
                        O haz clic para seleccionar archivos (STL, OBJ, 3MF)
                      </p>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Seleccionar Archivos
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Especificaciones */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Especificaciones por Defecto</CardTitle>
                    <CardDescription>
                      Configuración que se aplicará a todos los archivos (puede modificarse individualmente)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Material</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar material" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pla">PLA</SelectItem>
                            <SelectItem value="abs">ABS</SelectItem>
                            <SelectItem value="petg">PETG</SelectItem>
                            <SelectItem value="tpu">TPU</SelectItem>
                            <SelectItem value="resin">Resina</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Calidad</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar calidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Borrador (0.3mm)</SelectItem>
                            <SelectItem value="standard">Estándar (0.2mm)</SelectItem>
                            <SelectItem value="fine">Fino (0.1mm)</SelectItem>
                            <SelectItem value="ultra">Ultra (0.05mm)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Relleno</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="% de relleno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="20">20%</SelectItem>
                            <SelectItem value="50">50%</SelectItem>
                            <SelectItem value="100">100%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Cantidad por Archivo</label>
                        <Input type="number" placeholder="1" min="1" />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Post-procesado</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Ninguno</SelectItem>
                            <SelectItem value="sanding">Lijado</SelectItem>
                            <SelectItem value="painting">Pintado</SelectItem>
                            <SelectItem value="assembly">Ensamblaje</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Urgencia</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar urgencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Estándar (7-10 días)</SelectItem>
                        <SelectItem value="express">Express (3-5 días)</SelectItem>
                        <SelectItem value="urgent">Urgente (1-2 días)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Presupuesto Estimado</label>
                    <Input type="number" placeholder="0.00" step="0.01" />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setActiveTab('list')}>Cancelar</Button>
                  <Button>Crear Cotización</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculadora */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Calculadora de Costos
              </CardTitle>
              <CardDescription>
                Estima el costo de impresión 3D basado en especificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Parámetros */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Parámetros de Impresión</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Volumen (cm³)</label>
                      <Input type="number" placeholder="0" step="0.1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tiempo (horas)</label>
                      <Input type="number" placeholder="0" step="0.5" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Material</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pla">PLA - S/45/kg</SelectItem>
                        <SelectItem value="abs">ABS - S/55/kg</SelectItem>
                        <SelectItem value="petg">PETG - S/65/kg</SelectItem>
                        <SelectItem value="tpu">TPU - S/85/kg</SelectItem>
                        <SelectItem value="resin">Resina - S/120/L</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Complejidad</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Nivel de complejidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple (+0%)</SelectItem>
                        <SelectItem value="medium">Medio (+15%)</SelectItem>
                        <SelectItem value="complex">Complejo (+30%)</SelectItem>
                        <SelectItem value="very-complex">Muy Complejo (+50%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Cantidad</label>
                    <Input type="number" placeholder="1" min="1" />
                  </div>
                </div>
                
                {/* Resultados */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Estimación de Costos</h3>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Costo de Material:</span>
                          <span className="font-medium">S/ 0.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Costo de Impresión:</span>
                          <span className="font-medium">S/ 0.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Post-procesado:</span>
                          <span className="font-medium">S/ 0.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Margen de ganancia:</span>
                          <span className="font-medium">S/ 0.00</span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total por unidad:</span>
                          <span>S/ 0.00</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-primary">
                          <span>Total general:</span>
                          <span>S/ 0.00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar a Cotización
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
