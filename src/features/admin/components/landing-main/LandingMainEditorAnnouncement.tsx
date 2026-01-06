import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Megaphone } from 'lucide-react';
import { LandingMainConfig } from '@/shared/types/landing';

interface LandingMainEditorAnnouncementProps {
    form: LandingMainConfig;
    updateAnnouncement: (updates: Partial<any>) => void;
}

export function LandingMainEditorAnnouncement({ form, updateAnnouncement }: LandingMainEditorAnnouncementProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Megaphone className="w-4 h-4" />
                        Barra Superior
                    </h3>
                    <Switch 
                        checked={form.announcement?.enabled}
                        onCheckedChange={checked => updateAnnouncement({ enabled: checked })}
                    />
                </div>

                {form.announcement?.enabled && (
                    <div className="space-y-4 pt-4 border-t border-dashed">
                        <div className="space-y-3">
                            <Label>Mensaje</Label>
                            <Input 
                                value={form.announcement?.content || ''} 
                                onChange={e => updateAnnouncement({ content: e.target.value })}
                                placeholder="Ej: ¡Envíos gratis todo el mes!"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label>Color de Fondo</Label>
                                <div className="flex gap-2">
                                    <div 
                                        className="w-10 h-10 rounded border shadow-sm"
                                        style={{ backgroundColor: form.announcement?.bgColor || '#000000' }}
                                    />
                                    <Input 
                                        value={form.announcement?.bgColor || ''} 
                                        onChange={e => updateAnnouncement({ bgColor: e.target.value })}
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label>Color de Texto</Label>
                                <div className="flex gap-2">
                                    <div 
                                        className="w-10 h-10 rounded border shadow-sm"
                                        style={{ backgroundColor: form.announcement?.textColor || '#ffffff' }}
                                    />
                                    <Input 
                                        value={form.announcement?.textColor || ''} 
                                        onChange={e => updateAnnouncement({ textColor: e.target.value })}
                                        placeholder="#ffffff"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <Switch 
                                id="closable"
                                checked={form.announcement?.closable}
                                onCheckedChange={checked => updateAnnouncement({ closable: checked })}
                            />
                            <Label htmlFor="closable" className="font-normal cursor-pointer">
                                Permitir cerrar barra
                            </Label>
                        </div>
                    </div>
                )}
                {!form.announcement?.enabled && (
                    <p className="text-sm text-muted-foreground py-2">
                        Activa la barra para mostrar un mensaje importante en la parte superior de todas las páginas.
                    </p>
                )}
            </div>
        </div>
    );
}
