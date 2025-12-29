'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { showSuccess } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  });

  const [language, setLanguage] = useState('es');

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      showSuccess('Configuración actualizada');
      return newState;
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    showSuccess('Idioma actualizado');
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Configuración
          </h1>
          <p className="mt-2 text-muted-foreground">
            Gestiona tus preferencias y configuración de la cuenta
          </p>
        </div>

        <div className="space-y-6">
          {/* Apariencia */}
          <div className={cn("rounded-lg shadow-sm overflow-hidden bg-card border border-border")}>
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Moon className="h-5 w-5 text-muted-foreground" />
                Apariencia
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Modo Oscuro</p>
                  <p className="text-sm text-muted-foreground">
                    Cambiar entre tema claro y oscuro
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                Notificaciones
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Correos electrónicos</p>
                    <p className="text-sm text-muted-foreground">
                      Recibir actualizaciones sobre tus pedidos
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={() => handleNotificationChange('email')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Notificaciones Push</p>
                    <p className="text-sm text-muted-foreground">
                      Recibir alertas en tu dispositivo
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={() => handleNotificationChange('push')}
                />
              </div>
            </div>
          </div>

          {/* Idioma y Región */}
          <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                Idioma y Región
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Idioma</p>
                  <p className="text-sm text-muted-foreground">
                    Selecciona tu idioma preferido
                  </p>
                </div>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[180px] bg-background border-input text-foreground">
                    <SelectValue placeholder="Selecciona idioma" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="es" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">Español</SelectItem>
                    <SelectItem value="en" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">English</SelectItem>
                    <SelectItem value="pt" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className={cn("rounded-lg shadow-sm overflow-hidden bg-card border border-border")}>
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                Seguridad
              </h2>
            </div>
            <div className="p-6">
              <Button
                variant="secondary"
                className="w-full h-auto flex items-center justify-between p-4 group"
              >
                <div className="text-left">
                  <p className="font-medium text-foreground group-hover:text-primary">Cambiar contraseña</p>
                  <p className="text-sm text-muted-foreground font-normal normal-case">
                    Actualiza tu contraseña para mantener tu cuenta segura
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
