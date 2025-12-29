'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { Switch } from '@/components/ui/switch';
import { Settings as CogIcon, Paintbrush as PaintBrushIcon, ShieldCheck as ShieldCheckIcon, Bell as BellIcon, FileText as DocumentTextIcon, Eye as EyeIcon, Check as CheckIcon } from '@/lib/icons';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import AdminProtection from '@/components/admin/AdminProtection';
import { AnalyticsExclusion } from '@/components/admin/AnalyticsExclusion';

// Configuraciones por defecto
const defaultSettings = {
  general: {
    siteName: 'Mapas Conceptuales',
    siteDescription: 'Plataforma para crear y compartir mapas conceptuales',
    language: 'es',
    timezone: 'America/Mexico_City',
    maintenanceMode: false
  },
  appearance: {
    theme: 'light',
    primaryColor: '#3B82F6',
    logoUrl: '',
    favicon: '',
    customCSS: ''
  },
  security: {
    requireEmailVerification: true,
    passwordMinLength: 8,
    enableTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5
  },
  notifications: {
    emailNotifications: true,
    newUserNotifications: true,
    systemAlerts: true,
    weeklyReports: false,
    marketingEmails: false
  },
  content: {
    allowPublicMaps: true,
    requireModeration: false,
    maxMapsPerUser: 50,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'png', 'gif', 'pdf']
  },
  privacy: {
    showUserProfiles: true,
    allowSearchEngineIndexing: true,
    cookieConsent: true,
    dataRetentionDays: 365,
    anonymizeData: false
  }
};

function SettingSection({ title, icon: Icon, children }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, description }: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
      />
      {description && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, description }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
    </div>
  );
}

function ToggleField({ label, value, onChange, description }: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
      />
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  // Cargar configuraciones desde localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (section: string, key: string, value: string | number | boolean | string[]) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: CogIcon },
    { id: 'appearance', label: 'Apariencia', icon: PaintBrushIcon },
    { id: 'security', label: 'Seguridad', icon: ShieldCheckIcon },
    { id: 'notifications', label: 'Notificaciones', icon: BellIcon },
    { id: 'content', label: 'Contenido', icon: DocumentTextIcon },
    { id: 'privacy', label: 'Privacidad', icon: EyeIcon },
    { id: 'analytics', label: 'Analytics', icon: ShieldCheckIcon }
  ];

  return (
    <AdminProtection>
      <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Configuración del Sistema
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Personaliza y configura tu plataforma
            </p>
          </div>
          <Button
            onClick={handleSave}
            variant={saved ? 'success' : 'gradient'}
            className="rounded-lg"
          >
            {saved ? (
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-4 h-4" />
                <span>Guardado</span>
              </div>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant="ghost"
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors rounded-none h-auto hover:bg-transparent ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'general' && (
            <SettingSection title="Configuración General" icon={CogIcon}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Nombre del Sitio"
                  value={settings.general.siteName}
                  onChange={(value) => updateSetting('general', 'siteName', value)}
                  placeholder="Mapas Conceptuales"
                />
                <SelectField
                  label="Idioma"
                  value={settings.general.language}
                  onChange={(value) => updateSetting('general', 'language', value)}
                  options={[
                    { value: 'es', label: 'Español' },
                    { value: 'en', label: 'English' },
                    { value: 'fr', label: 'Français' }
                  ]}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Descripción del Sitio"
                    value={settings.general.siteDescription}
                    onChange={(value) => updateSetting('general', 'siteDescription', value)}
                    placeholder="Descripción de tu plataforma"
                  />
                </div>
                <SelectField
                  label="Zona Horaria"
                  value={settings.general.timezone}
                  onChange={(value) => updateSetting('general', 'timezone', value)}
                  options={[
                    { value: 'America/Mexico_City', label: 'México (GMT-6)' },
                    { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
                    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' }
                  ]}
                />
                <div className="md:col-span-2">
                  <ToggleField
                    label="Modo Mantenimiento"
                    value={settings.general.maintenanceMode}
                    onChange={(value) => updateSetting('general', 'maintenanceMode', value)}
                    description="Activa el modo mantenimiento para realizar actualizaciones"
                  />
                </div>
              </div>
            </SettingSection>
          )}

          {activeTab === 'appearance' && (
            <SettingSection title="Configuración de Apariencia" icon={PaintBrushIcon}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Tema"
                  value={settings.appearance.theme}
                  onChange={(value) => updateSetting('appearance', 'theme', value)}
                  options={[
                    { value: 'light', label: 'Claro' },
                    { value: 'dark', label: 'Oscuro' },
                    { value: 'auto', label: 'Automático' }
                  ]}
                />
                <InputField
                  label="Color Primario"
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(value) => updateSetting('appearance', 'primaryColor', value)}
                />
                <InputField
                  label="URL del Logo"
                  value={settings.appearance.logoUrl}
                  onChange={(value) => updateSetting('appearance', 'logoUrl', value)}
                  placeholder="https://ejemplo.com/logo.png"
                />
                <InputField
                  label="URL del Favicon"
                  value={settings.appearance.favicon}
                  onChange={(value) => updateSetting('appearance', 'favicon', value)}
                  placeholder="https://ejemplo.com/favicon.ico"
                />
              </div>
            </SettingSection>
          )}

          {activeTab === 'security' && (
            <SettingSection title="Configuración de Seguridad" icon={ShieldCheckIcon}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Longitud Mínima de Contraseña"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(value) => updateSetting('security', 'passwordMinLength', value)}
                  />
                  <InputField
                    label="Tiempo de Sesión (horas)"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(value) => updateSetting('security', 'sessionTimeout', value)}
                  />
                  <InputField
                    label="Máximo Intentos de Login"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(value) => updateSetting('security', 'maxLoginAttempts', value)}
                  />
                </div>
                <div className="space-y-4">
                  <ToggleField
                    label="Verificación de Email Requerida"
                    value={settings.security.requireEmailVerification}
                    onChange={(value) => updateSetting('security', 'requireEmailVerification', value)}
                    description="Los usuarios deben verificar su email antes de acceder"
                  />
                  <ToggleField
                    label="Autenticación de Dos Factores"
                    value={settings.security.enableTwoFactor}
                    onChange={(value) => updateSetting('security', 'enableTwoFactor', value)}
                    description="Permite a los usuarios habilitar 2FA en sus cuentas"
                  />
                </div>
              </div>
            </SettingSection>
          )}

          {activeTab === 'notifications' && (
            <SettingSection title="Configuración de Notificaciones" icon={BellIcon}>
              <div className="space-y-4">
                <ToggleField
                  label="Notificaciones por Email"
                  value={settings.notifications.emailNotifications}
                  onChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
                  description="Enviar notificaciones importantes por email"
                />
                <ToggleField
                  label="Notificar Nuevos Usuarios"
                  value={settings.notifications.newUserNotifications}
                  onChange={(value) => updateSetting('notifications', 'newUserNotifications', value)}
                  description="Recibir notificación cuando se registre un nuevo usuario"
                />
                <ToggleField
                  label="Alertas del Sistema"
                  value={settings.notifications.systemAlerts}
                  onChange={(value) => updateSetting('notifications', 'systemAlerts', value)}
                  description="Notificaciones sobre el estado del sistema"
                />
                <ToggleField
                  label="Reportes Semanales"
                  value={settings.notifications.weeklyReports}
                  onChange={(value) => updateSetting('notifications', 'weeklyReports', value)}
                  description="Recibir resumen semanal de actividad"
                />
                <ToggleField
                  label="Emails de Marketing"
                  value={settings.notifications.marketingEmails}
                  onChange={(value) => updateSetting('notifications', 'marketingEmails', value)}
                  description="Enviar emails promocionales a los usuarios"
                />
              </div>
            </SettingSection>
          )}

          {activeTab === 'content' && (
            <SettingSection title="Configuración de Contenido" icon={DocumentTextIcon}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Máximo Mapas por Usuario"
                    type="number"
                    value={settings.content.maxMapsPerUser}
                    onChange={(value) => updateSetting('content', 'maxMapsPerUser', value)}
                  />
                  <InputField
                    label="Tamaño Máximo de Archivo (MB)"
                    type="number"
                    value={settings.content.maxFileSize}
                    onChange={(value) => updateSetting('content', 'maxFileSize', value)}
                  />
                </div>
                <div className="space-y-4">
                  <ToggleField
                    label="Permitir Mapas Públicos"
                    value={settings.content.allowPublicMaps}
                    onChange={(value) => updateSetting('content', 'allowPublicMaps', value)}
                    description="Los usuarios pueden hacer sus mapas públicos"
                  />
                  <ToggleField
                    label="Moderación Requerida"
                    value={settings.content.requireModeration}
                    onChange={(value) => updateSetting('content', 'requireModeration', value)}
                    description="Los mapas públicos requieren aprobación antes de publicarse"
                  />
                </div>
              </div>
            </SettingSection>
          )}

          {activeTab === 'privacy' && (
            <SettingSection title="Configuración de Privacidad" icon={EyeIcon}>
              <div className="space-y-6">
                <InputField
                  label="Días de Retención de Datos"
                  type="number"
                  value={settings.privacy.dataRetentionDays}
                  onChange={(value) => updateSetting('privacy', 'dataRetentionDays', value)}
                  description="Tiempo que se conservan los datos de usuarios inactivos"
                />
                <div className="space-y-4">
                  <ToggleField
                    label="Mostrar Perfiles de Usuario"
                    value={settings.privacy.showUserProfiles}
                    onChange={(value) => updateSetting('privacy', 'showUserProfiles', value)}
                    description="Los perfiles de usuario son visibles públicamente"
                  />
                  <ToggleField
                    label="Permitir Indexación de Motores de Búsqueda"
                    value={settings.privacy.allowSearchEngineIndexing}
                    onChange={(value) => updateSetting('privacy', 'allowSearchEngineIndexing', value)}
                    description="Google y otros motores pueden indexar el contenido público"
                  />
                  <ToggleField
                    label="Consentimiento de Cookies"
                    value={settings.privacy.cookieConsent}
                    onChange={(value) => updateSetting('privacy', 'cookieConsent', value)}
                    description="Mostrar banner de consentimiento de cookies"
                  />
                  <ToggleField
                    label="Anonimizar Datos"
                    value={settings.privacy.anonymizeData}
                    onChange={(value) => updateSetting('privacy', 'anonymizeData', value)}
                    description="Anonimizar datos personales en reportes y estadísticas"
                  />
                </div>
              </div>
            </SettingSection>
          )}

          {activeTab === 'analytics' && (
            <SettingSection title="Exclusión de Analytics" icon={ShieldCheckIcon}>
              <div className="space-y-6">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Esta herramienta te permite evitar que tus visitas desde este dispositivo sean contadas en Google Analytics. 
                  Es útil para administradores y desarrolladores para mantener limpias las estadísticas.
                </p>
                <AnalyticsExclusion />
              </div>
            </SettingSection>
          )}
        </div>
        </div>
      </AdminLayout>
    </AdminProtection>
  );
}