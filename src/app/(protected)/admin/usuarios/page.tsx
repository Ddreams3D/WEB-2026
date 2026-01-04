'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as MagnifyingGlassIcon, Plus as PlusIcon, Edit as PencilIcon, Trash2 as TrashIcon, UserCircle as UserCircleIcon, Ban as BanIcon, CheckCircle as CheckCircleIcon, ShieldCheck as ShieldCheckIcon, Users as UsersIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { UserService } from '@/services/user.service';
import { User, UserRole, UserStatus } from '@/shared/types/domain';
import { UserAvatar } from '@/shared/components/ui/DefaultImage';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmationModal from '@/features/admin/components/ConfirmationModal';

function UserModal({ user, isOpen, onClose, onSave, defaultRole = 'user' }: {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<User>) => Promise<void>;
  defaultRole?: UserRole;
}) {
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  }>({
    username: '',
    email: '',
    role: defaultRole,
    status: 'active'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        role: user.role || defaultRole,
        status: user.status || 'active'
      });
    } else {
      setFormData({
        username: '',
        email: '',
        role: defaultRole,
        status: 'active'
      });
    }
  }, [user, defaultRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Currently only editing is supported via modal for existing users (auth handles creation)

    setIsSaving(true);
    try {
      await onSave(user.id, {
        role: formData.role,
        status: formData.status
      });
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error al guardar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-background/80" onClick={onClose} />
        
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-card shadow-xl rounded-2xl border border-border">
          <h3 className="text-lg font-medium leading-6 text-foreground mb-4">
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={formData.username}
                disabled
                className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">El nombre de usuario se gestiona desde el perfil del cliente.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="user">Usuario (Cliente)</option>
                <option value="admin">Administrador (Staff)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="banned">Baneado</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="ghost"
                className="bg-muted hover:bg-muted/80 text-foreground"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="gradient"
                className="transform hover:scale-105"
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Actualizar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

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
      // First try to seed if empty (for demo purposes if DB is clean)
      // await UserService.seedInitialUsers();
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

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-600';
      case 'banned': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'banned': return 'Baneado';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const renderUserTable = (role: 'user' | 'admin') => {
    const filteredList = getFilteredUsers(role);

    if (isLoading) {
      return (
        <div className="p-12 text-center text-muted-foreground">
          Cargando usuarios...
        </div>
      );
    }

    if (filteredList.length === 0) {
      return (
        <div className="p-12 text-center text-muted-foreground">
          No se encontraron {role === 'user' ? 'clientes' : 'administradores'} con los filtros actuales.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Usuario
              </th>
              {role === 'admin' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Rol
                </th>
              )}
              {role === 'user' && (
                <>
                  <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Pedidos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total Gastado
                  </th>
                </>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Último acceso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredList.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-3 relative shrink-0">
                      <UserAvatar 
                        src={user.photoURL || undefined} 
                        alt={user.username || 'Usuario'} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {user.username || 'Sin nombre'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                {role === 'admin' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-secondary/20 text-secondary">
                      Administrador
                    </span>
                  </td>
                )}
                {role === 'user' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-foreground">
                      {user.totalOrders || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-foreground">
                      {formatCurrency(user.totalSpent || 0)}
                    </td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      onClick={() => openModal(user)}
                      variant="ghost"
                      size="icon"
                      className="hover:text-primary"
                      title="Editar Permisos"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    {user.status !== 'banned' ? (
                      <Button
                        onClick={() => handleUpdateUser(user.id, { status: 'banned' })}
                        variant="ghost"
                        size="icon"
                        className="hover:text-destructive text-destructive/70"
                        title="Banear Usuario"
                      >
                        <BanIcon className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUpdateUser(user.id, { status: 'active' })}
                        variant="ghost"
                        size="icon"
                        className="hover:text-success text-success/70"
                        title="Reactivar Usuario"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeleteUser(user.id)}
                      variant="ghost"
                      size="icon"
                      className="hover:text-destructive"
                      title="Eliminar permanentemente"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'banned')}
              className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="banned">Baneados</option>
            </select>
          </div>
        </div>

        <TabsContent value="customers" className="space-y-4">
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            {renderUserTable('user')}
          </div>
          <div className="text-sm text-muted-foreground">
             Mostrando {getFilteredUsers('user').length} clientes
          </div>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
             {renderUserTable('admin')}
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
