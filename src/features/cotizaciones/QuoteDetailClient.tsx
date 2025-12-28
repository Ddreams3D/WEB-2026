'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuote } from '@/contexts/QuoteContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  FileText, 
  Edit, 
  Send, 
  Download, 
  Trash2,
  Plus,
  Minus,
  Package,
  Clock,
  Calendar,
  DollarSign,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Copy,
  Share
} from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';

interface QuoteItemDetail {
  id: string;
  name: string;
  description: string;
  material: string;
  quality: string;
  infill: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  estimatedTime: number;
  notes?: string;
}

interface QuoteDetail {
  id: string;
  number: string;
  title: string;
  description: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  items: QuoteItemDetail[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
  notes?: string;
  attachments?: string[];
}

const statusConfig = {
  draft: {
    label: 'Borrador',
    color: cn(colors.status.info.bg, colors.status.info.text),
    icon: Edit
  },
  pending: {
    label: 'Pendiente',
    color: cn(colors.status.warning.bg, colors.status.warning.text),
    icon: Clock
  },
  approved: {
    label: 'Aprobada',
    color: cn(colors.status.success.bg, colors.status.success.text),
    icon: CheckCircle
  },
  rejected: {
    label: 'Rechazada',
    color: cn(colors.status.error.bg, colors.status.error.text),
    icon: XCircle
  },
  expired: {
    label: 'Expirada',
    color: cn(colors.backgrounds.neutral, "text-gray-600 dark:text-gray-400"),
    icon: AlertCircle
  }
};

export default function QuoteDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { getQuoteById, updateQuote, deleteQuote, quotes } = useQuote();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuote, setEditedQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id && quotes.length > 0) {
      const foundQuote = quotes.find(q => q.id === params.id);
      if (foundQuote) {
        // Simular estructura de cotización detallada
        const detailedQuote: QuoteDetail = {
          id: foundQuote.id,
          number: `COT-${foundQuote.id.slice(-6).toUpperCase()}`,
          title: foundQuote.title,
          description: foundQuote.description || '',
          status: foundQuote.status as QuoteDetail['status'],
          items: foundQuote.items.map((item, index) => ({
            id: item.id,
            name: item.fileName || `Pieza ${index + 1}`,
            description: item.notes || 'Modelo 3D personalizado',
            material: item.material || 'PLA',
            quality: item.complexity === 'high' ? 'Alta' : item.complexity === 'medium' ? 'Media' : 'Baja',
            infill: 20,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            estimatedTime: item.printTime,
            notes: item.notes
          })),
          subtotal: foundQuote.subtotal,
          tax: foundQuote.tax,
          discount: foundQuote.discount,
          total: foundQuote.total,
          validUntil: new Date(foundQuote.validUntil),
          createdAt: new Date(foundQuote.createdAt),
          updatedAt: new Date(foundQuote.updatedAt),
          clientInfo: {
            name: 'Cliente Ejemplo',
            email: 'cliente@ejemplo.com',
            phone: '+51 999 999 999',
            company: 'Empresa Ejemplo',
            address: 'Dirección de ejemplo'
          },
          notes: foundQuote.description
        };
        setQuote(detailedQuote);
        setEditedQuote(detailedQuote);
      }
      setLoading(false);
    }
  }, [params.id, quotes]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedQuote) {
      setQuote(editedQuote);
      setIsEditing(false);
      // Aquí iría la lógica para guardar en el backend
    }
  };

  const handleCancel = () => {
    setEditedQuote(quote);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
      router.push('/cotizaciones');
    }
  };

  const handleDuplicate = () => {
    router.push('/cotizaciones?duplicate=' + quote?.id);
  };

  const handleSend = () => {
    // Lógica para enviar cotización
    alert('Cotización enviada al cliente');
  };

  const handleDownload = () => {
    // Lógica para descargar PDF
    alert('Descargando cotización en PDF...');
  };

  const addItem = () => {
    if (editedQuote) {
      const newItem: QuoteItemDetail = {
        id: Date.now().toString(),
        name: 'Nueva pieza',
        description: '',
        material: 'PLA',
        quality: 'Media',
        infill: 15,
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        estimatedTime: 1
      };
      setEditedQuote({
        ...editedQuote,
        items: [...editedQuote.items, newItem]
      });
    }
  };

  const removeItem = (itemId: string) => {
    if (editedQuote) {
      setEditedQuote({
        ...editedQuote,
        items: editedQuote.items.filter(item => item.id !== itemId)
      });
    }
  };

  const updateItem = (itemId: string, updates: Partial<QuoteItemDetail>) => {
    if (editedQuote) {
      setEditedQuote({
        ...editedQuote,
        items: editedQuote.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        )
      });
    }
  };

  if (loading) {
    return (
      <div className={cn("min-h-screen py-12", colors.gradients.backgroundInfo)}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className={cn("h-8 rounded w-1/4 mb-6", colors.backgrounds.neutral)}></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className={cn("h-64 rounded mb-6", colors.backgrounds.neutral)}></div>
                <div className={cn("h-48 rounded", colors.backgrounds.neutral)}></div>
              </div>
              <div className={cn("h-96 rounded", colors.backgrounds.neutral)}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className={cn("min-h-screen py-12", colors.gradients.backgroundPage)}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                Cotización no encontrada
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                La cotización que buscas no existe o ha sido eliminada.
              </p>
              <Button asChild>
                <Link href="/cotizaciones">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Cotizaciones
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[quote.status].icon;
  const currentQuote = isEditing ? editedQuote : quote;

  if (!currentQuote) return null;

  return (
    <div className={cn("min-h-screen py-12", colors.gradients.backgroundInfo)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link href="/cotizaciones">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Cotizaciones
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                {currentQuote.number}
              </h1>
              <div className="flex items-center mt-2">
                <Badge className={statusConfig[currentQuote.status].color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[currentQuote.status].label}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {!isEditing ? (
              <>
                <Button onClick={handleEdit} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button onClick={handleDuplicate} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </Button>
                <Button onClick={handleSend} variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button onClick={handleDelete} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSave} size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Título
                  </label>
                  {isEditing ? (
                    <Input
                      value={currentQuote.title}
                      onChange={(e) => setEditedQuote(prev => prev ? {...prev, title: e.target.value} : null)}
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-white">{currentQuote.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Descripción
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={currentQuote.description}
                      onChange={(e) => setEditedQuote(prev => prev ? {...prev, description: e.target.value} : null)}
                      rows={3}
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-white">{currentQuote.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Fecha de Creación
                    </label>
                    <p className="text-neutral-900 dark:text-white flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(currentQuote.createdAt, 'dd/MM/yyyy', { locale: es })}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Válida Hasta
                    </label>
                    <p className="text-neutral-900 dark:text-white flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {format(currentQuote.validUntil, 'dd/MM/yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items de la Cotización */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Items de la Cotización
                  </CardTitle>
                  {isEditing && (
                    <Button onClick={addItem} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Item
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentQuote.items.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-neutral-900 dark:text-white">
                          Item #{index + 1}
                        </h4>
                        {isEditing && (
                          <Button
                            onClick={() => removeItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">
                            Nombre
                          </label>
                          {isEditing ? (
                            <Input
                              value={item.name}
                              onChange={(e) => updateItem(item.id, { name: e.target.value })}
                            />
                          ) : (
                            <p className="text-sm text-neutral-900 dark:text-white">{item.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">
                            Material
                          </label>
                          {isEditing ? (
                            <Select
                              value={item.material}
                              onValueChange={(value) => updateItem(item.id, { material: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PLA">PLA</SelectItem>
                                <SelectItem value="ABS">ABS</SelectItem>
                                <SelectItem value="PETG">PETG</SelectItem>
                                <SelectItem value="TPU">TPU</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-neutral-900 dark:text-white">{item.material}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">
                            Cantidad
                          </label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                              min="1"
                            />
                          ) : (
                            <p className="text-sm text-neutral-900 dark:text-white">{item.quantity}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">
                            Precio Unitario
                          </label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            <p className="text-sm text-neutral-900 dark:text-white">S/ {item.unitPrice.toFixed(2)}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">
                            Total
                          </label>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            S/ {(item.quantity * item.unitPrice).toFixed(2)}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">
                            Tiempo Est. (hrs)
                          </label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={item.estimatedTime}
                              onChange={(e) => updateItem(item.id, { estimatedTime: parseFloat(e.target.value) || 1 })}
                              min="0.1"
                              step="0.1"
                            />
                          ) : (
                            <p className="text-sm text-neutral-900 dark:text-white">{item.estimatedTime}h</p>
                          )}
                        </div>
                      </div>
                      
                      {item.description && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-neutral-500 mb-1">
                            Descripción
                          </label>
                          {isEditing ? (
                            <Textarea
                              value={item.description}
                              onChange={(e) => updateItem(item.id, { description: e.target.value })}
                              rows={2}
                            />
                          ) : (
                            <p className="text-sm text-neutral-600 dark:text-neutral-300">{item.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto space-y-6">
            {/* Resumen Financiero */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Resumen Financiero
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-300">Subtotal:</span>
                  <span className="font-medium">S/ {currentQuote.subtotal.toFixed(2)}</span>
                </div>
                
                {currentQuote.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span>-S/ {currentQuote.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-300">IGV (18%):</span>
                  <span className="font-medium">S/ {currentQuote.tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">S/ {currentQuote.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Información del Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-neutral-400" />
                  <span className="text-sm">{currentQuote.clientInfo.name}</span>
                </div>
                
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-neutral-400" />
                  <span className="text-sm">{currentQuote.clientInfo.company}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-neutral-400" />
                  <span className="text-sm">{currentQuote.clientInfo.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-neutral-400" />
                  <span className="text-sm">{currentQuote.clientInfo.phone}</span>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-neutral-400 mt-0.5" />
                  <span className="text-sm">{currentQuote.clientInfo.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Notas */}
            {(currentQuote.notes || isEditing) && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={currentQuote.notes || ''}
                      onChange={(e) => setEditedQuote(prev => prev ? {...prev, notes: e.target.value} : null)}
                      placeholder="Agregar notas adicionales..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {currentQuote.notes || 'Sin notas adicionales'}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}