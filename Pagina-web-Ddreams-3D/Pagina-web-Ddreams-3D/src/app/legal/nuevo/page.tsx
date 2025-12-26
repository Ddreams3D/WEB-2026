'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useB2B } from '@/contexts/B2BContext';
import { useLegal } from '@/contexts/LegalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Send, Eye, FileText, Shield, Handshake, Scale, Building, User, Mail, Phone, MapPin, Calendar, Clock, AlertTriangle, CheckCircle, Tag, Settings, Zap, Target, Star, Bookmark, Copy, RefreshCw, Download, Upload, Plus, Minus, Edit, Trash2 } from '@/lib/icons';
import Link from 'next/link';

interface ContractFormData {
  templateId: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes: string;
  variables: Record<string, any>;
  expirationDays: number;
  relatedOrderId?: string;
  relatedQuoteId?: string;
}

function NewContractPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentCompany } = useB2B();
  const { 
    templates, 
    createContract, 
    sendContract,
    getTemplateById,
    previewContract,
    settings
  } = useLegal();
  
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formData, setFormData] = useState<ContractFormData>({
    templateId: '',
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    priority: 'medium',
    tags: [],
    notes: '',
    variables: {},
    expirationDays: settings.defaultExpirationDays,
    relatedOrderId: '',
    relatedQuoteId: ''
  });
  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Si hay un template ID en la URL, seleccionarlo automáticamente
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        setFormData(prev => ({
          ...prev,
          templateId: template.id,
          title: `${template.name} - ${prev.clientName || 'Nuevo Cliente'}`
        }));
        
        // Inicializar variables con valores por defecto
        const initialVariables: Record<string, any> = {};
        template.variables.forEach(variable => {
          initialVariables[variable] = getDefaultValue(variable);
        });
        setFormData(prev => ({ ...prev, variables: initialVariables }));
      }
    }
  }, [searchParams, templates]);

  useEffect(() => {
    // Actualizar título cuando cambie el cliente o plantilla
    if (selectedTemplate && formData.clientName) {
      setFormData(prev => ({
        ...prev,
        title: `${selectedTemplate.name} - ${formData.clientName}`
      }));
    }
  }, [selectedTemplate, formData.clientName]);

  const getDefaultValue = (variable: string): string => {
    const defaults: Record<string, string> = {
      'COMPANY_NAME': currentCompany?.name || 'Ddreams 3D',
      'COMPANY_SIGNATORY': settings.companySignatory.name,
      'CONTRACT_DATE': new Date().toLocaleDateString('es-PE'),
      'DURATION_MONTHS': '12',
      'PENALTY_AMOUNT': 'S/ 5,000',
      'DELIVERY_TIME': '15 días hábiles',
      'PAYMENT_TERMS': '30 días',
      'TERRITORY': 'Perú',
      'LICENSE_TYPE': 'No exclusiva',
      'LICENSE_DURATION': '2 años'
    };
    
    return defaults[variable] || '';
  };

  const getVariableLabel = (variable: string): string => {
    const labels: Record<string, string> = {
      'COMPANY_NAME': 'Nombre de la Empresa',
      'CLIENT_NAME': 'Nombre del Cliente',
      'CONTRACT_DATE': 'Fecha del Contrato',
      'ADDITIONAL_INFO': 'Información Adicional',
      'DURATION_MONTHS': 'Duración (meses)',
      'OBLIGATIONS': 'Obligaciones Específicas',
      'PENALTY_AMOUNT': 'Monto de Penalidad',
      'COMPANY_SIGNATORY': 'Firmante de la Empresa',
      'SERVICES_DESCRIPTION': 'Descripción de Servicios',
      'MATERIALS': 'Materiales',
      'DELIVERY_TIME': 'Tiempo de Entrega',
      'TOTAL_AMOUNT': 'Monto Total',
      'PAYMENT_TERMS': 'Términos de Pago',
      'TECHNICAL_SPECS': 'Especificaciones Técnicas',
      'WARRANTIES': 'Garantías',
      'DELIVERY_ADDRESS': 'Dirección de Entrega',
      'DELIVERY_DATE': 'Fecha de Entrega',
      'LICENSED_DESIGNS': 'Diseños Licenciados',
      'LICENSE_TYPE': 'Tipo de Licencia',
      'LICENSE_DURATION': 'Duración de Licencia',
      'TERRITORY': 'Territorio',
      'ROYALTY_TERMS': 'Términos de Regalías',
      'RESTRICTIONS': 'Restricciones'
    };
    
    return labels[variable] || variable.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getVariableType = (variable: string): 'text' | 'textarea' | 'number' | 'date' => {
    const textareaFields = ['ADDITIONAL_INFO', 'OBLIGATIONS', 'SERVICES_DESCRIPTION', 'TECHNICAL_SPECS', 'WARRANTIES', 'LICENSED_DESIGNS', 'ROYALTY_TERMS', 'RESTRICTIONS'];
    const numberFields = ['DURATION_MONTHS'];
    const dateFields = ['CONTRACT_DATE', 'DELIVERY_DATE'];
    
    if (textareaFields.includes(variable)) return 'textarea';
    if (numberFields.includes(variable)) return 'number';
    if (dateFields.includes(variable)) return 'date';
    return 'text';
  };

  const handleTemplateSelect = async (templateId: string) => {
    const template = await getTemplateById(templateId);
    if (template) {
      setSelectedTemplate(template);
      setFormData(prev => ({
        ...prev,
        templateId: template.id,
        title: `${template.name} - ${prev.clientName || 'Nuevo Cliente'}`
      }));
      
      // Inicializar variables
      const initialVariables: Record<string, any> = {};
      template.variables.forEach(variable => {
        initialVariables[variable] = getDefaultValue(variable);
      });
      setFormData(prev => ({ ...prev, variables: initialVariables }));
    }
  };

  const handleInputChange = (field: keyof ContractFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleVariableChange = (variable: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variables: { ...prev.variables, [variable]: value }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generatePreview = () => {
    if (!selectedTemplate) return;
    
    const variables = {
      ...formData.variables,
      CLIENT_NAME: formData.clientName,
      COMPANY_NAME: currentCompany?.name || 'Ddreams 3D'
    };
    
    const content = previewContract(selectedTemplate.id, variables);
    setPreviewContent(content);
    setShowPreview(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.templateId) newErrors.templateId = 'Selecciona una plantilla';
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.clientName.trim()) newErrors.clientName = 'El nombre del cliente es requerido';
    if (!formData.clientEmail.trim()) newErrors.clientEmail = 'El email del cliente es requerido';
    if (formData.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Email inválido';
    }
    
    // Validar variables requeridas
    if (selectedTemplate) {
      selectedTemplate.variables.forEach((variable: string) => {
        if (!formData.variables[variable]?.toString().trim()) {
          newErrors[`variable_${variable}`] = `${getVariableLabel(variable)} es requerido`;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (sendImmediately = false) => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const contractId = await createContract(formData.templateId, {
        ...formData,
        companyId: currentCompany?.id,
        companyName: currentCompany?.name
      });
      
      if (sendImmediately) {
        await sendContract(contractId);
      }
      
      router.push(`/legal/${contractId}`);
    } catch (error) {
      console.error('Error creating contract:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'nda': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'service_agreement': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'manufacturing_contract': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'licensing': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'custom': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    
    const labels: Record<string, string> = {
      'nda': 'NDA',
      'service_agreement': 'Servicios',
      'manufacturing_contract': 'Fabricación',
      'licensing': 'Licencia',
      'custom': 'Personalizado'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type] || colors.custom}`}>
        {labels[type] || type}
      </span>
    );
  };

  if (!currentCompany) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Scale className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Empresarial Requerido</h2>
            <p className="text-muted-foreground text-center">
              Para crear contratos, necesitas iniciar sesión con una cuenta empresarial.
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
        <div className="flex items-center space-x-4">
          <Link href="/legal">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nuevo Contrato</h1>
            <p className="text-muted-foreground mt-1">
              Crea un nuevo contrato basado en una plantilla
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedTemplate && (
            <Button variant="outline" onClick={generatePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Borrador
          </Button>
          <Button 
            onClick={() => handleSave(true)}
            disabled={loading}
          >
            <Send className="h-4 w-4 mr-2" />
            Crear y Enviar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selección de plantilla */}
          {!selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Plantilla</CardTitle>
                <CardDescription>
                  Elige una plantilla como base para tu contrato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.filter(t => t.isActive).map((template) => (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold">{template.name}</h3>
                          {getTypeBadge(template.type)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>v{template.version}</span>
                          <span>{template.variables.length} variables</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información del contrato */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span>Información del Contrato</span>
                    {getTypeBadge(selectedTemplate.type)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedTemplate(null)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Cambiar Plantilla
                  </Button>
                </CardTitle>
                <CardDescription>
                  Plantilla: {selectedTemplate.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título del Contrato *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ej: NDA - TechCorp Solutions"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select value={formData.priority} onValueChange={(value: string) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notas Internas</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Notas adicionales sobre este contrato..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información del cliente */}
          {selectedTemplate && (
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
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Nombre del cliente o empresa"
                      className={errors.clientName ? 'border-red-500' : ''}
                    />
                    {errors.clientName && <p className="text-sm text-red-500 mt-1">{errors.clientName}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="clientEmail">Email *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      placeholder="email@cliente.com"
                      className={errors.clientEmail ? 'border-red-500' : ''}
                    />
                    {errors.clientEmail && <p className="text-sm text-red-500 mt-1">{errors.clientEmail}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientPhone">Teléfono</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                      placeholder="+51 999 888 777"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expirationDays">Días para Vencimiento</Label>
                    <Input
                      id="expirationDays"
                      type="number"
                      value={formData.expirationDays}
                      onChange={(e) => handleInputChange('expirationDays', parseInt(e.target.value) || 30)}
                      min="1"
                      max="365"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="clientAddress">Dirección</Label>
                  <Textarea
                    id="clientAddress"
                    value={formData.clientAddress}
                    onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                    placeholder="Dirección completa del cliente"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Variables del contrato */}
          {selectedTemplate && selectedTemplate.variables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Variables del Contrato
                </CardTitle>
                <CardDescription>
                  Completa la información específica para este contrato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplate.variables.map((variable: string) => {
                  const variableType = getVariableType(variable);
                  const label = getVariableLabel(variable);
                  const value = formData.variables[variable] || '';
                  const error = errors[`variable_${variable}`];
                  
                  return (
                    <div key={variable}>
                      <Label htmlFor={variable}>{label} *</Label>
                      {variableType === 'textarea' ? (
                        <Textarea
                          id={variable}
                          value={value}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                          placeholder={`Ingresa ${label.toLowerCase()}`}
                          rows={3}
                          className={error ? 'border-red-500' : ''}
                        />
                      ) : (
                        <Input
                          id={variable}
                          type={variableType}
                          value={value}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                          placeholder={`Ingresa ${label.toLowerCase()}`}
                          className={error ? 'border-red-500' : ''}
                        />
                      )}
                      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Etiquetas
                </CardTitle>
                <CardDescription>
                  Añade etiquetas para organizar mejor tus contratos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nueva etiqueta"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} disabled={!newTag.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
                  <span className="text-muted-foreground">Empresa:</span>
                  <p className="font-medium">{currentCompany.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{currentCompany.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Teléfono:</span>
                  <p className="font-medium">{currentCompany.phone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dirección:</span>
                  <p className="font-medium">{currentCompany.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                Configuración Legal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Firmante:</span>
                  <p className="font-medium">{settings.companySignatory.name}</p>
                  <p className="text-xs text-muted-foreground">{settings.companySignatory.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Jurisdicción:</span>
                  <p className="font-medium">{settings.legalNotices.jurisdiction}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ley Aplicable:</span>
                  <p className="font-medium">{settings.legalNotices.governingLaw}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ayuda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Consejos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Revisa cuidadosamente toda la información antes de enviar</p>
                <p>• Las variables marcadas con * son obligatorias</p>
                <p>• Puedes guardar como borrador y completar después</p>
                <p>• Usa la vista previa para verificar el contenido final</p>
                <p>• Las etiquetas te ayudan a organizar tus contratos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de vista previa */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Vista Previa del Contrato</h2>
              <Button variant="ghost" onClick={() => setShowPreview(false)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-white text-black p-8 rounded border">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {previewContent}
                </pre>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Cerrar
              </Button>
              <Button onClick={() => handleSave(false)} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Contrato
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewContractPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
      <NewContractPageContent />
    </Suspense>
  );
}