import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { AnnouncementBarConfig } from '@/shared/types/landing';

interface CampaignEditorAnnouncementProps {
  theme: SeasonalThemeConfig;
  updateAnnouncement: (themeId: string, updates: Partial<AnnouncementBarConfig>) => void;
}

export function CampaignEditorAnnouncement({ theme, updateAnnouncement }: CampaignEditorAnnouncementProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">Barra Superior</h3>
        <div className="flex items-center gap-2">
          <Label htmlFor={`bar-enabled-${theme.id}`} className="text-sm font-normal">Habilitar Barra</Label>
          <Switch 
            id={`bar-enabled-${theme.id}`}
            checked={theme.announcement?.enabled || false}
            onCheckedChange={checked => updateAnnouncement(theme.id, { enabled: checked })}
          />
        </div>
      </div>
      
      {theme.announcement?.enabled && (
        <div className="grid gap-4 bg-muted/20 p-4 rounded-lg border">
          <div className="space-y-2">
            <Label>Contenido del Mensaje</Label>
            <Input 
              value={theme.announcement?.content || ''} 
              onChange={e => updateAnnouncement(theme.id, { content: e.target.value })}
              placeholder="Ej: ¡Ofertas de San Valentín! Envío gratis."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Texto Enlace</Label>
              <Input 
                value={theme.announcement?.linkText || ''} 
                onChange={e => updateAnnouncement(theme.id, { linkText: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>URL Enlace</Label>
              <Input 
                value={theme.announcement?.linkUrl || ''} 
                onChange={e => updateAnnouncement(theme.id, { linkUrl: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color Fondo</Label>
              <Input 
                value={theme.announcement?.bgColor || ''} 
                onChange={e => updateAnnouncement(theme.id, { bgColor: e.target.value })}
                placeholder="bg-red-500 o #ff0000"
              />
            </div>
            <div className="space-y-2">
              <Label>Color Texto</Label>
              <Input 
                value={theme.announcement?.textColor || ''} 
                onChange={e => updateAnnouncement(theme.id, { textColor: e.target.value })}
                placeholder="text-white o #ffffff"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
