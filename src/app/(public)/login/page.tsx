'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/ToastManager';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { isSuperAdmin } from '@/config/roles';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register, isAuthenticated, isLoading, user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    // Solo redirigir si ya estamos seguros del estado (isLoading = false)
    if (!isLoading && isAuthenticated) {
       router.replace('/');
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Login Flow
        const success = await login(username, password);
        
        if (success) {
          showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
          router.push('/');
        } else {
          setError('Credenciales incorrectas.');
          showError('Error de autenticación', 'Las credenciales proporcionadas no son válidas');
        }
      } else {
        // Register Flow
        const success = await register(username, password);
        
        if (success) {
          showSuccess('¡Cuenta creada!', 'Te has registrado correctamente. Por favor completa tu perfil.');
          router.push('/profile');
        }
      }
    } catch (err) {
      setError(isLogin ? 'Error durante el inicio de sesión' : 'Error durante el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    // Optional: Clear fields or keep them? Keeping them is usually friendlier if user misclicked.
  };

  // Mostrar loading si está verificando autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 pt-20">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Accede a tu cuenta de DDreams 3D' : 'Únete a nuestra comunidad'}
          </p>
        </div>

        <div className={cn("rounded-xl shadow-lg border border-border overflow-hidden p-8 bg-card")}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                {isLogin ? 'Usuario o Email' : 'Email'}
              </label>
              <input
                id="username"
                type={isLogin ? "text" : "email"}
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder-muted-foreground"
                placeholder={isLogin ? "Ingresa tu usuario o email" : "tucorreo@ejemplo.com"}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder-muted-foreground"
                placeholder={isLogin ? "Ingresa tu contraseña" : "Crea una contraseña segura"}
                disabled={isSubmitting}
                minLength={isLogin ? undefined : 6}
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres</p>
              )}
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="default"
              size="lg"
              className="w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                  {isLogin ? 'Iniciando sesión...' : 'Registrando...'}
                </span>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-primary hover:underline focus:outline-none"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">O continúa con</span>
              </div>
            </div>

            {/* Google Login Button */}
            <GoogleLoginButton />
          </form>
        </div>
      </div>
    </div>
  );
}
