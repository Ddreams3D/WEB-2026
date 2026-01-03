'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { Switch } from '@/components/ui/switch';
import { 
  Store as StoreIcon,
  Globe as GlobeIcon,
  CreditCard as CreditCardIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Mail as MailIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Linkedin as LinkedinIcon,
  // Alias manuales para iconos importados como componentes directos
  Settings as CogIcon,
  Paintbrush as PaintBrushIcon,
  ShieldCheck as ShieldCheckIcon,
  Check as CheckIcon,
  Bell as BellIcon,
  FileText as DocumentTextIcon,
  Eye as EyeIcon,
  Check,
  Calendar
} from '@/lib/icons';
import { AnalyticsExclusion } from '@/features/admin/components/AnalyticsExclusion';
import SeasonalManager from '@/features/admin/components/SeasonalManager';
import { useTheme, THEMES } from '@/contexts/ThemeContext';
import { THEME_CONFIG } from '@/config/themes';
import { cn } from '@/lib/utils';

// Configuraciones por defecto
const defaultSettings = {
  general: {
    siteName: 'Ddreams 3D',
    siteDescription: 'Tienda de impresión 3D y diseño',
    contactEmail: 'contacto@ddreams3d.com',
    contactPhone: '+51 999 888 777',
    address: 'Av. Principal 123, Arequipa, Perú',
  },
  social: {
    facebook: 'https://facebook.com/ddreams3d',
    instagram: 'https://instagram.com/ddreams3d',
    tiktok: 'https://tiktok.com/@ddreams3d'
  },
  store: {
    currency: 'PEN',
    currencySymbol: 'S/',
    taxRate: 18,
    enableReviews: true,
    productsPerPage: 12,
    lowStockThreshold: 5
  },
  payment: {
    yapeNumber: '999 888 777',
    yapeName: 'Ddreams 3D SAC',
    plinNumber: '999 888 777',
    bankInfo: 'BCP Soles: 123-12345678-0-12'
  },
  seo: {
    allowIndexing: true,
    googleAnalyticsId: '',
    facebookPixelId: ''
  }
};

function SettingSection({ title, icon: Icon, description, children }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary flex-shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, description, icon: Icon }: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 py-2.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/50",
            Icon && "pl-10"
          )}
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">
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
      <label className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-muted-foreground">
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
    <div className={cn(
      "flex items-start justify-between p-4 rounded-xl border transition-all duration-200",
      value 
        ? "bg-primary/5 border-primary/20" 
        : "bg-background border-border hover:border-muted-foreground/20"
    )}>
      <div className="flex-1 mr-4">
        <label className="block text-sm font-semibold text-foreground cursor-pointer" onClick={() => onChange(!value)}>
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
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
  const searchParams = useSearchParams();
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState(searchParams?.get('tab') || 'general');
  const [saved, setSaved] = useState(false);
  const { theme: currentTheme, setTheme } = useTheme();

  // Cargar configuraciones desde localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Deep merge para asegurar que nuevos campos tengan valor por defecto
        setSettings(prev => ({
          ...prev,
          ...parsed,
          general: { ...prev.general, ...parsed.general },
          social: { ...prev.social, ...parsed.social },
          store: { ...prev.store, ...parsed.store },
          payment: { ...prev.payment, ...parsed.payment },
          seo: { ...prev.seo, ...parsed.seo }
        }));
      } catch (e) {
        console.error('Error parsing settings', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (section: keyof typeof defaultSettings, key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General y Contacto', icon: CogIcon },
    { id: 'appearance', label: 'Apariencia', icon: PaintBrushIcon },
    { id: 'store', label: 'Tienda y Pagos', icon: StoreIcon },
    { id: 'analytics', label: 'Analytics', icon: ShieldCheckIcon },
    { id: 'seasonal', label: 'Temas Estacionales', icon: Calendar }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Configuración
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
            Personaliza la experiencia de tu tienda y administra la información vital.
          </p>
        </div>
        <Button 
          onClick={handleSave}
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          size="lg"
          disabled={saved}
        >
          {saved ? <CheckIcon className="w-5 h-5" /> : null}
          {saved ? 'Guardado Exitosamente' : 'Guardar Cambios'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de navegación */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <nav className="space-y-1 sticky top-8 bg-card p-2 rounded-xl border border-border shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="ml-auto bg-primary-foreground/20 w-1.5 h-1.5 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <SettingSection 
                title="Información del Negocio" 
                icon={GlobeIcon}
                description="Estos datos aparecerán en el pie de página y en la sección de contacto."
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Nombre del Sitio"
                      value={settings.general.siteName}
                      onChange={(v) => updateSetting('general', 'siteName', v)}
                      placeholder="Ej: Ddreams 3D"
                    />
                    <InputField
                      label="Descripción Corta"
                      value={settings.general.siteDescription}
                      onChange={(v) => updateSetting('general', 'siteDescription', v)}
                      placeholder="Tu slogan o descripción breve"
                    />
                  </div>
                  
                  <div className="border-t border-neutral-100 dark:border-neutral-700 pt-6">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">
                      Datos de Contacto
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Email de Contacto"
                        value={settings.general.contactEmail}
                        onChange={(v) => updateSetting('general', 'contactEmail', v)}
                        icon={MailIcon}
                      />
                      <InputField
                        label="Teléfono / WhatsApp"
                        value={settings.general.contactPhone}
                        onChange={(v) => updateSetting('general', 'contactPhone', v)}
                        icon={PhoneIcon}
                      />
                      <div className="md:col-span-2">
                        <InputField
                          label="Dirección Física"
                          value={settings.general.address}
                          onChange={(v) => updateSetting('general', 'address', v)}
                          icon={MapPinIcon}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SettingSection>

              <SettingSection 
                title="Redes Sociales" 
                icon={FacebookIcon}
                description="Enlaces a tus perfiles sociales para mostrar en la web."
              >
                <div className="grid grid-cols-1 gap-6">
                  <InputField
                    label="Facebook URL"
                    value={settings.social.facebook}
                    onChange={(v) => updateSetting('social', 'facebook', v)}
                    icon={FacebookIcon}
                    placeholder="https://facebook.com/..."
                  />
                  <InputField
                    label="Instagram URL"
                    value={settings.social.instagram}
                    onChange={(v) => updateSetting('social', 'instagram', v)}
                    icon={InstagramIcon}
                    placeholder="https://instagram.com/..."
                  />
                  <InputField
                    label="TikTok URL"
                    value={settings.social.tiktok}
                    onChange={(v) => updateSetting('social', 'tiktok', v)}
                    icon={GlobeIcon}
                    placeholder="https://tiktok.com/..."
                  />
                </div>
              </SettingSection>
            </div>
          )}

          {activeTab === 'appearance' && (
            <SettingSection 
              title="Apariencia y Temas" 
              icon={PaintBrushIcon}
              description="Personaliza la identidad visual de tu tienda."
            >
              <div className="space-y-8">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {THEMES.map((themeKey) => {
                    const config = THEME_CONFIG[themeKey];
                    const isActive = currentTheme === themeKey;
                    const Icon = config.icon;
                    // Extract the primary color class, handling hex codes if present in future or using bg- classes
                    const primaryColorClass = config.previewColors[0] || 'bg-primary-500';

                    return (
                      <button 
                        key={themeKey}
                        onClick={() => setTheme(themeKey)}
                        className={cn(
                          "relative group rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white dark:bg-neutral-800 text-left w-full flex flex-col h-full",
                          isActive 
                            ? "border-primary-500 shadow-xl ring-2 ring-primary-500/20 scale-[1.02]" 
                            : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg"
                        )}
                      >
                        {/* Mini UI Preview */}
                        <div className="h-40 relative bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden border-b border-neutral-100 dark:border-neutral-700">
                          {/* Simulated Navbar */}
                          <div className={cn("h-6 w-full flex items-center justify-between px-3 shadow-sm z-10 relative", primaryColorClass)}>
                             <div className="flex items-center space-x-1.5">
                               <div className="w-2 h-2 rounded-full bg-white/40" />
                               <div className="w-8 h-1.5 rounded-full bg-white/30" />
                             </div>
                             <div className="flex space-x-1">
                               <div className="w-4 h-1.5 rounded-full bg-white/20" />
                               <div className="w-4 h-1.5 rounded-full bg-white/20" />
                             </div>
                          </div>

                          {/* Simulated Hero Section */}
                          <div className="absolute inset-0 top-6 flex flex-col items-center justify-center p-4 space-y-3">
                             <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform duration-500", primaryColorClass)}>
                                <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                             </div>
                             
                             <div className="space-y-1.5 flex flex-col items-center w-full">
                               <div className="w-2/3 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                               <div className="w-1/2 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                             </div>
                             
                             {/* Simulated CTA Button */}
                             <div className={cn("mt-1 px-4 py-1.5 rounded-md text-[10px] text-white font-medium shadow-sm opacity-90", primaryColorClass)}>
                               Ver catálogo
                             </div>
                          </div>
                          
                          {/* Active Badge overlay */}
                          {isActive && (
                            <div className="absolute top-2 right-2 z-20 bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 p-1.5 rounded-full shadow-md border border-primary-100 dark:border-primary-900/30">
                              <CheckIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="mb-2">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {config.label}
                            </h3>
                          </div>
                          
                          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 line-clamp-2 flex-1">
                            {config.description}
                          </p>

                          {/* Color Palette Indicators */}
                          <div className="flex items-center space-x-1.5 pt-4 border-t border-neutral-100 dark:border-neutral-700/50 mt-auto">
                            <span className="text-xs text-neutral-400 mr-1">Paleta:</span>
                            {config.previewColors.map((color, i) => (
                              <div 
                                key={i} 
                                className={cn("w-4 h-4 rounded-full ring-1 ring-inset ring-black/5 dark:ring-white/10", color)}
                                title={`Color ${i + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Selection Indicator Bar */}
                        <div className={cn(
                          "h-1 w-full transition-all duration-300",
                          isActive ? "bg-primary-500" : "bg-transparent group-hover:bg-primary-200 dark:group-hover:bg-primary-800"
                        )} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </SettingSection>
          )}

          {activeTab === 'store' && (
            <div className="space-y-6">
              <SettingSection 
                title="Configuración de Tienda" 
                icon={StoreIcon}
                description="Ajustes generales del catálogo y experiencia de compra."
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                      label="Moneda"
                      value={settings.store.currency}
                      onChange={(v) => updateSetting('store', 'currency', v)}
                      options={[
                        { value: 'PEN', label: 'Soles (S/)' },
                        { value: 'USD', label: 'Dólares ($)' }
                      ]}
                    />
                    <InputField
                      label="Productos por página"
                      type="number"
                      value={settings.store.productsPerPage}
                      onChange={(v) => updateSetting('store', 'productsPerPage', v)}
                    />
                  </div>
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700">
                     <ToggleField
                        label="Permitir Reseñas de Clientes"
                        value={settings.store.enableReviews}
                        onChange={(v) => updateSetting('store', 'enableReviews', v)}
                        description="Habilita la sección de comentarios y valoraciones en los productos."
                      />
                  </div>
                </div>
              </SettingSection>

              <SettingSection 
                title="Métodos de Pago" 
                icon={CreditCardIcon}
                description="Información que se mostrará al cliente para realizar pagos manuales."
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Número Yape"
                      value={settings.payment.yapeNumber}
                      onChange={(v) => updateSetting('payment', 'yapeNumber', v)}
                      placeholder="999..."
                    />
                    <InputField
                      label="Titular Yape"
                      value={settings.payment.yapeName}
                      onChange={(v) => updateSetting('payment', 'yapeName', v)}
                      placeholder="Nombre del titular"
                    />
                    <InputField
                      label="Número Plin"
                      value={settings.payment.plinNumber}
                      onChange={(v) => updateSetting('payment', 'plinNumber', v)}
                      placeholder="999..."
                    />
                  </div>
                  <InputField
                    label="Información Bancaria Adicional"
                    value={settings.payment.bankInfo}
                    onChange={(v) => updateSetting('payment', 'bankInfo', v)}
                    placeholder="Banco, CCI, Titular..."
                  />
                </div>
              </SettingSection>
            </div>
          )}

          {activeTab === 'analytics' && (
             <SettingSection 
                title="Configuración de Analytics" 
                icon={ShieldCheckIcon}
                description="Gestiona la recopilación de datos y privacidad."
             >
               <div className="space-y-6">
                 <AnalyticsExclusion />
                 
                 <div className="pt-6 border-t border-neutral-100 dark:border-neutral-700">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">
                      SEO y Rastreo
                    </h4>
                    <ToggleField
                      label="Indexación en Buscadores"
                      value={settings.seo.allowIndexing}
                      onChange={(v) => updateSetting('seo', 'allowIndexing', v)}
                      description="Permitir que Google y otros motores de búsqueda muestren tu sitio."
                    />
                 </div>
               </div>
             </SettingSection>
          )}
          {activeTab === 'seasonal' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SeasonalManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
