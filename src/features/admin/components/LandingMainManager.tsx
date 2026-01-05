'use client';

import React, { useEffect, useState } from 'react';
import { LandingMainConfig } from '@/shared/types/landing';
import { saveLandingMain, fetchLandingMain } from '@/services/landing.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/ToastManager';
import LandingMainPageClient from '@/features/landing-main/LandingMainPageClient';
import AnnouncementBar from '@/shared/components/layout/AnnouncementBar';
import { Sheet } from '@/components/ui/simple-sheet';
import { 
    Save, LayoutTemplate, ExternalLink, Edit, Monitor, Smartphone, 
    AlertCircle, Moon, Sun, Laptop, Image as ImageIcon, Type, 
    Megaphone, Palette, Sparkles, Plus, Trash2, X, Check
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Mock Navbar for Preview
const NavbarMock = () => (
  <div className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 w-full">
    <div className="flex items-center gap-2">
       <div className="w-8 h-8 bg-primary rounded-lg" />
       <div className="w-24 h-5 bg-muted rounded hidden sm:block" />
    </div>
    <div className="hidden md:flex gap-6">
       <div className="w-16 h-4 bg-muted rounded" />
       <div className="w-16 h-4 bg-muted rounded" />
       <div className="w-16 h-4 bg-muted rounded" />
    </div>
    <div className="flex gap-2">
       <div className="w-8 h-8 bg-muted rounded-full" />
       <div className="w-8 h-8 bg-muted rounded-full" />
    </div>
  </div>
);

export default function LandingMainManager() {
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

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveLandingMain(form);
      showSuccess('Landing principal guardada correctamente');
      setIsEditing(false);
    } catch (error: any) {
      showError(error.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
            <div className="relative">
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <LayoutTemplate className="w-6 h-6 text-primary" />
                Landing Principal
                </h2>
                <p className="text-muted-foreground mt-1">
                Configura la página de inicio que ven tus usuarios cuando no hay campañas activas.
                </p>
            </div>
            <div className="flex gap-2 relative">
                <Button variant="outline" asChild className="hover:bg-muted">
                    <a href="/impresion-3d-arequipa" target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver en vivo
                    </a>
                </Button>
                <Button onClick={handleSave} disabled={saving} className="min-w-[140px] shadow-md">
                    {saving ? (
                        <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full" />
                        Guardando...
                        </>
                    ) : (
                        <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                        </>
                    )}
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: Visual Preview (Takes 2 cols on XL) */}
            <div className="xl:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-muted-foreground" />
                        Vista Previa
                    </h3>
                    <div className="flex bg-muted rounded-lg p-1">
                        <button 
                            onClick={() => setPreviewMode('desktop')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                previewMode === 'desktop' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setPreviewMode('mobile')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                previewMode === 'mobile' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="border rounded-xl overflow-hidden shadow-2xl bg-muted/10 relative group ring-1 ring-border/50">
                    {/* Browser Mockup Header */}
                    <div className="absolute top-0 left-0 right-0 h-9 bg-muted/90 backdrop-blur border-b flex items-center px-4 gap-2 z-20">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                            <div className="w-3 h-3 rounded-full bg-green-400/80" />
                        </div>
                        <div className="ml-4 flex-1 max-w-xl h-6 bg-background/50 rounded-md text-[10px] flex items-center px-3 text-muted-foreground/60 select-none">
                            ddreams3d.com
                        </div>
                    </div>
                    
                    {/* Scaled Content Container */}
                    <div className={cn(
                        "relative bg-background transition-all duration-500 mx-auto border-x border-border/50 mt-9",
                        previewMode === 'mobile' ? "w-[375px] h-[600px]" : "w-full h-[600px]"
                    )}>
                        <div className={cn(
                            "origin-top-left absolute top-0 left-0 w-full",
                            previewMode === 'desktop' ? "scale-[0.5] w-[200%] h-[200%]" : "scale-[0.5] w-[200%] h-[200%]"
                        )}>
                            {/* Simulated Page Layout */}
                            <div className={cn(
                                "flex flex-col min-h-screen bg-background text-foreground pointer-events-none select-none",
                                form.themeMode === 'dark' ? 'dark' : form.themeMode === 'light' ? 'light' : ''
                            )}>
                                <AnnouncementBar config={form.announcement} />
                                <NavbarMock />
                                <div className="flex-1">
                                    <LandingMainPageClient 
                                        initialConfig={form}
                                        featuredProducts={[]}
                                        services={[]}
                                        bubbleImages={form.bubbleImages || []}
                                    />
                                </div>
                            </div>
                        </div>
                        
                         {/* Interactive Overlay */}
                         <div 
                            className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-[1px]"
                            onClick={() => setIsEditing(true)}
                        >
                            <Button size="lg" className="shadow-2xl scale-110 font-bold">
                                <Edit className="w-5 h-5 mr-2" />
                                Editar Contenido
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Quick Status & Config */}
            <div className="space-y-6">
                 {/* Status Card */}
                 <div className="bg-card rounded-xl border shadow-sm p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        Estado General
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                            <div className="space-y-0.5">
                                <span className="text-sm font-medium block">Barra de Anuncios</span>
                                <span className="text-xs text-muted-foreground block">Mensaje superior global</span>
                            </div>
                            <Badge variant={form.announcement?.enabled ? "default" : "secondary"} className={cn(form.announcement?.enabled ? "bg-green-500 hover:bg-green-600" : "")}>
                                {form.announcement?.enabled ? "ACTIVA" : "INACTIVA"}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                            <div className="space-y-0.5">
                                <span className="text-sm font-medium block">Burbujas Flotantes</span>
                                <span className="text-xs text-muted-foreground block">{form.bubbleImages?.length || 0} imágenes cargadas</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Gestionar</Button>
                        </div>
                    </div>

                    <Button className="w-full mt-6" variant="secondary" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Abrir Editor Completo
                    </Button>
                 </div>

                 {/* Tips Card */}
                 <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6">
                    <h4 className="text-blue-800 dark:text-blue-300 font-semibold mb-2 text-sm">Consejo Pro</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                        Usa imágenes PNG con fondo transparente para las &quot;Burbujas Flotantes&quot; para lograr el mejor efecto visual en la sección Hero.
                    </p>
                 </div>
            </div>
        </div>

        {/* Edit Sheet */}
        <Sheet 
            isOpen={isEditing} 
            onClose={() => setIsEditing(false)} 
            title="Editar Landing Principal"
            description="Modifica los textos, imágenes y configuraciones globales."
            className="sm:max-w-xl md:max-w-2xl"
            underHeader={true}
        >
            <div className="pb-8">
                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="content" className="flex items-center gap-2">
                            <Type className="w-4 h-4" />
                            Contenido
                        </TabsTrigger>
                        <TabsTrigger value="visual" className="flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            Visual
                        </TabsTrigger>
                        <TabsTrigger value="announcement" className="flex items-center gap-2">
                            <Megaphone className="w-4 h-4" />
                            Anuncios
                        </TabsTrigger>
                    </TabsList>

                    {/* CONTENT TAB */}
                    <TabsContent value="content" className="space-y-6 animate-in fade-in-50 slide-in-from-left-2">
                        {/* Hero Texts */}
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                <LayoutTemplate className="w-4 h-4" />
                                Textos Principales
                            </h3>
                            
                            <div className="space-y-3">
                                <Label>Título Hero</Label>
                                <Input 
                                    value={form.heroTitle} 
                                    onChange={e => updateField('heroTitle', e.target.value)} 
                                    className="font-bold text-lg"
                                />
                            </div>
                            
                            <div className="space-y-3">
                                <Label>Subtítulo</Label>
                                <Input 
                                    value={form.heroSubtitle || ''} 
                                    onChange={e => updateField('heroSubtitle', e.target.value)} 
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Descripción</Label>
                                <Textarea 
                                    value={form.heroDescription} 
                                    onChange={e => updateField('heroDescription', e.target.value)} 
                                    className="h-24 resize-none"
                                />
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Llamada a la Acción (CTA)
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label>Texto del Botón</Label>
                                    <Input value={form.ctaText} onChange={e => updateField('ctaText', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label>Enlace de Destino</Label>
                                    <Input value={form.ctaLink} onChange={e => updateField('ctaLink', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* VISUAL TAB */}
                    <TabsContent value="visual" className="space-y-6 animate-in fade-in-50 slide-in-from-right-2">
                         {/* Theme Mode */}
                         <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Palette className="w-4 h-4" />
                                Tema y Colores
                            </h3>
                            
                            <div className="space-y-3">
                                <Label>Preferencia de Tema</Label>
                                <Select 
                                    value={form.themeMode || 'system'} 
                                    onValueChange={(val: any) => updateField('themeMode', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar modo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">
                                            <div className="flex items-center gap-2">
                                                <Laptop className="w-4 h-4" />
                                                <span>Automático (Sistema)</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="light">
                                            <div className="flex items-center gap-2">
                                                <Sun className="w-4 h-4" />
                                                <span>Siempre Claro</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="dark">
                                            <div className="flex items-center gap-2">
                                                <Moon className="w-4 h-4" />
                                                <span>Siempre Oscuro</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Imagen Hero
                            </h3>
                            
                            <div className="space-y-3">
                                <Label>URL de la Imagen</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={form.heroImage || ''} 
                                        onChange={e => updateField('heroImage', e.target.value)} 
                                        placeholder="https://..."
                                    />
                                </div>
                                {form.heroImage && (
                                    <div className="mt-2 relative aspect-video rounded-md overflow-hidden border bg-muted">
                                        <img src={form.heroImage} alt="Hero Preview" className="object-cover w-full h-full" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bubbles Manager */}
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Burbujas Flotantes
                                </h3>
                                <Button size="sm" variant="outline" onClick={handleAddBubble}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar
                                </Button>
                            </div>
                            
                            <div className="space-y-3">
                                {(form.bubbleImages || []).map((img, idx) => (
                                    <div key={idx} className="flex gap-2 items-start group">
                                        <div className="flex-1 space-y-2">
                                            <Input 
                                                value={img} 
                                                onChange={e => handleUpdateBubble(idx, e.target.value)} 
                                                placeholder="URL de imagen PNG..."
                                                className="font-mono text-xs"
                                            />
                                            {img && (
                                                <div className="h-16 w-16 rounded border bg-muted/50 p-1 flex items-center justify-center">
                                                    <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                                                </div>
                                            )}
                                        </div>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => handleRemoveBubble(idx)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(form.bubbleImages || []).length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                                        No hay burbujas configuradas
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ANNOUNCEMENT TAB */}
                    <TabsContent value="announcement" className="space-y-6 animate-in fade-in-50 slide-in-from-right-2">
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Megaphone className="w-4 h-4" />
                                Configuración Global
                            </h3>
                            
                            <div className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Barra Activa</Label>
                                    <p className="text-xs text-muted-foreground">Mostrar mensaje en todas las páginas</p>
                                </div>
                                <Switch 
                                    checked={form.announcement?.enabled || false}
                                    onCheckedChange={e => updateAnnouncement({ enabled: e })}
                                />
                            </div>

                            <div className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Permitir Cerrar</Label>
                                    <p className="text-xs text-muted-foreground">El usuario puede ocultar la barra</p>
                                </div>
                                <Switch 
                                    checked={form.announcement?.closable ?? true}
                                    onCheckedChange={e => updateAnnouncement({ closable: e })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Type className="w-4 h-4" />
                                Contenido
                            </h3>
                            <div className="space-y-3">
                                <Label>Mensaje del Anuncio</Label>
                                <Input 
                                    value={form.announcement?.content || ''}
                                    onChange={e => updateAnnouncement({ content: e.target.value })}
                                    placeholder="Ej. ¡Envío gratis por tiempo limitado!"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Palette className="w-4 h-4" />
                                Apariencia
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Color de Fondo</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            type="color" 
                                            value={form.announcement?.bgColor || '#000000'}
                                            onChange={e => updateAnnouncement({ bgColor: e.target.value })}
                                            className="w-12 h-10 p-1 cursor-pointer"
                                        />
                                        <Input 
                                            value={form.announcement?.bgColor || ''}
                                            onChange={e => updateAnnouncement({ bgColor: e.target.value })}
                                            placeholder="#000000"
                                            className="font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Color de Texto</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            type="color" 
                                            value={form.announcement?.textColor || '#ffffff'}
                                            onChange={e => updateAnnouncement({ textColor: e.target.value })}
                                            className="w-12 h-10 p-1 cursor-pointer"
                                        />
                                        <Input 
                                            value={form.announcement?.textColor || ''}
                                            onChange={e => updateAnnouncement({ textColor: e.target.value })}
                                            placeholder="#ffffff"
                                            className="font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Sheet>
    </div>
  );
}
