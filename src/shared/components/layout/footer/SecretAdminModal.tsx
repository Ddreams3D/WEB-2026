'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { Lock, X } from 'lucide-react';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecretAdminModal({ isOpen, onClose }: SecretAdminModalProps) {
  const [secretPassword, setSecretPassword] = useState('');
  const [secretError, setSecretError] = useState('');

  const handleSecretLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecretError('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: secretPassword }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('theme_secret_access', 'granted');
        window.location.href = '/admin/configuracion?tab=appearance';
      } else {
        setSecretError('Contraseña incorrecta');
      }
    } catch (error) {
      setSecretError('Error al verificar credenciales');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Acceso Administrativo</h3>
          <p className="text-neutral-400 text-sm mt-2">Ingresa la contraseña maestra para continuar</p>
        </div>

        <form onSubmit={handleSecretLogin} className="space-y-4">
          <div>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Contraseña del sistema"
              value={secretPassword}
              onChange={(e) => setSecretPassword(e.target.value)}
              className="bg-neutral-950 border-neutral-800 focus:border-primary text-white"
            />
            {secretError && (
              <p className="text-destructive text-xs mt-2">{secretError}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Acceder al Panel
          </Button>
        </form>
      </div>
    </div>
  );
}
