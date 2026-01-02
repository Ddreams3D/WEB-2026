'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/ToastManager';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun,
  Laptop,
  Mail,
  Smartphone,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      showSuccess('Configuración actualizada', 'Tus preferencias de notificación han sido guardadas.');
      return newState;
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    showSuccess('Idioma actualizado', 'El idioma de la interfaz ha cambiado.');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container max-w-6xl py-10 space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Navigation Card */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="border-border/50 shadow-md sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración
              </CardTitle>
              <CardDescription>
                Gestiona tus preferencias generales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start font-medium hover:bg-secondary/50"
                onClick={() => scrollToSection('appearance')}
              >
                <Moon className="mr-2 h-4 w-4" />
                Apariencia
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start font-medium hover:bg-secondary/50"
                onClick={() => scrollToSection('notifications')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notificaciones
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start font-medium hover:bg-secondary/50"
                onClick={() => scrollToSection('language')}
              >
                <Globe className="mr-2 h-4 w-4" />
                Idioma
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start font-medium hover:bg-secondary/50"
                onClick={() => scrollToSection('privacy')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Privacidad
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start font-medium hover:bg-secondary/50"
                onClick={() => scrollToSection('security')}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Seguridad
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 space-y-6">
          
          {/* Appearance Section */}
          <Card id="appearance" className="border-border/50 shadow-md scroll-mt-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <CardTitle>Apariencia</CardTitle>
                  <CardDescription>Personaliza cómo se ve Ddreams 3D en tu dispositivo.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="space-y-0.5">
                  <Label className="text-base">Modo Oscuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajusta el tema para reducir la fatiga visual.
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card id="notifications" className="border-border/50 shadow-md scroll-mt-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>Elige cómo quieres que nos comuniquemos contigo.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Correos Electrónicos</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe actualizaciones sobre tus pedidos y cuenta.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={() => handleNotificationChange('email')}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Notificaciones Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe alertas en tiempo real en tu navegador.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={() => handleNotificationChange('push')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card id="language" className="border-border/50 shadow-md scroll-mt-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Idioma y Región</CardTitle>
                  <CardDescription>Selecciona tu idioma preferido para la interfaz.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="space-y-0.5">
                  <Label className="text-base">Idioma</Label>
                  <p className="text-sm text-muted-foreground">
                    Este será el idioma predeterminado.
                  </p>
                </div>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Section */}
          <Card id="privacy" className="border-border/50 shadow-md scroll-mt-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Privacidad</CardTitle>
                  <CardDescription>Controla quién puede ver tu perfil y datos.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="space-y-0.5">
                  <Label className="text-base">Perfil Público</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que otros usuarios vean tu información básica.
                  </p>
                </div>
                <Switch
                  checked={true}
                  onCheckedChange={(checked) => showSuccess('Privacidad actualizada', checked ? 'Tu perfil ahora es público.' : 'Tu perfil ahora es privado.')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card id="security" className="border-border/50 shadow-md scroll-mt-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>Mantén tu cuenta segura.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-between h-auto py-4 px-4 hover:bg-accent hover:text-accent-foreground group"
                onClick={() => showSuccess('Redirigiendo', 'Te enviaremos un correo para restablecer tu contraseña.')}
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="font-medium">Cambiar Contraseña</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Se enviará un enlace a tu correo electrónico.
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
