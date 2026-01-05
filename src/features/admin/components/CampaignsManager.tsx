'use client';

import { useState, useEffect } from 'react';
import { AnnouncementBarConfig } from '@/shared/types/landing';
import { SeasonalThemeConfig, DateRange } from '@/shared/types/seasonal';
import { fetchSeasonalThemesAction, revalidateSeasonalCacheAction } from '@/actions/seasonal-actions';
import { saveSeasonalThemes } from '@/lib/seasonal-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Save, Plus, Trash2, Edit, X, ChevronDown, ChevronUp, Camera, ExternalLink, Check } from '@/lib/icons';
import { useToast } from '@/components/ui/ToastManager';
import { cn } from '@/lib/utils';
import SeasonalLanding from '@/features/seasonal/components/SeasonalLanding';
import { THEMES } from '@/contexts/ThemeContext';
import { THEME_CONFIG } from '@/config/themes';
import { Sheet } from '@/components/ui/simple-sheet';
import { ArrowRight, Sparkles, Heart, Gift, Ghost, Skull, Smile, Moon, Sun, Laptop } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Helper para nombres de meses
const MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export default function CampaignsManager() {
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

  async function handleSave() {
    try {
      setSaving(true);
      // Save directly from client to use browser auth (Admin)
      await saveSeasonalThemes(themes);
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

  // --- Visual Timeline Components ---

  const getLeftPercent = (month: number, day: number) => {
    // Aprox: (Month-1)/12 + (Day/31)/12
    return ((month - 1) / 12 * 100) + ((day / 31) / 12 * 100);
  };

  const getWidthPercent = (start: {month: number, day: number}, end: {month: number, day: number}) => {
    let startP = getLeftPercent(start.month, start.day);
    let endP = getLeftPercent(end.month, end.day);
    
    if (endP < startP) {
      // Crosses year boundary (e.g. Dec to Jan)
      return 100 - startP; 
    }
    return endP - startP;
  };

  // Calculate Today's position
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const todayPercent = getLeftPercent(currentMonth, currentDay);

  // Helper para verificar si una campaña está activa por fecha
  const isDateActive = (ranges: DateRange[]) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const current = currentMonth * 100 + currentDay;

    return ranges.some(range => {
      const start = range.start.month * 100 + range.start.day;
      const end = range.end.month * 100 + range.end.day;

      if (start <= end) {
        return current >= start && current <= end;
      } else {
        // Cruza año (ej: Dic a Ene)
        return current >= start || current <= end;
      }
    });
  };

  const getThemeStatus = (theme: SeasonalThemeConfig) => {
    if (theme.isActive) return 'manual'; // Forzado manual
    if (isDateActive(theme.dateRanges)) return 'auto'; // Activo por fecha
    return 'inactive';
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const editingTheme = themes.find(t => t.id === editingId);

  return (
    <div className="space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Calendario de Campañas
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona la visibilidad y contenido de las campañas estacionales.
          </p>
        </div>
        <div className="flex gap-2 relative">
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="hover:bg-muted">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="min-w-[140px] shadow-md hover:shadow-lg transition-all">
            {saving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Todo
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Visual Calendar - Redesigned */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/30 flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            Línea de Tiempo Anual
          </h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
               <span>Activa (Manual)</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-blue-500" />
               <span>Vigente (Fecha)</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
               <span>Inactiva</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-0.5 h-3 bg-red-500" />
               <span>Hoy</span>
             </div>
          </div>
        </div>
        
        <div className="p-6 overflow-x-auto custom-scrollbar">
          <div className="min-w-[900px] relative">
            {/* Months Header */}
            <div className="grid grid-cols-12 gap-0 mb-6 text-center border-b border-border/50 pb-2">
              {MONTHS.map(m => (
                <div key={m} className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">{m}</div>
              ))}
            </div>

            {/* Timeline Rows */}
            <div className="space-y-4 relative pb-2">
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-12 pointer-events-none h-full w-full -z-10">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="border-l border-dashed border-border/40 h-full last:border-r" />
                ))}
              </div>

              {/* Today Indicator */}
              <div 
                className="absolute top-[-40px] bottom-0 w-px bg-red-500/50 z-[15] pointer-events-none flex flex-col items-center"
                style={{ left: `${todayPercent}%` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mb-auto shadow-sm" />
              </div>

              {themes.map(theme => (
                <div key={theme.id} className="relative h-12 flex items-center group/row hover:bg-muted/30 rounded-lg transition-colors -mx-2 px-2">
                  {/* Label */}
                  <div className="absolute -left-4 w-0 md:static md:w-32 text-right text-sm font-medium truncate pr-4 text-muted-foreground group-hover/row:text-foreground transition-colors">
                    {theme.name}
                  </div>

                  {/* Track */}
                  <div className="w-full h-2 bg-muted/30 rounded-full relative overflow-visible">
                     {theme.dateRanges.map((range, idx) => {
                       const left = getLeftPercent(range.start.month, range.start.day);
                       const width = getWidthPercent(range.start, range.end);
                       const status = getThemeStatus(theme);
                       
                       return (
                         <div 
                           key={idx}
                           className={cn(
                             "absolute h-5 -top-1.5 rounded-full shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-105 z-10 flex items-center justify-center min-w-[10px]",
                             status === 'manual' 
                               ? "bg-green-500 ring-2 ring-background text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]" 
                               : status === 'auto'
                                 ? "bg-blue-500 ring-2 ring-background text-white"
                                 : "bg-muted-foreground/40 hover:bg-muted-foreground/60",
                             editingId === theme.id ? "ring-2 ring-offset-2 ring-primary scale-105" : ""
                           )}
                           style={{ left: `${left}%`, width: `${width}%` }}
                           onClick={() => setEditingId(theme.id === editingId ? null : theme.id)}
                         >
                            {width > 8 && (
                                <span className="text-[10px] text-white font-bold px-2 truncate drop-shadow-sm select-none">
                                {theme.name}
                                </span>
                            )}
                         </div>
                       );
                     })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List (Grid View Redesigned) */}
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {themes.map(theme => (
          <div 
            key={theme.id} 
            className="group relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Browser Mockup Frame */}
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-xl bg-muted border-b">
                {/* Browser Header */}
                <div className="absolute top-0 left-0 right-0 h-7 bg-muted/90 backdrop-blur-sm border-b flex items-center px-3 gap-1.5 z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                    <div className="ml-2 flex-1 h-4 bg-background/50 rounded text-[9px] flex items-center px-2 text-muted-foreground/60">
                        ddreams3d.com/campanas/{theme.id}
                    </div>
                </div>

                {/* Content Preview */}
                <div 
                    className="w-[400%] h-[400%] absolute top-7 left-0 transform scale-[0.25] origin-top-left pointer-events-none select-none bg-background cursor-pointer"
                    onClick={() => setEditingId(theme.id)}
                >
                    <SeasonalLanding config={theme} />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        className="font-semibold shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        onClick={() => setEditingId(theme.id)}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                    </Button>
                    <a 
                        href={`/campanas/${theme.id}?preview=true`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-secondary text-secondary-foreground shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:bg-secondary/80"
                        title="Ver página real"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                {/* Status Badge */}
                {theme.isActive && (
                    <div className="absolute top-10 right-3 z-[10]">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                )}
            </div>
            
            {/* Card Content */}
            <div className="p-5 flex flex-col flex-1 gap-3">
              <div>
                  <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{theme.name}</h3>
                      {(() => {
                        const status = getThemeStatus(theme);
                        if (status === 'manual') return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-[10px] px-1.5 h-5">ACTIVO (M)</Badge>;
                        if (status === 'auto') return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-[10px] px-1.5 h-5">VIGENTE</Badge>;
                        return <Badge variant="outline" className="text-[10px] px-1.5 h-5 text-muted-foreground">INACTIVO</Badge>;
                      })()}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{theme.landing.heroTitle}</p>
              </div>

              <div className="mt-auto pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>
                      {theme.dateRanges.length > 0 
                        ? `${theme.dateRanges[0].start.day}/${theme.dateRanges[0].start.month} - ${theme.dateRanges[0].end.day}/${theme.dateRanges[0].end.month}`
                        : 'Sin fecha'}
                    </span>
                  </div>
                  <Badge variant="secondary" className="font-normal text-[10px]">{theme.landing.featuredTag || 'Campaña'}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Sheet */}
      <Sheet 
        isOpen={!!editingId} 
        onClose={() => setEditingId(null)} 
        title={editingTheme ? `Editar: ${editingTheme.name}` : 'Editar Campaña'}
        description={editingTheme ? `ID: ${editingTheme.id}` : ''}
        className="sm:max-w-xl md:max-w-2xl"
        underHeader={true}
      >
        {editingTheme && (
          <div className="space-y-8 pb-8">
            {/* Section 1: Activation & Theme */}
            <div className="space-y-6 border-b pb-6">
               <h3 className="font-semibold text-lg flex items-center gap-2">Configuración General</h3>
               
               <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base">Activación Manual</Label>
                    <p className="text-xs text-muted-foreground">Forzar la campaña visible ignorando fechas.</p>
                  </div>
                  <Switch 
                    checked={editingTheme.isActive || false}
                    onCheckedChange={(checked) => updateTheme(editingTheme.id, { isActive: checked })}
                  />
               </div>

               <div className="space-y-3">
                  <Label className="text-base block mb-2">Tema Visual</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {THEMES.map(tKey => {
                      const config = THEME_CONFIG[tKey];
                      const isSelected = editingTheme.themeId === tKey;
                      
                      return (
                        <div 
                          key={tKey}
                          onClick={() => updateTheme(editingTheme.id, { themeId: tKey })}
                          className={cn(
                            "relative flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50",
                            isSelected 
                              ? "border-primary bg-primary/5" 
                              : "border-transparent bg-card hover:border-muted-foreground/20"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                          
                          {/* Color Preview */}
                          <div className="flex gap-1 mb-2">
                            {config.previewColors.slice(0, 2).map((color, i) => (
                              <div key={i} className={cn("w-4 h-4 rounded-full shadow-sm ring-1 ring-black/5", color)} />
                            ))}
                          </div>
                          
                          <span className="text-xs font-medium text-center leading-tight">
                            {config.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>

            {/* Section 2: Dates */}
            <div className="space-y-6 border-b pb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Vigencia de Campaña
              </h3>
              
              <div className="space-y-3">
                {editingTheme.dateRanges.map((range, idx) => (
                  <div key={idx} className="bg-card border rounded-md p-3 space-y-3 relative group/date">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <span className="text-xs text-muted-foreground block mb-1">Inicio (Mes/Día)</span>
                           <div className="flex gap-2">
                             <Input 
                               type="number" min="1" max="12" 
                               value={range.start.month || ''}
                               onChange={(e) => updateDateRange(editingTheme.id, idx, 'start', 'month', parseInt(e.target.value))}
                               className="h-8 px-2"
                             />
                             <Input 
                               type="number" min="1" max="31" 
                               value={range.start.day || ''}
                               onChange={(e) => updateDateRange(editingTheme.id, idx, 'start', 'day', parseInt(e.target.value))}
                               className="h-8 px-2"
                             />
                           </div>
                        </div>
                        <div>
                           <span className="text-xs text-muted-foreground block mb-1">Fin (Mes/Día)</span>
                           <div className="flex gap-2">
                             <Input 
                               type="number" min="1" max="12" 
                               value={range.end.month || ''}
                               onChange={(e) => updateDateRange(editingTheme.id, idx, 'end', 'month', parseInt(e.target.value))}
                               className="h-8 px-2"
                             />
                             <Input 
                               type="number" min="1" max="31" 
                               value={range.end.day || ''}
                               onChange={(e) => updateDateRange(editingTheme.id, idx, 'end', 'day', parseInt(e.target.value))}
                               className="h-8 px-2"
                             />
                           </div>
                        </div>
                     </div>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover/date:opacity-100 transition-opacity shadow-sm"
                       onClick={() => removeDateRange(editingTheme.id, idx)}
                     >
                       <X className="w-3 h-3" />
                     </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => addDateRange(editingTheme.id)}>
                  <Plus className="mr-2 h-3 w-3" /> Agregar Rango
                </Button>
              </div>
            </div>

            {/* Section 3: Landing Content */}
            <div className="space-y-6 border-b pb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">Contenido Landing Page</h3>
              
              <div className="space-y-4">
                  <div className="space-y-2">
                     <Label>Título Hero</Label>
                     <Input 
                        value={editingTheme.landing.heroTitle}
                        onChange={(e) => updateLanding(editingTheme.id, { heroTitle: e.target.value })}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Subtítulo</Label>
                     <Input 
                        value={editingTheme.landing.heroSubtitle || ''}
                        onChange={(e) => updateLanding(editingTheme.id, { heroSubtitle: e.target.value })}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label>Descripción</Label>
                     <Textarea 
                        value={editingTheme.landing.heroDescription}
                        onChange={(e) => updateLanding(editingTheme.id, { heroDescription: e.target.value })}
                        rows={3}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Texto CTA</Label>
                      <Input 
                        value={editingTheme.landing.ctaText} 
                        onChange={e => updateLanding(editingTheme.id, { ctaText: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Enlace CTA</Label>
                      <Input 
                        value={editingTheme.landing.ctaLink} 
                        onChange={e => updateLanding(editingTheme.id, { ctaLink: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="flex items-center gap-2">
                       <Camera className="w-4 h-4" />
                       URL de Imagen Hero
                     </Label>
                     <div className="flex gap-2">
                       <Input 
                          value={editingTheme.landing.heroImage || ''}
                          onChange={(e) => updateLanding(editingTheme.id, { heroImage: e.target.value })}
                          className="font-mono text-xs"
                       />
                       {editingTheme.landing.heroImage && (
                         <a href={editingTheme.landing.heroImage} target="_blank" rel="noreferrer" className="flex items-center justify-center p-2 bg-muted rounded-md border hover:bg-muted/80">
                            <ExternalLink className="w-4 h-4" />
                         </a>
                       )}
                     </div>
                     {editingTheme.landing.heroImage && (
                       <div className="mt-2 h-32 w-full rounded-md overflow-hidden bg-muted border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={editingTheme.landing.heroImage} alt="Preview" className="w-full h-full object-cover" />
                       </div>
                     )}
                  </div>
              </div>
            </div>

            {/* Section 4: Announcement Bar */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">Barra Superior</h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`bar-enabled-${editingTheme.id}`} className="text-sm font-normal">Habilitar Barra</Label>
                  <Switch 
                    id={`bar-enabled-${editingTheme.id}`}
                    checked={editingTheme.announcement?.enabled || false}
                    onCheckedChange={checked => updateAnnouncement(editingTheme.id, { enabled: checked })}
                  />
                </div>
              </div>
              
              {editingTheme.announcement?.enabled && (
                <div className="grid gap-4 bg-muted/20 p-4 rounded-lg border">
                  <div className="space-y-2">
                    <Label>Contenido del Mensaje</Label>
                    <Input 
                      value={editingTheme.announcement?.content || ''} 
                      onChange={e => updateAnnouncement(editingTheme.id, { content: e.target.value })}
                      placeholder="Ej: ¡Ofertas de San Valentín! Envío gratis."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Texto Enlace</Label>
                      <Input 
                        value={editingTheme.announcement?.linkText || ''} 
                        onChange={e => updateAnnouncement(editingTheme.id, { linkText: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL Enlace</Label>
                      <Input 
                        value={editingTheme.announcement?.linkUrl || ''} 
                        onChange={e => updateAnnouncement(editingTheme.id, { linkUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Color Fondo</Label>
                      <Input 
                        value={editingTheme.announcement?.bgColor || ''} 
                        onChange={e => updateAnnouncement(editingTheme.id, { bgColor: e.target.value })}
                        placeholder="bg-red-500 o #ff0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color Texto</Label>
                      <Input 
                        value={editingTheme.announcement?.textColor || ''} 
                        onChange={e => updateAnnouncement(editingTheme.id, { textColor: e.target.value })}
                        placeholder="text-white o #ffffff"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-8 border-t">
               <Button onClick={() => setEditingId(null)} className="min-w-[120px]">
                  Hecho
               </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
