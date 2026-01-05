'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileQuickActions } from '@/features/profile/components/ProfileQuickActions';
import { ProfileInfoTab } from '@/features/profile/components/ProfileInfoTab';
import { ProfileAddressesTab } from '@/features/profile/components/ProfileAddressesTab';
import { ProfileOrdersTab } from '@/features/profile/components/ProfileOrdersTab';
import { ProfileFavoritesTab } from '@/features/profile/components/ProfileFavoritesTab';

export default function ProfilePage() {
  const {
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
    showSuccess
  } = useProfile();

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
          <ProfileHeader 
            user={user}
            activeOrders={activeOrders}
            completedOrders={completedOrders}
            favoritesCount={favoritesCount}
            showSuccess={showSuccess}
          />

          {/* Quick Actions */}
          <ProfileQuickActions />
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
              <ProfileInfoTab 
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                isSaving={isSaving}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
              />
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              <ProfileAddressesTab 
                addresses={user.addresses}
                isAddressFormOpen={isAddressFormOpen}
                setIsAddressFormOpen={setIsAddressFormOpen}
                editingAddressId={editingAddressId}
                addressForm={addressForm}
                handleAddressInputChange={handleAddressInputChange}
                handleEditAddress={handleEditAddress}
                handleAddNewAddress={handleAddNewAddress}
                handleSaveAddress={handleSaveAddress}
                handleDeleteAddress={handleDeleteAddress}
                handleSetDefaultAddress={handleSetDefaultAddress}
                isSaving={isSaving}
              />
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <ProfileOrdersTab 
                orders={orders}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
              />
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <ProfileFavoritesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
