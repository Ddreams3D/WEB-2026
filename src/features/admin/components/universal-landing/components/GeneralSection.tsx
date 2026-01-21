import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Sparkles, Globe } from 'lucide-react';
import { UnifiedLandingData } from '../types';

interface GeneralSectionProps {
  data: UnifiedLandingData;
  updateField: (field: keyof UnifiedLandingData, value: any) => void;
  automationEnabled?: boolean;
}

export function GeneralSection({ data, updateField, automationEnabled }: GeneralSectionProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header Estilizado */}
      <div className="flex items-center gap-4 pb-4 border-b border-border/50">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Configuración General
          </h2>
          <p className="text-sm text-muted-foreground">
            Información básica e identidad de la landing
          </p>
        </div>
      </div>
      
      <div className="grid gap-6">
        {/* Tarjeta de Identidad */}
        {(data.type === 'service' || data.type === 'campaign') && (
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-20 h-20 text-primary" />
            </div>
            
            <div className="space-y-3 relative">
              <Label className="text-base font-medium flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded text-primary text-xs">ID</span>
                Nombre (Gestión Interna)
              </Label>
              <Input 
                value={data.internalName || ''} 
                onChange={(e) => updateField('internalName', e.target.value)}
                placeholder="Ej: Campaña Navidad 2026"
                className="bg-background/50 text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Este nombre es solo para uso administrativo.
              </p>
            </div>
          </div>
        )}

        {/* Tarjeta de Estado */}
        {(data.type === 'service' || data.type === 'campaign') && (
          <div className="bg-gradient-to-br from-card to-muted/30 border rounded-xl p-5 shadow-sm flex items-center justify-between hover:border-primary/20 transition-colors">
            <div className="space-y-1">
              <Label className="text-base font-medium">Estado de Publicación</Label>
              <p className="text-sm text-muted-foreground">
                {automationEnabled 
                  ? '⚠️ La automatización está activa. Desactívala para controlar manualmente.' 
                  : (data.isActive 
                    ? '✨ La landing está visible para todo el mundo.' 
                    : '🔒 La landing está oculta (Borrador).')}
              </p>
            </div>
            <Switch 
              checked={data.isActive}
              onCheckedChange={(checked) => updateField('isActive', checked)}
              className="data-[state=checked]:bg-primary"
              disabled={automationEnabled}
            />
          </div>
        )}

        {/* Tarjeta de URL (Slug) */}
        {data.type === 'service' && (
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
             <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Dirección Web (URL)
              </Label>
              <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-lg border focus-within:ring-2 ring-primary/20 transition-all">
                <span className="text-sm text-muted-foreground font-mono px-3">/servicios/</span>
                <Input 
                  value={data.slug || ''} 
                  onChange={(e) => updateField('slug', e.target.value)}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 pl-0 h-auto py-1 font-medium"
                  placeholder="mi-servicio-increible"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Usa guiones para separar palabras. Ej: <code>impresion-resina-3d</code>
              </p>
            </div>
          </div>
        )}

        {data.type === 'campaign' && data.id !== 'standard' && (
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-lg font-semibold text-primary">📅 Fechas de Activación</Label>
            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
              Configura las fechas en las que esta campaña estará activa automáticamente.
              <br/>
              <span className="opacity-70 italic">(Componente de fechas simplificado para esta vista unificada)</span>
            </div>
            {/* TODO: Add DateRange picker */}
          </div>
        )}

        {data.id === 'standard' && (
          <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col items-center text-center gap-4 border-primary/20 bg-primary/5">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Tema Estándar (Marca)</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Este es el tema base de la marca. Se muestra cuando no hay otras campañas activas.
                <br/>
                <span className="text-xs opacity-80">Actívalo manualmente para anular cualquier campaña temporal.</span>
              </p>
            </div>
          </div>
        )}

        {data.type === 'main' && (
          <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col items-center text-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Globe className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Landing Principal de Impresión 3D</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Esta es la landing principal para el servicio de impresión 3D. Es independiente de la Web Principal (Home, catálogo, servicios) y está enfocada solo en este servicio.
              </p>
            </div>
            <div className="text-sm bg-muted/50 px-4 py-2 rounded-lg font-mono text-muted-foreground">
              https://ddreams3d.com/impresion-3d-arequipa
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
