'use client';

import { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Phone, 
  Mail,
  ChevronRight
} from '@/lib/icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/ToastManager';

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { showToast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  });

  const [language, setLanguage] = useState('es');

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      showToast('success', 'Configuración actualizada');
      return newState;
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    showToast('success', 'Idioma actualizado');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary-600" />
            Configuración
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Gestiona tus preferencias y configuración de la cuenta
          </p>
        </div>

        <div className="space-y-6">
          {/* Apariencia */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Moon className="h-5 w-5 text-neutral-500" />
                Apariencia
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Modo Oscuro</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Cambiar entre tema claro y oscuro
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    darkMode ? 'bg-primary-600' : 'bg-neutral-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-neutral-500" />
                Notificaciones
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-neutral-400" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">Correos electrónicos</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Recibir actualizaciones sobre tus pedidos
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('email')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.email ? 'bg-primary-600' : 'bg-neutral-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notifications.email ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-neutral-400" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">Notificaciones Push</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Recibir alertas en tu dispositivo
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('push')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.push ? 'bg-primary-600' : 'bg-neutral-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notifications.push ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Idioma y Región */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-neutral-500" />
                Idioma y Región
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Idioma</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Selecciona tu idioma preferido
                  </p>
                </div>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-neutral-500" />
                Seguridad
              </h2>
            </div>
            <div className="p-6">
              <button className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors group">
                <div className="text-left">
                  <p className="font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">Cambiar contraseña</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Actualiza tu contraseña para mantener tu cuenta segura
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-600" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
