'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBilling } from '@/contexts/BillingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { EMAIL_BUSINESS, PHONE_DISPLAY, ADDRESS_BUSINESS } from '@/shared/constants/contactInfo';
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  Calculator,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Percent,
  FileText,
  AlertCircle,
  CheckCircle,
  Copy,
  Settings
} from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  category: 'printing' | 'modeling' | 'post-processing' | 'shipping' | 'other';
}

interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientTaxId: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  currency: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxRate: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const { createInvoice, settings } = useBilling();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientTaxId: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    paymentTerms: '30',
    currency: 'PEN',
    items: [{
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      taxRate: 18,
      category: 'printing'
    }],
    notes: '',
    terms: 'Pago dentro de los términos acordados. Recargos por mora según ley.',
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 18
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    // Cargar configuración de facturación si existe
    if (settings) {
      setFormData(prev => ({
        ...prev,
        currency: settings.defaultCurrency || 'PEN',
        paymentTerms: settings.defaultPaymentTerms?.days?.toString() || '30',
        taxRate: 18,
        terms: prev.terms
      }));
    }
  }, [settings]);

  const updateFormData = <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      taxRate: formData.taxRate,
      category: 'printing'
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    }
  };

  const updateItem = <K extends keyof InvoiceItem>(itemId: string, field: K, value: InvoiceItem[K]) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          // Recalcular total del item
          if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
            const quantity = field === 'quantity' ? (value as number) : updatedItem.quantity;
            const unitPrice = field === 'unitPrice' ? (value as number) : updatedItem.unitPrice;
            const taxRate = field === 'taxRate' ? (value as number) : updatedItem.taxRate;
            
            const subtotal = quantity * unitPrice;
            const tax = subtotal * (taxRate / 100);
            updatedItem.totalPrice = subtotal + tax;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + itemSubtotal;
    }, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (formData.discountType === 'percentage') {
      return subtotal * (formData.discountValue / 100);
    }
    return formData.discountValue;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const taxableAmount = subtotal - discount;
    return taxableAmount * (formData.taxRate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: formData.currency as 'USD' | 'EUR' | 'PEN' | 'MXN'
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre del cliente es requerido';
    }
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'El email del cliente es requerido';
    }
    if (!formData.issueDate) {
      newErrors.issueDate = 'La fecha de emisión es requerida';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es requerida';
    }
    if (formData.items.some(item => !item.description.trim())) {
      newErrors.items = 'Todos los items deben tener descripción';
    }
    if (formData.items.some(item => item.quantity <= 0)) {
      newErrors.items = 'La cantidad debe ser mayor a 0';
    }
    if (formData.items.some(item => item.unitPrice < 0)) {
      newErrors.items = 'El precio unitario no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: 'draft' | 'sent') => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const invoiceData = {
        ...formData,
        currency: formData.currency as 'USD' | 'EUR' | 'PEN' | 'MXN',
        paymentTerms: {
          id: 'default',
          name: `${formData.paymentTerms} días`,
          days: parseInt(formData.paymentTerms),
          description: `Pago a ${formData.paymentTerms} días`
        },
        companyId: 'default',
        companyName: 'Cliente General',
        companyAddress: '',
        companyTaxId: '',
        contactEmail: '',
        status,
        subtotal: calculateSubtotal(),
        discountAmount: calculateDiscount(),
        taxAmount: calculateTax(),
        totalAmount: calculateTotal(),
        createdBy: 'current-user'
      };

      const invoiceId = await createInvoice(invoiceData);
      
      if (status === 'sent') {
        // Aquí se podría enviar la factura por email
      }

      router.push(`/facturacion/${invoiceId}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nueva Factura</h1>
            <p className="text-muted-foreground mt-1">
              Crea una nueva factura
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Editar' : 'Vista Previa'}
          </Button>
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Borrador
          </Button>
          <Button onClick={() => handleSave('sent')} disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            Crear y Enviar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Nombre / Razón Social *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('clientName', e.target.value)}
                    placeholder="Nombre del cliente"
                    className={errors.clientName ? 'border-red-500' : ''}
                  />
                  {errors.clientName && (
                    <p className="text-sm text-red-500 mt-1">{errors.clientName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="clientTaxId">RUC / DNI</Label>
                  <Input
                    id="clientTaxId"
                    value={formData.clientTaxId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('clientTaxId', e.target.value)}
                    placeholder="20123456789"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => updateFormData('clientEmail', e.target.value)}
                    placeholder="cliente@empresa.com"
                    className={errors.clientEmail ? 'border-destructive' : ''}
                  />
                  {errors.clientEmail && (
                    <p className="text-sm text-destructive mt-1">{errors.clientEmail}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="clientPhone">Teléfono</Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => updateFormData('clientPhone', e.target.value)}
                    placeholder="+51 999 999 999"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="clientAddress">Dirección</Label>
                <Textarea
                  id="clientAddress"
                  value={formData.clientAddress}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('clientAddress', e.target.value)}
                  placeholder="Dirección completa del cliente"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Detalles de la factura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Detalles de la Factura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="issueDate">Fecha de Emisión *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('issueDate', e.target.value)}
                    className={errors.issueDate ? 'border-red-500' : ''}
                  />
                  {errors.issueDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.issueDate}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Fecha de Vencimiento *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('dueDate', e.target.value)}
                    className={errors.dueDate ? 'border-red-500' : ''}
                  />
                  {errors.dueDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="paymentTerms">Términos de Pago</Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => updateFormData('paymentTerms', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Inmediato</SelectItem>
                      <SelectItem value="15">15 días</SelectItem>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="45">45 días</SelectItem>
                      <SelectItem value="60">60 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="currency">Moneda</Label>
                <Select value={formData.currency} onValueChange={(value: string) => updateFormData('currency', value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PEN">PEN (S/)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Items de la factura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Items de la Factura
                </div>
                <Button onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {formData.items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <Label>Descripción *</Label>
                        <Input
                          value={item.description}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Descripción del producto/servicio"
                        />
                      </div>
                      
                      <div>
                        <Label>Cantidad *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      
                      <div>
                        <Label>Precio Unitario *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <Label>Total</Label>
                        <Input
                          value={formatCurrency(item.totalPrice)}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {errors.items && (
                  <p className="text-sm text-red-500">{errors.items}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notas y términos */}
          <Card>
            <CardHeader>
              <CardTitle>Notas y Términos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Notas adicionales para el cliente"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="terms">Términos y Condiciones</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('terms', e.target.value)}
                  placeholder="Términos y condiciones de la factura"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen y cálculos */}
        <div className="space-y-6">
          {/* Resumen de totales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                </div>
                
                {formData.discountValue > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({formData.discountType === 'percentage' ? `${formData.discountValue}%` : 'Fijo'}):</span>
                    <span>-{formatCurrency(calculateDiscount())}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IGV ({formData.taxRate}%):</span>
                  <span className="font-medium">{formatCurrency(calculateTax())}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de descuentos e impuestos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-5 w-5 mr-2" />
                Descuentos e Impuestos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tipo de Descuento</Label>
                <Select 
                  value={formData.discountType} 
                  onValueChange={(value) => updateFormData('discountType', value as 'percentage' | 'fixed')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje</SelectItem>
                    <SelectItem value="fixed">Monto Fijo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Valor del Descuento</Label>
                <Input
                  type="number"
                  min="0"
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  value={formData.discountValue}
                  onChange={(e) => updateFormData('discountValue', parseFloat(e.target.value) || 0)}
                  placeholder={formData.discountType === 'percentage' ? '10' : '100.00'}
                />
              </div>
              
              <div>
                <Label>Tasa de IGV (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={(e) => updateFormData('taxRate', parseFloat(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información de la empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Ddreams 3D</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>info@ddreams3d.com</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+51 999 999 999</span>
                </div>
                <div className="flex items-start space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>Av. Ejemplo 123</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}