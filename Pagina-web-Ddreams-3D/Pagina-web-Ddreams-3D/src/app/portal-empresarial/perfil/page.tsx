'use client';

import { useState, useEffect } from 'react';
import { useB2B } from '@/contexts/B2BContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, MapPin, Phone, Mail, Globe, Users, Calendar, Edit, Save, X, Plus, Trash2, Shield, CreditCard, FileText } from '@/lib/icons';
import { toast } from 'sonner';

interface ContactPerson {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  isPrimary: boolean;
}

interface BillingInfo {
  taxId: string;
  legalName: string;
  billingAddress: string;
  paymentTerms: string;
  creditLimit: number;
  preferredCurrency: 'USD' | 'EUR' | 'PEN' | 'MXN';
}

export default function PerfilEmpresaPage() {
  const { currentCompany, updateCompany } = useB2B();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    employeeCount: 0
  });
  
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    taxId: '',
    legalName: '',
    billingAddress: '',
    paymentTerms: 'Net 30',
    creditLimit: 0,
    preferredCurrency: 'PEN'
  });

  useEffect(() => {
    if (currentCompany) {
      setFormData({
        name: currentCompany.name,
        industry: currentCompany.industry,
        description: currentCompany.description || '',
        website: currentCompany.website || '',
        phone: currentCompany.phone || '',
        email: currentCompany.email || '',
        address: currentCompany.address || '',
        employeeCount: currentCompany.employeeCount || 0
      });
      
      // Mock data para contactos
      setContacts([
        {
          id: '1',
          name: 'María González',
          position: 'Gerente de Compras',
          email: 'maria.gonzalez@techcorp.com',
          phone: '+51 1 234-5678',
          department: 'Procurement',
          isPrimary: true
        },
        {
          id: '2',
          name: 'Carlos Mendoza',
          position: 'Ingeniero de Proyectos',
          email: 'carlos.mendoza@techcorp.com',
          phone: '+51 1 234-5679',
          department: 'Engineering',
          isPrimary: false
        }
      ]);
      
      // Mock data para facturación
      setBillingInfo({
        taxId: '20987654321',
        legalName: 'TechCorp Industries S.A.C.',
        billingAddress: 'Av. Industrial 456, Lima 15001, Perú',
        paymentTerms: 'Net 30',
        creditLimit: 50000,
        preferredCurrency: 'PEN'
      });
    }
  }, [currentCompany]);

  const handleSave = async () => {
    if (!currentCompany) return;
    
    setLoading(true);
    try {
      const success = await updateCompany(formData);
      if (success) {
        setIsEditing(false);
        toast.success('Perfil actualizado correctamente');
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentCompany) {
      setFormData({
        name: currentCompany.name,
        industry: currentCompany.industry,
        description: currentCompany.description || '',
        website: currentCompany.website || '',
        phone: currentCompany.phone || '',
        email: currentCompany.email || '',
        address: currentCompany.address || '',
        employeeCount: currentCompany.employeeCount || 0
      });
    }
    setIsEditing(false);
  };

  const addContact = () => {
    const newContact: ContactPerson = {
      id: `contact-${Date.now()}`,
      name: '',
      position: '',
      email: '',
      phone: '',
      department: '',
      isPrimary: false
    };
    setContacts([...contacts, newContact]);
  };

  const removeContact = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  const updateContact = (contactId: string, field: keyof ContactPerson, value: string | boolean) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, [field]: value }
        : contact
    ));
  };

  if (!currentCompany) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No hay empresa seleccionada</h2>
            <p className="text-muted-foreground text-center">
              Para ver el perfil de empresa, necesitas tener una empresa activa.
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
            Perfil de Empresa
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona la información de tu empresa y configuraciones
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información General */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Información General
            </CardTitle>
            <CardDescription>
              Datos básicos de tu empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre de la Empresa</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industria</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                disabled={!isEditing}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Sitio Web</Label>
                <div className="flex">
                  <Globe className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="employeeCount">Número de Empleados</Label>
                <div className="flex">
                  <Users className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                  <Input
                    id="employeeCount"
                    type="number"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: parseInt(e.target.value) || 0 })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <div className="flex">
                  <Phone className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="flex">
                  <Mail className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Dirección</Label>
              <div className="flex">
                <MapPin className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de la Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Información de Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado de la Cuenta</span>
              <Badge variant="default">Activa</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tipo de Cliente</span>
              <Badge variant="secondary">Empresarial</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Miembro desde</span>
              <span className="text-sm text-muted-foreground">
                {new Date(currentCompany.createdAt).toLocaleDateString('es-PE')}
              </span>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Límites de Cuenta</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Órdenes simultáneas:</span>
                  <span>10</span>
                </div>
                <div className="flex justify-between">
                  <span>Límite de crédito:</span>
                  <span>S/ 50,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Descuento por volumen:</span>
                  <span>5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contactos */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Personas de Contacto
              </CardTitle>
              <CardDescription>
                Gestiona los contactos de tu empresa
              </CardDescription>
            </div>
            <Button onClick={addContact} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Contacto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={contact.name}
                      onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Cargo</Label>
                    <Input
                      value={contact.position}
                      onChange={(e) => updateContact(contact.id, 'position', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Departamento</Label>
                    <Input
                      value={contact.department}
                      onChange={(e) => updateContact(contact.id, 'department', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={contact.email}
                      onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      value={contact.phone}
                      onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center space-x-2">
                      {contact.isPrimary && (
                        <Badge variant="default" className="text-xs">
                          Contacto Principal
                        </Badge>
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeContact(contact.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información de Facturación */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Información de Facturación
          </CardTitle>
          <CardDescription>
            Configuración para facturación y pagos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>RUC / Tax ID</Label>
              <Input value={billingInfo.taxId} disabled />
            </div>
            <div>
              <Label>Razón Social</Label>
              <Input value={billingInfo.legalName} disabled />
            </div>
            <div className="md:col-span-2">
              <Label>Dirección de Facturación</Label>
              <Textarea value={billingInfo.billingAddress} disabled rows={2} />
            </div>
            <div>
              <Label>Términos de Pago</Label>
              <Input value={billingInfo.paymentTerms} disabled />
            </div>
            <div>
              <Label>Límite de Crédito</Label>
              <Input 
                value={new Intl.NumberFormat('es-PE', {
                  style: 'currency',
                  currency: 'PEN'
                }).format(billingInfo.creditLimit)} 
                disabled 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}