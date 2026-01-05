import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Home, Briefcase, MapPin, Edit2, Trash2, Phone, X, Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Address } from '@/features/auth/types/auth.types';

interface ProfileAddressesTabProps {
  addresses: Address[] | undefined;
  isAddressFormOpen: boolean;
  setIsAddressFormOpen: (open: boolean) => void;
  editingAddressId: string | null;
  addressForm: Address;
  handleAddressInputChange: (field: keyof Address, value: string | boolean) => void;
  handleEditAddress: (address: Address) => void;
  handleAddNewAddress: () => void;
  handleSaveAddress: () => Promise<void>;
  handleDeleteAddress: (id: string) => Promise<void>;
  handleSetDefaultAddress: (id: string) => Promise<void>;
  isSaving: boolean;
}

export const ProfileAddressesTab: React.FC<ProfileAddressesTabProps> = ({
  addresses,
  isAddressFormOpen,
  setIsAddressFormOpen,
  editingAddressId,
  addressForm,
  handleAddressInputChange,
  handleEditAddress,
  handleAddNewAddress,
  handleSaveAddress,
  handleDeleteAddress,
  handleSetDefaultAddress,
  isSaving
}) => {
  return (
    <div className="space-y-6">
      {!isAddressFormOpen ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Mis Direcciones</h3>
            <Button onClick={handleAddNewAddress} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Dirección
            </Button>
          </div>
          
          {(addresses && addresses.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
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
    </div>
  );
};
