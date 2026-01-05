import React from 'react';
import { 
  Settings as CogIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Globe as GlobeIcon
} from '@/lib/icons';
import { SettingSection } from './SettingSection';
import { InputField } from './SettingsFields';
import { AdminSettings } from '../hooks/useAdminSettings';

interface GeneralSettingsProps {
  settings: AdminSettings;
  updateSetting: (section: keyof AdminSettings, key: string, value: unknown) => void;
}

export function GeneralSettings({ settings, updateSetting }: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <SettingSection 
        title="Información del Negocio" 
        icon={CogIcon}
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
  );
}
