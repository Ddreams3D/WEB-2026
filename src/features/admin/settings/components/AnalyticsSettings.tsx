import React from 'react';
import { ShieldCheck as ShieldCheckIcon } from '@/lib/icons';
import { SettingSection } from './SettingSection';
import { ToggleField } from './SettingsFields';
import { AnalyticsExclusion } from '@/features/admin/components/AnalyticsExclusion';
import { AdminSettings } from '../hooks/useAdminSettings';

interface AnalyticsSettingsProps {
  settings: AdminSettings;
  updateSetting: (section: keyof AdminSettings, key: string, value: unknown) => void;
}

export function AnalyticsSettings({ settings, updateSetting }: AnalyticsSettingsProps) {
  return (
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
  );
}
