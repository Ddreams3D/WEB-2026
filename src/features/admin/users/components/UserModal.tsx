import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, UserRole, UserStatus } from '@/shared/types/domain';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<User>) => Promise<void>;
  defaultRole?: UserRole;
}

export function UserModal({ user, isOpen, onClose, onSave, defaultRole = 'user' }: UserModalProps) {
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
    if (!user) return; // Currently only editing is supported via modal for existing users

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
