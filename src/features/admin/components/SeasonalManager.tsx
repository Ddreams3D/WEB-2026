'use client';

import { useState, useEffect } from 'react';
import { SeasonalThemeConfig, DateRange } from '@/shared/types/seasonal';
import { updateSeasonalThemesAction, fetchSeasonalThemesAction } from '@/actions/seasonal-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Save, Plus, Trash2, AlertTriangle, CheckCircle } from '@/lib/icons';
import { useToast } from '@/components/ui/ToastManager';

export default function SeasonalManager() {
  const [themes, setThemes] = useState<SeasonalThemeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    async function loadThemes() {
      try {
        setLoading(true);
        const data = await fetchSeasonalThemesAction();
        setThemes(data);
      } catch (error) {
        showError('Error al cargar temas');
      } finally {
        setLoading(false);
      }
    }
    loadThemes();
  }, [showError]);

  async function handleSave() {
    try {
      setSaving(true);
      await updateSeasonalThemesAction(themes);
      showSuccess('Configuración guardada correctamente');
    } catch (error) {
      showError('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  }

  const updateTheme = (themeId: string, updates: Partial<SeasonalThemeConfig>) => {
    setThemes(prev => prev.map(t => t.id === themeId ? { ...t, ...updates } : t));
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

  if (loading) return <div>Cargando configuración...</div>;

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Configuración de Temas</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona las fechas de activación automática.
            <span className="block text-blue-500 text-xs mt-1">☁️ Sincronizado con Firestore</span>
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="default">
          {saving ? <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Cambios
        </Button>
      </div>

      <div className="grid gap-6">
        {themes.map(theme => (
          <Card key={theme.id} className={`transition-all ${theme.isActive ? 'border-primary ring-1 ring-primary' : ''}`}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {theme.name}
                    {theme.isActive && <Badge variant="default" className="text-xs">Forzado Activo</Badge>}
                  </CardTitle>
                  <CardDescription>ID: {theme.id} • Tag: {theme.landing.featuredTag}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Forzar Activación</span>
                  <Switch 
                    checked={theme.isActive || false}
                    onCheckedChange={(checked) => updateTheme(theme.id, { isActive: checked })}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Rangos de Fechas
                </div>
                
                {theme.dateRanges.map((range, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg border border-border/50">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-12">Inicio:</span>
                        <select 
                          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                          value={range.start.month}
                          onChange={(e) => updateDateRange(theme.id, idx, 'start', 'month', parseInt(e.target.value))}
                        >
                          {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{new Date(2000, m-1, 1).toLocaleString('es', {month: 'long'})}</option>
                          ))}
                        </select>
                        <input 
                          type="number" 
                          min="1" 
                          max="31" 
                          className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
                          value={range.start.day}
                          onChange={(e) => updateDateRange(theme.id, idx, 'start', 'day', parseInt(e.target.value))}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-12">Fin:</span>
                        <select 
                          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                          value={range.end.month}
                          onChange={(e) => updateDateRange(theme.id, idx, 'end', 'month', parseInt(e.target.value))}
                        >
                          {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{new Date(2000, m-1, 1).toLocaleString('es', {month: 'long'})}</option>
                          ))}
                        </select>
                        <input 
                          type="number" 
                          min="1" 
                          max="31" 
                          className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
                          value={range.end.day}
                          onChange={(e) => updateDateRange(theme.id, idx, 'end', 'day', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeDateRange(theme.id, idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => addDateRange(theme.id)}>
                  <Plus className="mr-2 h-3 w-3" />
                  Agregar Rango de Fechas
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
