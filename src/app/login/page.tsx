'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useB2B } from '../../contexts/B2BContext';
import { useToast } from '../../components/ui/ToastManager';
import { Button } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'normal' | 'empresarial'>('normal');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [b2bPassword, setB2bPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, isLoading } = useAuth();
  const { loginB2B, isB2BUser } = useB2B();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/protegido');
    }
  }, [isAuthenticated, isLoading, router]);

  // Redirigir si ya está autenticado como B2B (solo después de login exitoso)
  useEffect(() => {
    if (isB2BUser && activeTab === 'empresarial') {
      router.push('/portal-empresarial');
    }
  }, [isB2BUser, router, activeTab]);

  const handleNormalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      
      if (success) {
        showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
        router.push('/protegido');
      } else {
        setError('Credenciales incorrectas.');
        showError('Error de autenticación', 'Las credenciales proporcionadas no son válidas');
      }
    } catch (err) {
      setError('Error durante el inicio de sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleB2BSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await loginB2B(email, b2bPassword);
      showSuccess('¡Bienvenido!', 'Has iniciado sesión en el Portal Empresarial');
      router.push('/portal-empresarial');
    } catch (err) {
      console.error('Error en login B2B:', err);
      setError('Error durante el inicio de sesión empresarial. Por favor, intente nuevamente.');
      showError('Error de autenticación', 'Ocurrió un problema al procesar su solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading si está verificando autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4 pt-20">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Accede a tu cuenta de DDreams 3D
          </p>
        </div>

        <div className={cn("rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden", colors.backgrounds.card)}>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'normal' | 'empresarial')} className="w-full">
            <TabsList className="flex border-b border-neutral-200 dark:border-neutral-700 bg-transparent p-0 w-full h-auto rounded-none">
              <TabsTrigger
                value="normal"
                className="flex-1 py-4 px-6 text-sm font-medium rounded-t-xl rounded-b-none h-auto transition-all duration-300 data-[state=active]:bg-primary-50 dark:data-[state=active]:bg-primary-900/10 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 dark:data-[state=active]:border-primary-400 data-[state=active]:shadow-none bg-transparent text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Cuenta Personal
              </TabsTrigger>
              <TabsTrigger
                value="empresarial"
                className="flex-1 py-4 px-6 text-sm font-medium rounded-t-xl rounded-b-none h-auto transition-all duration-300 data-[state=active]:bg-primary-50 dark:data-[state=active]:bg-primary-900/10 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 dark:data-[state=active]:border-primary-400 data-[state=active]:shadow-none bg-transparent text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Cuenta Empresarial
              </TabsTrigger>
            </TabsList>

            <div className="p-8">
              <TabsContent value="normal" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                <form onSubmit={handleNormalSubmit} className="space-y-6">
                  <div>
                    <label 
                      htmlFor="username" 
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Usuario
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      placeholder="Ingresa tu usuario"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="password" 
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      placeholder="Ingresa tu contraseña"
                      disabled={isSubmitting}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="gradient"
                    size="lg"
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Iniciando sesión...
                      </span>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-neutral-800 text-gray-500 dark:text-gray-400">O continúa con</span>
                    </div>
                  </div>

                  {/* Google Login Button */}
                  <GoogleLoginButton />
                </form>
              </TabsContent>

              <TabsContent value="empresarial" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                <form onSubmit={handleB2BSubmit} className="space-y-6">
                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Correo Electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      placeholder="empresa@ejemplo.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="b2bPassword" 
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Contraseña
                    </label>
                    <input
                      id="b2bPassword"
                      type="password"
                      value={b2bPassword}
                      onChange={(e) => setB2bPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      placeholder="Ingresa tu contraseña"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="gradient"
                    size="lg"
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Iniciando sesión...
                      </span>
                    ) : (
                      'Acceder al Portal Empresarial'
                    )}
                  </Button>

                  {error && (
                    <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Información importante:
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Ingresa cualquier correo y contraseña para acceder al demo del portal empresarial.
                    </p>
                  </div>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
