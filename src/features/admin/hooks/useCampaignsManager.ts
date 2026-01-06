import { useState, useEffect } from 'react';
import { AnnouncementBarConfig } from '@/shared/types/landing';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { fetchSeasonalThemesAction, revalidateSeasonalCacheAction } from '@/actions/seasonal-actions';
import { saveSeasonalThemes } from '@/lib/seasonal-service';
import { useToast } from '@/components/ui/ToastManager';

export function useCampaignsManager() {
  const [themes, setThemes] = useState<SeasonalThemeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    async function loadThemes() {
      try {
        setLoading(true);
        const data = await fetchSeasonalThemesAction();
        
        // Orden personalizado solicitado: San Valentín -> Madre -> Patrias -> Halloween -> Navidad
        const ORDER = ['san-valentin', 'dia-de-la-madre', 'fiestas-patrias', 'halloween', 'christmas'];
        
        const sortedData = [...data].sort((a, b) => {
          const idxA = ORDER.indexOf(a.id);
          const idxB = ORDER.indexOf(b.id);
          
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        });

        setThemes(sortedData);
      } catch (error) {
        showError('Error al cargar campañas');
      } finally {
        setLoading(false);
      }
    }
    loadThemes();
  }, [showError]);

  async function handleSave(updatedTheme?: SeasonalThemeConfig) {
    try {
      setSaving(true);
      
      let themesToSave = themes;
      if (updatedTheme) {
        themesToSave = themes.map(t => t.id === updatedTheme.id ? updatedTheme : t);
        // Also update local state to reflect the change immediately
        setThemes(themesToSave);
      }

      // Save directly from client to use browser auth (Admin)
      await saveSeasonalThemes(themesToSave);
      // Revalidate cache on server
      await revalidateSeasonalCacheAction();
      
      showSuccess('Cambios guardados correctamente');
      setEditingId(null);
    } catch (error: any) {
      console.error('Save error:', error);
      showError(error.message || 'Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  }

  const updateTheme = (themeId: string, updates: Partial<SeasonalThemeConfig>) => {
    setThemes(prev => prev.map(t => t.id === themeId ? { ...t, ...updates } : t));
  };

  const updateLanding = (themeId: string, updates: Partial<SeasonalThemeConfig['landing']>) => {
    setThemes(prev => prev.map(t => t.id === themeId ? { 
      ...t, 
      landing: { ...t.landing, ...updates } 
    } : t));
  };

  const updateAnnouncement = (themeId: string, updates: Partial<AnnouncementBarConfig>) => {
    setThemes(prev => prev.map(t => t.id === themeId ? { 
      ...t, 
      announcement: { 
        enabled: false,
        content: '',
        closable: true,
        ...t.announcement, 
        ...updates 
      } 
    } : t));
  };

  const updateDateRange = (themeId: string, index: number, field: 'start' | 'end', subField: 'month' | 'day', value: number) => {
    setThemes(prev => prev.map(t => {
      if (t.id !== themeId) return t;
      const newRanges = [...t.dateRanges];
      newRanges[index] = {
        ...newRanges[index],
        [field]: {
          ...newRanges[index][field],
          [subField]: value
        }
      };
      return { ...t, dateRanges: newRanges };
    }));
  };

  const addDateRange = (themeId: string) => {
    setThemes(prev => prev.map(t => {
      if (t.id !== themeId) return t;
      return {
        ...t,
        dateRanges: [...t.dateRanges, { start: { month: 1, day: 1 }, end: { month: 1, day: 1 } }]
      };
    }));
  };

  const removeDateRange = (themeId: string, index: number) => {
    setThemes(prev => prev.map(t => {
      if (t.id !== themeId) return t;
      return {
        ...t,
        dateRanges: t.dateRanges.filter((_, i) => i !== index)
      };
    }));
  };

  return {
    themes,
    loading,
    saving,
    editingId,
    setEditingId,
    handleSave,
    updateTheme,
    updateLanding,
    updateAnnouncement,
    updateDateRange,
    addDateRange,
    removeDateRange
  };
}
