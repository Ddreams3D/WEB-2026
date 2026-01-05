'use client';

import { useState, useEffect } from 'react';
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
import { Calendar as CalendarIcon, Save, Plus, Trash2, Edit, X, ChevronDown, ChevronUp, Camera, ExternalLink } from '@/lib/icons';
import Link from 'next/link';
import { useToast } from '@/components/ui/ToastManager';
import { cn } from '@/lib/utils';
import SeasonalLanding from '@/features/seasonal/components/SeasonalLanding';

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
      // Draw two bars? Or just one that wraps? For simplicity here, just draw until end of year
      return 100 - startP; 
    }
    return endP - startP;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Campañas Estacionales</h1>
        <Link href="/admin/landing">
          <Button variant="outline">Gestionar Landing Principal</Button>
        </Link>
      </div>
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendario de Campañas</h2>
          <p className="text-muted-foreground">
            Gestiona la visibilidad y contenido de las campañas estacionales.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="min-w-[140px]">
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

      {/* Visual Calendar */}
      <Card className="overflow-hidden border-2 border-primary/5">
        <CardHeader className="pb-2 bg-muted/30">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Línea de Tiempo Anual
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Months Header */}
            <div className="grid grid-cols-12 gap-0 mb-4 text-center border-b pb-2">
              {MONTHS.map(m => (
                <div key={m} className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{m}</div>
              ))}
            </div>

            {/* Timeline Rows */}
            <div className="space-y-3 relative">
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-12 pointer-events-none h-full w-full">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="border-l border-dashed border-border h-full opacity-50 last:border-r" />
                ))}
              </div>

              {themes.map(theme => (
                <div key={theme.id} className="relative h-10 flex items-center group">
                  {/* Label */}
                  <div className="absolute -left-32 w-28 text-right text-xs font-medium truncate pr-2 z-10 hidden md:block">
                    {theme.name}
                  </div>

                  {/* Bars */}
                  <div className="w-full h-full relative">
                     {theme.dateRanges.map((range, idx) => {
                       const left = getLeftPercent(range.start.month, range.start.day);
                       const width = getWidthPercent(range.start, range.end);
                       
                       return (
                         <div 
                           key={idx}
                           className={cn(
                             "absolute h-6 top-2 rounded-md shadow-sm cursor-pointer transition-all hover:brightness-110 hover:scale-y-110",
                             theme.isActive ? "bg-primary ring-2 ring-primary/30" : "bg-muted-foreground/50",
                             editingId === theme.id ? "ring-2 ring-offset-2 ring-primary" : ""
                           )}
                           style={{ left: `${left}%`, width: `${width}%` }}
                           onClick={() => setEditingId(theme.id === editingId ? null : theme.id)}
                           title={`${theme.name}: ${range.start.day}/${range.start.month} - ${range.end.day}/${range.end.month}`}
                         >
                            <span className="text-[10px] text-white font-bold px-1 flex items-center h-full overflow-hidden whitespace-nowrap">
                              {theme.name}
                            </span>
                         </div>
                       );
                     })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List / Editor */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {themes.map(theme => {
          const isEditing = editingId === theme.id;
          
          return (
            <Card 
              key={theme.id} 
              className={cn(
                "transition-all duration-300",
                isEditing ? "col-span-full md:col-span-2 xl:col-span-3 ring-2 ring-primary shadow-lg scale-[1.01]" : "hover:border-primary/50"
              )}
            >
              {/* Card View (Summary) */}
              {!isEditing ? (
                <>
                  <div className="aspect-video w-full relative overflow-hidden bg-muted group cursor-pointer isolate" onClick={() => setEditingId(theme.id)}>
                    {/* Live Component Preview */}
                    <div className="w-[400%] h-[400%] absolute top-0 left-0 transform scale-[0.25] origin-top-left pointer-events-none select-none bg-background">
                       <SeasonalLanding config={theme} />
                    </div>

                    {/* Overlays for readability and interaction */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                       <h3 className="text-white font-bold text-lg drop-shadow-md">{theme.name}</h3>
                       <p className="text-white/90 text-xs line-clamp-1 drop-shadow-md">{theme.landing.heroTitle}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                       {theme.isActive && <Badge variant="default" className="shadow-md">Activo</Badge>}
                       <a 
                         href={`/campanas/${theme.id}?preview=true`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="bg-background/80 hover:bg-background text-foreground p-1 rounded-full backdrop-blur-sm transition-colors"
                         onClick={(e) => e.stopPropagation()}
                         title="Abrir vista previa en nueva pestaña"
                       >
                         <ExternalLink className="w-4 h-4" />
                       </a>
                    </div>
                  </div>
                  
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                       <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {theme.dateRanges.length > 0 
                              ? `${theme.dateRanges[0].start.day}/${theme.dateRanges[0].start.month} - ${theme.dateRanges[0].end.day}/${theme.dateRanges[0].end.month}`
                              : 'Sin fecha'}
                          </span>
                       </div>
                       <Badge variant="outline">{theme.landing.featuredTag}</Badge>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setEditingId(theme.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Detalles
                    </Button>
                  </CardContent>
                </>
              ) : (
                /* Editor View (Expanded) */
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* Left Column: Config & Dates */}
                  <div className="lg:col-span-4 space-y-6 border-r pr-0 lg:pr-8">
                     <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold">{theme.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {theme.id}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}>
                          <X className="w-5 h-5" />
                        </Button>
                     </div>

                     <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
                        <div className="space-y-0.5">
                          <Label className="text-base">Activación Manual</Label>
                          <p className="text-xs text-muted-foreground">Forzar la campaña visible ignorando fechas.</p>
                        </div>
                        <Switch 
                          checked={theme.isActive || false}
                          onCheckedChange={(checked) => updateTheme(theme.id, { isActive: checked })}
                        />
                     </div>

                     <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          Rangos de Fechas
                        </Label>
                        {theme.dateRanges.map((range, idx) => (
                          <div key={idx} className="bg-card border rounded-md p-3 space-y-3 relative group/date">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <span className="text-xs text-muted-foreground block mb-1">Inicio (Mes/Día)</span>
                                   <div className="flex gap-2">
                                     <Input 
                                       type="number" min="1" max="12" 
                                       value={range.start.month || ''}
                                       onChange={(e) => updateDateRange(theme.id, idx, 'start', 'month', parseInt(e.target.value))}
                                       className="h-8 px-2"
                                     />
                                     <Input 
                                       type="number" min="1" max="31" 
                                       value={range.start.day || ''}
                                       onChange={(e) => updateDateRange(theme.id, idx, 'start', 'day', parseInt(e.target.value))}
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
                                       onChange={(e) => updateDateRange(theme.id, idx, 'end', 'month', parseInt(e.target.value))}
                                       className="h-8 px-2"
                                     />
                                     <Input 
                                       type="number" min="1" max="31" 
                                       value={range.end.day || ''}
                                       onChange={(e) => updateDateRange(theme.id, idx, 'end', 'day', parseInt(e.target.value))}
                                       className="h-8 px-2"
                                     />
                                   </div>
                                </div>
                             </div>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover/date:opacity-100 transition-opacity shadow-sm"
                               onClick={() => removeDateRange(theme.id, idx)}
                             >
                               <X className="w-3 h-3" />
                             </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => addDateRange(theme.id)}>
                          <Plus className="mr-2 h-3 w-3" /> Agregar Rango
                        </Button>
                     </div>
                  </div>

                  {/* Right Column: Landing Content */}
                  <div className="lg:col-span-8 space-y-6">
                     <div>
                       <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Contenido de la Landing Page</h4>
                       <div className="grid gap-6">
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <Label>Título Hero</Label>
                               <Input 
                                  value={theme.landing.heroTitle}
                                  onChange={(e) => updateLanding(theme.id, { heroTitle: e.target.value })}
                               />
                            </div>
                            <div className="space-y-2">
                               <Label>Subtítulo</Label>
                               <Input 
                                  value={theme.landing.heroSubtitle || ''}
                                  onChange={(e) => updateLanding(theme.id, { heroSubtitle: e.target.value })}
                               />
                            </div>
                          </div>

                          <div className="space-y-2">
                             <Label>Descripción</Label>
                             <Textarea 
                                value={theme.landing.heroDescription}
                                onChange={(e) => updateLanding(theme.id, { heroDescription: e.target.value })}
                                rows={3}
                             />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                               <Label>Texto del Botón (CTA)</Label>
                               <Input 
                                  value={theme.landing.ctaText}
                                  onChange={(e) => updateLanding(theme.id, { ctaText: e.target.value })}
                               />
                             </div>
                             <div className="space-y-2">
                               <Label>Tag de Productos Destacados</Label>
                               <Input 
                                  value={theme.landing.featuredTag}
                                  onChange={(e) => updateLanding(theme.id, { featuredTag: e.target.value })}
                                  placeholder="ej: navidad, amor, madre"
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
                                  value={theme.landing.heroImage || ''}
                                  onChange={(e) => updateLanding(theme.id, { heroImage: e.target.value })}
                                  className="font-mono text-xs"
                               />
                               {theme.landing.heroImage && (
                                 <a href={theme.landing.heroImage} target="_blank" rel="noreferrer" className="flex items-center justify-center p-2 bg-muted rounded-md border hover:bg-muted/80">
                                    <ExternalLink className="w-4 h-4" />
                                 </a>
                               )}
                             </div>
                             {theme.landing.heroImage && (
                               <div className="mt-2 h-32 w-full rounded-md overflow-hidden bg-muted border">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={theme.landing.heroImage} alt="Preview" className="w-full h-full object-cover" />
                               </div>
                             )}
                          </div>

                       </div>
                     </div>
                     
                     <div className="flex justify-end pt-4 border-t">
                        <Button onClick={() => setEditingId(null)}>
                           Listo, Volver
                        </Button>
                     </div>
                  </div>

                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
