'use client';

import { useState, useEffect } from 'react';
import { useAuth, Address } from '@/contexts/AuthContext';
import { useOrderTracking } from '@/contexts/OrderTrackingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, Mail, Phone, MapPin, Calendar, Camera, Loader2, X, 
  Package, Heart, Clock, CreditCard, ShoppingBag,
  Plus, Trash2, Edit2, Home, Briefcase, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastManager';
import Link from 'next/link';
import { UserAvatar } from '@/shared/components/ui/DefaultImage';

export default function ProfilePage() {
  const { user, isLoading, updateUser } = useAuth();
  const { orders, loadOrders } = useOrderTracking();
  const { showSuccess, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Calculate stats
  const activeOrders = orders.filter(o => !['completed', 'cancelled', 'refunded'].includes(o.status)).length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  // Mock favorites count for now
  const favoritesCount = 12;

  // Local state for form data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthDate: user?.birthDate || '',
  });

  // Address Management State
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Address>({
    id: '',
    label: 'Casa',
    recipientName: user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Perú',
    phone: user?.phone || '',
    isDefault: false
  });

  const handleAddressInputChange = (field: keyof Address, value: string | boolean) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm(address);
    setEditingAddressId(address.id);
    setIsAddressFormOpen(true);
  };

  const handleAddNewAddress = () => {
    setAddressForm({
      id: '',
      label: 'Casa',
      recipientName: user?.name || '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Perú',
      phone: user?.phone || '',
      isDefault: false
    });
    setEditingAddressId(null);
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      let updatedAddresses = [...(user.addresses || [])];
      
      if (editingAddressId) {
        // Update existing
        updatedAddresses = updatedAddresses.map(addr => 
          addr.id === editingAddressId ? { ...addressForm, id: editingAddressId } : addr
        );
      } else {
        // Add new
        const newAddress = { ...addressForm, id: `addr_${Date.now()}` };
        // If it's the first address, make it default automatically
        if (updatedAddresses.length === 0) newAddress.isDefault = true;
        updatedAddresses.push(newAddress);
      }

      // Handle default logic: if current is default, unset others
      if (addressForm.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === (editingAddressId || addressForm.id) ? true : false
        }));
      }

      const success = await updateUser({ addresses: updatedAddresses });
      if (success) {
        setIsAddressFormOpen(false);
        showSuccess('Dirección guardada', 'Tu libreta de direcciones ha sido actualizada.');
      }
    } catch (error) {
      showError('Error', 'No se pudo guardar la dirección.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;
    
    setIsSaving(true);
    try {
      const updatedAddresses = (user.addresses || []).filter(a => a.id !== id);
      await updateUser({ addresses: updatedAddresses });
      showSuccess('Dirección eliminada', 'La dirección ha sido eliminada correctamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updatedAddresses = (user.addresses || []).map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      await updateUser({ addresses: updatedAddresses });
      showSuccess('Dirección predeterminada', 'Se ha actualizado tu dirección principal.');
    } finally {
      setIsSaving(false);
    }
  };

  // Update local state when user data loads
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateUser(formData);
      if (success) {
        setIsEditing(false);
        showSuccess('Perfil actualizado', 'Tus datos han sido guardados correctamente.');
      } else {
        showError('Error', 'No se pudieron guardar los cambios.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Error', 'Ocurrió un error inesperado.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      birthDate: user?.birthDate || '',
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
      };
      
      const getStatusLabel = (status: string) => {
        switch (status) {
          case 'quote_requested': return 'Cotización';
          case 'pending_payment': return 'Pendiente de Pago';
          case 'processing': return 'En Producción';
          case 'ready': return 'Listo para Recoger';
          case 'shipped': return 'Enviado';
          case 'completed': return 'Completado';
          case 'cancelled': return 'Cancelado';
          case 'refunded': return 'Reembolsado';
          default: return status;
        }
      };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">Acceso Requerido</h1>
        <p className="text-muted-foreground mb-4">Por favor inicia sesión para ver tu perfil.</p>
        <Button onClick={() => window.location.href = '/login'}>Iniciar Sesión</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10 space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / User Summary Card */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="overflow-hidden border-border/50 shadow-md">
            <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/30 relative">
              {/* Cover background */}
            </div>
            <CardContent className="pt-0 relative">
              <div className="flex justify-center -mt-16 mb-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-lg relative">
                    {user.photoURL ? (
                      <UserAvatar 
                        src={user.photoURL} 
                        alt={user.name || 'User Profile'} 
                        fill
                        className="object-cover" 
                      />
                    ) : (
                      <User className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => showSuccess('Próximamente', 'La subida de avatar estará disponible pronto.')}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-center space-y-1 mb-6">
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    Usuario
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-border/50 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{activeOrders}</p>
                  <p className="text-xs text-muted-foreground">Activos</p>
                </div>
                <div className="text-center border-l border-r border-border/50">
                  <p className="text-2xl font-bold text-foreground">{completedOrders}</p>
                  <p className="text-xs text-muted-foreground">Completados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{favoritesCount}</p>
                  <p className="text-xs text-muted-foreground">Favoritos</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4 opacity-70" />
                  <span>Miembro desde {new Date().getFullYear()}</span>
                </div>
                {user.address && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 opacity-70" />
                    <span className="truncate">{user.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions (Optional) */}
          <Card className="border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/cotizaciones/nueva">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Nueva Cotización
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/catalogo-impresion-3d">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Ir al Catálogo
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content / Tabs */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="addresses">Direcciones</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-border/50 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>
                        Gestiona tu información personal y de contacto.
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        Editar
                      </Button>
                    ) : (
                      <Button onClick={handleCancel} variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            placeholder="Tu nombre"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={true} // Email usually not editable directly
                            className="pl-9 bg-muted/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+51 999 999 999"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="address"
                            name="address"
                            placeholder="Av. Principal 123, Ciudad"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSaving}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Guardar Cambios
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              {!isAddressFormOpen ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Mis Direcciones</h3>
                    <Button onClick={handleAddNewAddress} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Dirección
                    </Button>
                  </div>
                  
                  {(user.addresses && user.addresses.length > 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.addresses.map((addr) => (
                        <Card key={addr.id} className={cn("border-border/50 relative", addr.isDefault && "border-primary/50 bg-primary/5")}>
                          {addr.isDefault && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg font-medium flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Principal
                            </div>
                          )}
                          <CardContent className="p-4 pt-6">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {addr.label === 'Casa' && <Home className="h-4 w-4 text-muted-foreground" />}
                                {addr.label === 'Trabajo' && <Briefcase className="h-4 w-4 text-muted-foreground" />}
                                {addr.label === 'Otro' && <MapPin className="h-4 w-4 text-muted-foreground" />}
                                <span className="font-medium">{addr.label}</span>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditAddress(addr)}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteAddress(addr.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm space-y-1 text-muted-foreground">
                              <p className="font-medium text-foreground">{addr.recipientName}</p>
                              <p>{addr.street}</p>
                              <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                              <p>{addr.country}</p>
                              <p className="pt-2 flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {addr.phone}
                              </p>
                            </div>
                            {!addr.isDefault && (
                              <Button variant="link" size="sm" className="px-0 mt-2 h-auto text-primary" onClick={() => handleSetDefaultAddress(addr.id)}>
                                Establecer como principal
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-border/50 border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">No tienes direcciones guardadas</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Agrega una dirección para agilizar tus compras.
                        </p>
                        <Button onClick={handleAddNewAddress}>
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Dirección
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="border-border/50 shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{editingAddressId ? 'Editar Dirección' : 'Nueva Dirección'}</CardTitle>
                      <Button onClick={() => setIsAddressFormOpen(false)} variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveAddress(); }} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="addr-label">Etiqueta</Label>
                          <Select 
                            value={addressForm.label} 
                            onValueChange={(val) => handleAddressInputChange('label', val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una etiqueta" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Casa">Casa</SelectItem>
                              <SelectItem value="Trabajo">Trabajo</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="addr-recipient">Nombre de quien recibe</Label>
                          <Input 
                            id="addr-recipient" 
                            value={addressForm.recipientName}
                            onChange={(e) => handleAddressInputChange('recipientName', e.target.value)}
                            placeholder="Ej. Juan Pérez"
                            required
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <Label htmlFor="addr-street">Dirección y número</Label>
                          <Input 
                            id="addr-street" 
                            value={addressForm.street}
                            onChange={(e) => handleAddressInputChange('street', e.target.value)}
                            placeholder="Ej. Av. Larco 123, Dpto 401"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="addr-city">Ciudad</Label>
                          <Input 
                            id="addr-city" 
                            value={addressForm.city}
                            onChange={(e) => handleAddressInputChange('city', e.target.value)}
                            placeholder="Ej. Lima"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="addr-state">Provincia / Estado</Label>
                          <Input 
                            id="addr-state" 
                            value={addressForm.state}
                            onChange={(e) => handleAddressInputChange('state', e.target.value)}
                            placeholder="Ej. Lima"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="addr-zip">Código Postal</Label>
                          <Input 
                            id="addr-zip" 
                            value={addressForm.zipCode}
                            onChange={(e) => handleAddressInputChange('zipCode', e.target.value)}
                            placeholder="Ej. 15074"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="addr-phone">Teléfono de contacto</Label>
                          <Input 
                            id="addr-phone" 
                            value={addressForm.phone}
                            onChange={(e) => handleAddressInputChange('phone', e.target.value)}
                            placeholder="Ej. 999 999 999"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id="addr-default"
                          checked={addressForm.isDefault}
                          onChange={(e) => handleAddressInputChange('isDefault', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="addr-default" className="cursor-pointer">Establecer como dirección predeterminada</Label>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsAddressFormOpen(false)} disabled={isSaving}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Guardar Dirección
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <Card key={order.id} className="border-border/50 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              Pedido #{order.id.substring(0, 8).toUpperCase()}
                              <span className={cn("text-xs px-2 py-0.5 rounded-full font-normal", getStatusColor(order.status))}>
                                {getStatusLabel(order.status)}
                              </span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/pedidos/${order.id}`}>Ver Detalles</Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            <span>{order.items.length} items</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Entrega: {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString() : 'Pendiente'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-border/50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                      <h3 className="text-lg font-medium">No tienes pedidos recientes</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        ¡Es un buen momento para iniciar tu primer proyecto!
                      </p>
                      <Button asChild>
                        <Link href="/catalogo-impresion-3d">Explorar Catálogo</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mock Favorites Items */}
                {[1, 2, 3, 4].map((item) => (
                  <Card key={item} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow group">
                    <div className="aspect-square bg-muted relative">
                      {/* Placeholder Image */}
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                        <Package className="h-12 w-12" />
                      </div>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-red-500"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">Pieza de Ingeniería {item}</h3>
                      <p className="text-sm text-muted-foreground">S/. 45.00</p>
                      <Button className="w-full mt-3" size="sm" variant="outline">
                        Ver Producto
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
