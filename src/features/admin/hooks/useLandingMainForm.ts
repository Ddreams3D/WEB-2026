import { useState, useEffect } from 'react';
import { LandingMainConfig } from '@/shared/types/landing';
import { fetchLandingMain, saveLandingMain } from '@/services/landing.service';
import { useToast } from '@/components/ui/ToastManager';

export function useLandingMainForm() {
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
    ctaLink: '/cotizaciones',
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
      try {
        const cfg = await fetchLandingMain();
        if (cfg) setForm(cfg);
      } catch {
        // Silent error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
      await saveLandingMain(targetConfig);
      // Update local state if we saved a passed config
      if (configToSave) {
        setForm(configToSave);
      }
      showSuccess('Landing principal guardada correctamente');
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
