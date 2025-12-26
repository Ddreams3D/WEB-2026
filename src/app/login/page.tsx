'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useB2B } from '../../contexts/B2BContext';
import { useToast } from '../../components/ui/ToastManager';
import { getButtonClasses } from '../../shared/styles/buttons';
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

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
          {/* Pestañas */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => setActiveTab('normal')}
              className={`flex-1 py-4 px-6 text-sm font-medium rounded-t-xl transition-colors ${
                activeTab === 'normal'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              Cuenta Personal
            </button>
            {/* 
            <button
              type="button"
              onClick={() => setActiveTab('empresarial')}
              className={`flex-1 py-4 px-6 text-sm font-medium rounded-t-xl transition-colors ${
                activeTab === 'empresarial'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              Cuenta Empresarial
            </button>
            */}
          </div>

          <div className="p-8">
            {activeTab === 'normal' ? (
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${getButtonClasses('primary', 'lg')} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Iniciando sesión...
                    </span>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>

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
            ) : (
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${getButtonClasses('primary', 'lg')} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Iniciando sesión...
                    </span>
                  ) : (
                    'Acceder al Portal Empresarial'
                  )}
                </button>
              </form>
            )}

            {error && (
              <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {activeTab === 'empresarial' && (
              <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Información importante:
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Ingresa cualquier correo y contraseña para acceder al demo del portal empresarial.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
