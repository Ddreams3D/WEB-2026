import React from 'react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/shared/components/ui/DefaultImage';
import { User, UserStatus } from '@/shared/types/domain';
import { Edit as PencilIcon, Trash2 as TrashIcon, Ban as BanIcon, CheckCircle as CheckCircleIcon } from '@/lib/icons';

interface UserTableProps {
  users: User[];
  role: 'user' | 'admin';
  isLoading: boolean;
  onEdit: (user: User) => void;
  onUpdate: (id: string, updates: Partial<User>) => Promise<void>;
  onDelete: (id: string) => void;
}

export function UserTable({ users, role, isLoading, onEdit, onUpdate, onDelete }: UserTableProps) {
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

  if (isLoading) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Cargando usuarios...
      </div>
    );
  }

  if (users.length === 0) {
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
          {users.map((user) => (
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
                    onClick={() => onEdit(user)}
                    variant="ghost"
                    size="icon"
                    className="hover:text-primary"
                    title="Editar Permisos"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  {user.status !== 'banned' ? (
                    <Button
                      onClick={() => onUpdate(user.id, { status: 'banned' })}
                      variant="ghost"
                      size="icon"
                      className="hover:text-destructive text-destructive/70"
                      title="Banear Usuario"
                    >
                      <BanIcon className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onUpdate(user.id, { status: 'active' })}
                      variant="ghost"
                      size="icon"
                      className="hover:text-success text-success/70"
                      title="Reactivar Usuario"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => onDelete(user.id)}
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
}
