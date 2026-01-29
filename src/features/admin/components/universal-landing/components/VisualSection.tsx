import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, ImageIcon, Moon, Sun, Monitor, Megaphone, Type, MousePointerClick, Layers, Box, Sparkles } from 'lucide-react';
import { UnifiedLandingData } from '../types';
import { cn } from '@/lib/utils';
import ImageUpload from '@/features/admin/components/ImageUpload';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

interface VisualSectionProps {
  data: UnifiedLandingData;
  updateField: (field: keyof UnifiedLandingData, value: any) => void;
  inheritedPrimaryColor?: string;
}

const THEME_MODES = [
  { id: 'light', label: 'Claro', icon: Sun },
  { id: 'dark', label: 'Oscuro', icon: Moon },
  { id: 'system', label: 'Automático', icon: Monitor }
] as const;

export function VisualSection({ data, updateField, inheritedPrimaryColor }: VisualSectionProps) {
  const isService = data.type === 'service';
  
  // Logic for display: use explicit color or default to Service/Landing default (not main web)
  const displayColor = data.primaryColor || '#e11d48';
  const isInherited = false; // Disabled inheritance from main web per user request

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-border/50">
        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-sm">
          <Palette className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Diseño & Atmósfera
          </h2>
          <p className="text-sm text-muted-foreground">
            Personaliza los colores y elementos visuales.
          </p>
        </div>
      </div>
      
      {isService ? (
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)]">
            <div className="space-y-3">
              <div className="bg-card border rounded-xl p-2.5 shadow-sm space-y-1.5">
                <Label className="text-sm font-medium">Tema de color</Label>
                <div className="flex flex-col gap-1.5">
                  {THEME_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => updateField('themeMode', mode.id)}
                      className={cn(
                        "flex items-center justify-between px-3 py-1.5 rounded-lg text-xs border transition-colors",
                        data.themeMode === mode.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted/70 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <mode.icon className="w-3 h-3" />
                        <span>{mode.label}</span>
                      </div>
                      {data.themeMode === mode.id && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card border rounded-xl p-2.5 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Color principal</Label>
                    {isInherited && (
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium border border-primary/20">
                            Heredado
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md border overflow-hidden relative group">
                      <Input
                        type="color"
                        value={displayColor}
                        onChange={(e) => updateField('primaryColor', e.target.value)}
                        className="w-full h-full p-0 border-none cursor-pointer bg-transparent"
                      />
                    </div>
                    <div className="flex-1 flex gap-2">
                        <Input
                            value={data.primaryColor || ''}
                            onChange={(e) => updateField('primaryColor', e.target.value)}
                            placeholder={isInherited ? `(Heredado: ${inheritedPrimaryColor})` : "#c2410c"}
                            className={cn(
                                "font-mono text-[10px] h-8",
                                isInherited && "text-muted-foreground italic"
                            )}
                        />
                        {!isInherited && data.primaryColor && (
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => updateField('primaryColor', undefined)}
                                title="Restablecer a heredado"
                            >
                                <span className="sr-only">Reset</span>
                                ×
                            </Button>
                        )}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                      {isInherited 
                        ? "Usando color de la landing principal. Haz clic para personalizar." 
                        : "Color personalizado activo. Borra el valor para heredar."}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Imágenes del Hero (Comparación)
              </Label>

              <div className="flex-1 border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-4 bg-muted/5 hover:bg-muted/10 transition-colors relative overflow-hidden group min-h-[260px]">
                <div className="w-full relative z-10 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Imagen 1 (Escultura Real)
                    </Label>
                    <ImageUpload
                      value={data.heroImage}
                      onChange={(url) => updateField('heroImage', url)}
                      onRemove={() => updateField('heroImage', '')}
                      defaultName={`hero-real-${data.slug || 'service'}`}
                      storagePath={StoragePathBuilder.services(data.slug || 'service', 'hero')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Imagen 2 (Modelo 3D)
                    </Label>
                    <ImageUpload
                      value={data.heroImageComparison}
                      onChange={(url) => updateField('heroImageComparison', url)}
                      onRemove={() => updateField('heroImageComparison', '')}
                      defaultName={`hero-3d-${data.slug || 'service'}`}
                      storagePath={`${StoragePathBuilder.services(data.slug || 'service')}/hero`}
                    />
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Encuadre recomendado</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <p className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-1 rounded-full">3:4 o 4:5 Vertical</p>
                    <p className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-1 rounded-full">Mínimo: 1080w x 1350h</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">
                    Ideal: <span className="font-semibold">1200 Ancho x 1600 Alto</span>.
                  </p>
                  <p className="text-[10px] text-amber-500/90 mt-2 font-medium">
                    ⚠️ Usa el mismo fondo en ambas fotos (o ambas transparentes) para que el efecto funcione.
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">
                    Formatos: <span className="font-semibold">WebP</span> (mejor) o <span className="font-semibold">JPG</span>. Evita PNG si no hay transparencia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* --- COLOR PALETTE --- */}
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b pb-3">
              <Palette className="w-5 h-5 text-primary" />
              <Label className="text-base font-medium">Paleta de Colores</Label>
            </div>
            
            <div className="space-y-4">
              <Label className="text-sm font-medium">Modo de Tema</Label>
              <div className="grid grid-cols-3 gap-4">
                {THEME_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => updateField('themeMode', mode.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all hover:scale-105",
                      data.themeMode === mode.id 
                        ? "border-primary bg-primary/5 text-primary shadow-sm" 
                        : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <mode.icon className={cn("w-6 h-6", data.themeMode === mode.id && "fill-current")} />
                    <span className="font-medium text-sm">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
               {/* Primary Color */}
               <div className="space-y-3">
                  <Label className="text-sm font-medium">Color Principal (Marca/Acción)</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border-2 shadow-sm overflow-hidden relative transition-transform hover:scale-105">
                      <Input
                        type="color"
                        value={data.primaryColor || '#00BFB3'} 
                        onChange={(e) => updateField('primaryColor', e.target.value)}
                        className="w-[150%] h-[150%] -top-1/4 -left-1/4 absolute p-0 border-none cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                        <Input
                            value={data.primaryColor || ''}
                            onChange={(e) => updateField('primaryColor', e.target.value)}
                            placeholder="#00BFB3"
                            className="font-mono text-sm"
                        />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Botones, enlaces y destacados.</p>
               </div>

               {/* Secondary Color */}
               <div className="space-y-3">
                  <Label className="text-sm font-medium">Color Secundario (Acento)</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border-2 shadow-sm overflow-hidden relative transition-transform hover:scale-105">
                      <Input
                        type="color"
                        value={data.secondaryColor || '#ec4899'} 
                        onChange={(e) => updateField('secondaryColor', e.target.value)}
                        className="w-[150%] h-[150%] -top-1/4 -left-1/4 absolute p-0 border-none cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                        <Input
                            value={data.secondaryColor || ''}
                            onChange={(e) => updateField('secondaryColor', e.target.value)}
                            placeholder="#ec4899"
                            className="font-mono text-sm"
                        />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Detalles, bordes y decoraciones.</p>
               </div>

               {/* Background Color Override */}
               <div className="space-y-3">
                  <Label className="text-sm font-medium">Fondo de Página (Opcional)</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border-2 shadow-sm overflow-hidden relative transition-transform hover:scale-105">
                      <Input
                        type="color"
                        value={data.backgroundColor || '#ffffff'} 
                        onChange={(e) => updateField('backgroundColor', e.target.value)}
                        className="w-[150%] h-[150%] -top-1/4 -left-1/4 absolute p-0 border-none cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                        <Input
                            value={data.backgroundColor || ''}
                            onChange={(e) => updateField('backgroundColor', e.target.value)}
                            placeholder="#ffffff"
                            className="font-mono text-sm"
                        />
                    </div>
                    {data.backgroundColor && (
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => updateField('backgroundColor', undefined)}
                            title="Limpiar"
                        >
                            ×
                        </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Sobrescribe el fondo por defecto.</p>
               </div>
            </div>


          </div>

          {/* --- TYPOGRAPHY & UI --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl p-5 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b pb-3">
                    <Type className="w-5 h-5 text-indigo-500" />
                    <Label className="text-base font-medium">Tipografía</Label>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Títulos</Label>
                        <Select 
                            value={data.fontFamilyHeading || 'inter'} 
                            onValueChange={(val) => updateField('fontFamilyHeading', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar fuente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inter" className="font-sans">Inter (Moderno)</SelectItem>
                                <SelectItem value="playfair" className="font-serif">Playfair Display (Elegante)</SelectItem>
                                <SelectItem value="montserrat" className="font-sans font-bold">Montserrat (Fuerte)</SelectItem>
                                <SelectItem value="oswald" className="font-sans uppercase">Oswald (Impacto)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cuerpo de Texto</Label>
                        <Select 
                            value={data.fontFamilyBody || 'inter'} 
                            onValueChange={(val) => updateField('fontFamilyBody', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar fuente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inter">Inter (Legible)</SelectItem>
                                <SelectItem value="roboto">Roboto (Neutro)</SelectItem>
                                <SelectItem value="open-sans">Open Sans (Amigable)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-xl p-5 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b pb-3">
                    <MousePointerClick className="w-5 h-5 text-emerald-500" />
                    <Label className="text-base font-medium">Estilo de Interfaz</Label>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Forma de Botones</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'rounded', label: 'Redondo', class: 'rounded-lg' },
                                { id: 'pill', label: 'Píldora', class: 'rounded-full' },
                                { id: 'square', label: 'Cuadrado', class: 'rounded-none' }
                            ].map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => updateField('buttonStyle', style.id)}
                                    className={cn(
                                        "h-10 text-xs font-medium border transition-all flex items-center justify-center",
                                        style.class,
                                        data.buttonStyle === style.id 
                                            ? "bg-primary text-primary-foreground border-primary shadow-md" 
                                            : "bg-muted/50 hover:bg-muted border-transparent"
                                    )}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Textura de Fondo</Label>
                        <Select 
                            value={data.patternOverlay || 'none'} 
                            onValueChange={(val) => updateField('patternOverlay', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar patrón" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Ninguno</SelectItem>
                                <SelectItem value="dots">Puntos Discretos</SelectItem>
                                <SelectItem value="grid">Cuadrícula Técnica</SelectItem>
                                <SelectItem value="noise">Ruido Suave</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
          </div>

          {data.type !== 'service' && (
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
            <Label className="text-base font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Imagen de Fondo del Hero
            </Label>
            
            <div className="flex-1 border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-4 bg-muted/5 hover:bg-muted/10 transition-colors relative overflow-hidden group min-h-[300px]">
              <div className="w-full relative z-10 space-y-6">
                <ImageUpload
                  value={data.heroImage}
                  onChange={(url) => updateField('heroImage', url)}
                  onRemove={() => updateField('heroImage', '')}
                  defaultName={`hero-${data.slug || 'landing'}`}
                  storagePath={
                    data.type === 'campaign'
                      ? StoragePathBuilder.seasonal(data.slug || data.id || 'general', 'hero')
                      : StoragePathBuilder.landings(data.slug || data.id || 'general', 'hero')
                  }
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Dimensiones recomendadas</p>
                <p className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-1 rounded-full inline-block">
                  1920 x 1080 px
                </p>
              </div>
            </div>
          </div>
          )}

          {data.type === 'main' && (
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Burbujas Flotantes
              </Label>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Decoración</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {data.bubbles?.map((bubble, idx) => (
                <div key={idx} className="relative">
                  <ImageUpload
                    value={bubble}
                    onChange={(url) => {
                      const next = [...(data.bubbles || [])];
                      next[idx] = url;
                      updateField('bubbles', next);
                    }}
                    onRemove={() => {
                      const next = (data.bubbles || []).filter((_, i) => i !== idx);
                      updateField('bubbles', next);
                    }}
                    defaultName={`bubble-${idx + 1}`}
                    storagePath={StoragePathBuilder.landings('main', 'bubbles')}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const next = [...(data.bubbles || [])];
                  next.push('');
                  updateField('bubbles', next);
                }}
                className="aspect-square bg-muted/30 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all group text-muted-foreground hover:text-primary"
              >
                <div className="w-8 h-8 rounded-full bg-background shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium">Añadir</span>
              </button>
            </div>
          </div>
          )}

          {data.type !== 'service' && data.type !== 'main' && (
          <div className="bg-gradient-to-br from-card to-orange-500/5 border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-orange-500" />
                  Barra de Anuncios
                </Label>
                <p className="text-sm text-muted-foreground">Muestra un mensaje importante en la parte superior.</p>
              </div>
              <Switch 
                checked={data.announcement?.enabled || false}
                onCheckedChange={(checked) => updateField('announcement', { ...data.announcement, enabled: checked })}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
            
            {data.announcement?.enabled && (
              <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                <div className="relative">
                  <Input 
                    value={data.announcement.content || ''} 
                    onChange={(e) => updateField('announcement', { ...data.announcement, content: e.target.value })}
                    placeholder="Ej: ¡Envío gratis en compras mayores a $50!"
                    className="pl-10 border-orange-200 focus-visible:ring-orange-500/20"
                  />
                  <Megaphone className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
