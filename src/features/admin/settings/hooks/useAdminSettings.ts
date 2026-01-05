import { useState, useEffect } from 'react';

export const defaultSettings = {
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

export type AdminSettings = typeof defaultSettings;

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

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

  const updateSetting = (section: keyof AdminSettings, key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  return {
    settings,
    saved,
    handleSave,
    updateSetting
  };
}
