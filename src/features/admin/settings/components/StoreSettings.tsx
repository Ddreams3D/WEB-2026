import React from 'react';
import { 
  Store as StoreIcon,
  CreditCard as CreditCardIcon
} from '@/lib/icons';
import { SettingSection } from './SettingSection';
import { InputField, SelectField, ToggleField } from './SettingsFields';
import { AdminSettings } from '../hooks/useAdminSettings';

interface StoreSettingsProps {
  settings: AdminSettings;
  updateSetting: (section: keyof AdminSettings, key: string, value: unknown) => void;
}

export function StoreSettings({ settings, updateSetting }: StoreSettingsProps) {
  return (
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
  );
}
