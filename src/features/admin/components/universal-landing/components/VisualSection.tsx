import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Palette, ImageIcon, Moon, Sun, Monitor, Megaphone } from 'lucide-react';
import { UnifiedLandingData } from '../types';
import { cn } from '@/lib/utils';

interface VisualSectionProps {
  data: UnifiedLandingData;
  updateField: (field: keyof UnifiedLandingData, value: any) => void;
}

export function VisualSection({ data, updateField }: VisualSectionProps) {
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
      
      <div className="grid gap-6">
        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
          <Label className="text-base font-medium">Tema de Color</Label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light', label: 'Claro', icon: Sun },
              { id: 'dark', label: 'Oscuro', icon: Moon },
              { id: 'system', label: 'Automático', icon: Monitor }
            ].map((mode) => (
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

        {data.type === 'service' && (
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Color principal del servicio</Label>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={data.primaryColor || '#e11d48'}
                  onChange={(e) => updateField('primaryColor', e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={data.primaryColor || ''}
                  onChange={(e) => updateField('primaryColor', e.target.value)}
                  placeholder="#c2410c"
                  className="font-mono text-sm"
                />
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
            
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {data.bubbles?.map((bubble, idx) => (
                <div key={idx} className="relative aspect-square bg-muted rounded-xl overflow-hidden group border hover:border-primary/50 transition-colors">
                  <Image 
                    src={bubble} 
                    alt="Decorative bubble" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <Button variant="destructive" size="icon" className="h-6 w-6 rounded-full">×</Button>
                  </div>
                </div>
              ))}
              <button className="aspect-square bg-muted/30 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all group text-muted-foreground hover:text-primary">
                <div className="w-8 h-8 rounded-full bg-background shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium">Añadir</span>
              </button>
            </div>
          </div>
        )}

        {data.type !== 'service' && (
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
    </div>
  );
}
