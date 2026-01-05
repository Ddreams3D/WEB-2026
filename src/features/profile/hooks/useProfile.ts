import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Address } from '@/features/auth/types/auth.types';
import { useOrderTracking } from '@/contexts/OrderTrackingContext';
import { useToast } from '@/components/ui/ToastManager';

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
}

export const useProfile = () => {
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
  const [formData, setFormData] = useState<ProfileFormData>({
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

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        birthDate: user.birthDate || '',
      });
    }
  }, [user]);

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

  return {
    user,
    isLoading,
    orders,
    activeOrders,
    completedOrders,
    favoritesCount,
    
    // Profile Form
    formData,
    isEditing,
    setIsEditing,
    isSaving,
    handleInputChange,
    handleSave,
    handleCancel,
    
    // Address Management
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
    
    // Helpers
    getStatusColor,
    getStatusLabel,
    showSuccess // Export showSuccess to allow usage in components if needed
  };
};
