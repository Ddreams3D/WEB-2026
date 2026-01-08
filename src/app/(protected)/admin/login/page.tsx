'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/ToastManager';
import { ShieldCheck, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess('Acceso Autorizado', 'Bienvenido al panel de administración');
        // Forzar recarga completa para asegurar que la cookie se detecte
        window.location.href = '/admin';
      } else {
        showError('Acceso Denegado', data.message || 'Contraseña incorrecta');
      }
    } catch (error) {
      showError('Error de Sistema', 'No se pudo conectar con el servidor de autenticación');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription>
              Introduce la llave maestra para acceder al sistema
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña Maestra</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full font-semibold" 
              size="lg"
              disabled={isLoading || !password}
            >
              {isLoading ? 'Verificando Credenciales...' : 'Acceder al Sistema'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Acceso monitoreado y registrado por seguridad.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
