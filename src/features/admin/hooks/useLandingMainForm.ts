import { useState, useEffect } from 'react';
import { LandingMainConfig } from '@/shared/types/landing';
import { fetchCityLanding, saveCityLanding } from '@/services/landing.service';
import { useToast } from '@/components/ui/ToastManager';

export function useLandingMainForm(cityId: string = 'main') {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  const [form, setForm] = useState<LandingMainConfig>({
    heroTitle: 'Impresión 3D en Arequipa',
    heroSubtitle: 'Prototipos, piezas y regalos personalizados',
    heroDescription: 'Calidad profesional con entrega rápida y asesoría experta.',
    heroImage: '',
    ctaText: 'Cotiza tu proyecto',
    ctaLink: '/contact',
    bubbleImages: [],
    announcement: {
        enabled: false,
        content: '',
        closable: true,
        bgColor: '',
        textColor: ''
    }
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const cfg = await fetchCityLanding(cityId);
        if (cfg) {
          setForm(cfg);
        } else {
          // If no config found (e.g. new city), reset to defaults appropriate for the city?
          // For now, keep the initial state but maybe adjust the title if it's Lima
          if (cityId === 'lima') {
            setForm(prev => ({
              ...prev,
              heroTitle: 'Impresión 3D en Lima',
              heroSubtitle: 'Prototipos y producción a escala',
            }));
          } else if (cityId === 'main') {
             // Reset to defaults if somehow main is missing, but usually it exists
             // Or keep current form state
          }
        }
      } catch {
        // Silent error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [cityId]);

  const updateField = (key: keyof LandingMainConfig, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateAnnouncement = (updates: Partial<any>) => {
    setForm(prev => ({
        ...prev,
        announcement: {
            enabled: false,
            content: '',
            closable: true,
            ...prev.announcement,
            ...updates
        }
    }));
  };

  const handleAddBubble = () => {
    setForm(prev => ({
        ...prev,
        bubbleImages: [...(prev.bubbleImages || []), '']
    }));
  };

  const handleRemoveBubble = (index: number) => {
    setForm(prev => ({
        ...prev,
        bubbleImages: (prev.bubbleImages || []).filter((_, i) => i !== index)
    }));
  };

  const handleUpdateBubble = (index: number, value: string) => {
    setForm(prev => {
        const newBubbles = [...(prev.bubbleImages || [])];
        newBubbles[index] = value;
        return { ...prev, bubbleImages: newBubbles };
    });
  };

  const handleSave = async (configToSave?: LandingMainConfig) => {
    try {
      setSaving(true);
      const targetConfig = configToSave || form;
      await saveCityLanding(cityId, targetConfig);
      // Update local state if we saved a passed config
      if (configToSave) {
        setForm(configToSave);
      }
      showSuccess(`Landing ${cityId === 'main' ? 'Arequipa' : 'Lima'} guardada correctamente`);
      setIsEditing(false);
    } catch (error: any) {
      showError(error.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    loading,
    saving,
    isEditing,
    previewMode,
    setIsEditing,
    setPreviewMode,
    updateField,
    updateAnnouncement,
    handleAddBubble,
    handleRemoveBubble,
    handleUpdateBubble,
    handleSave
  };
}
