'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck as ShieldCheckIcon, Users as UsersIcon } from '@/lib/icons';
import { UserService } from '@/services/user.service';
import { User, UserStatus } from '@/shared/types/domain';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmationModal from '@/features/admin/components/ConfirmationModal';
import { UserModal } from '@/features/admin/users/components/UserModal';
import { UserTable } from '@/features/admin/users/components/UserTable';
import { UserFilters } from '@/features/admin/users/components/UserFilters';

export default function UsersManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | UserStatus>('all');
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'info';
    isLoading: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
    variant: 'warning',
    isLoading: false
  });
  const [activeTab, setActiveTab] = useState('customers');

  const fetchUsers = async () => {
    if (!currentUser) return; // Wait for auth
    
    setIsLoading(true);
    try {
      console.log('Fetching users...');
      const data = await UserService.getAllUsers(true);
      console.log('Users fetched:', data.length);
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const getFilteredUsers = (role: 'user' | 'admin') => {
    return users.filter(user => {
      // Filter by role (strict separation)
      if (user.role !== role) return false;

      // Filter by search term
      const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  };

  const handleUpdateUser = async (id: string, updates: Partial<User>) => {
    await UserService.updateUser(id, updates);
    await fetchUsers(); // Refresh list
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmation({
      isOpen: true,
      title: 'Eliminar Usuario',
      message: '¿Estás seguro de que quieres eliminar este usuario permanentemente? Esta acción NO se puede deshacer.',
      variant: 'danger',
      isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmation(prev => ({ ...prev, isLoading: true }));
          await UserService.deleteUser(userId);
          await fetchUsers();
          setConfirmation(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting user:', error);
          alert('Error al eliminar usuario');
          setConfirmation(prev => ({ ...prev, isLoading: false }));
        }
      }
    });
  };

  const openModal = (user?: User) => {
    setSelectedUser(user || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        variant={confirmation.variant}
        isLoading={confirmation.isLoading}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra clientes y personal del equipo
          </p>
        </div>
        <Button
          onClick={() => fetchUsers()}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <span>Refrescar Lista</span>
        </Button>
      </div>

      <Tabs defaultValue="customers" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4" />
            Equipo / Staff
          </TabsTrigger>
        </TabsList>

        {/* Filters and Search - Common for both tabs */}
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        <TabsContent value="customers" className="space-y-4">
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <UserTable
              users={getFilteredUsers('user')}
              role="user"
              isLoading={isLoading}
              onEdit={openModal}
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
            />
          </div>
          <div className="text-sm text-muted-foreground">
             Mostrando {getFilteredUsers('user').length} clientes
          </div>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <UserTable
              users={getFilteredUsers('admin')}
              role="admin"
              isLoading={isLoading}
              onEdit={openModal}
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
            />
          </div>
          <div className="text-sm text-muted-foreground">
             Mostrando {getFilteredUsers('admin').length} administradores
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdateUser}
        defaultRole={activeTab === 'admins' ? 'admin' : 'user'}
      />
    </div>
  );
}
