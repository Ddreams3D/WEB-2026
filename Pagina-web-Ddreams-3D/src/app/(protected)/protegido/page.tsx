'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui';
import { User, Shield, LogOut, Home } from '@/lib/icons';
import Link from 'next/link';

function ProtectedContent() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                Área Protegida
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
                <User className="h-4 w-4" />
                <span>Bienvenido, {user?.username}</span>
              </div>
              
              <Button
                asChild
                variant="outline"
                size="sm"
              >
                <Link
                  href="/"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Inicio
                </Link>
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
            <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            ¡Acceso Autorizado!
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Has accedido exitosamente al área protegida. Esta página solo es visible para usuarios autenticados.
          </p>
        </div>

        {/* User Info Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              Información de Usuario
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">ID de Usuario:</span>
                <span className="text-neutral-900 dark:text-white">{user?.id}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">Nombre de Usuario:</span>
                <span className="text-neutral-900 dark:text-white">{user?.username}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">Email:</span>
                <span className="text-neutral-900 dark:text-white">{user?.email}</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">Estado de Sesión:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Activa
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Demo */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Ruta Protegida
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Esta página está protegida por el componente ProtectedRoute que verifica la autenticación.
            </p>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Gestión de Estado
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              El estado de autenticación se mantiene usando React Context y localStorage.
            </p>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
              <LogOut className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Logout Seguro
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Al cerrar sesión, se limpian las credenciales y se redirige automáticamente.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex justify-center space-x-4">
          <Button
            asChild
            variant="outline"
            size="lg"
          >
            <Link
              href="/"
            >
              <Home className="h-5 w-5 mr-2" />
              Volver al Inicio
            </Link>
          </Button>
          
          <Button
            asChild
            variant="gradient"
            size="lg"
          >
            <Link
              href="/logout"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <ProtectedContent />
    </ProtectedRoute>
  );
}