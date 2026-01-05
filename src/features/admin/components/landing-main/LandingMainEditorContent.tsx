import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LayoutTemplate, ExternalLink } from 'lucide-react';
import { LandingMainConfig } from '@/shared/types/landing';

interface LandingMainEditorContentProps {
    form: LandingMainConfig;
    updateField: (key: keyof LandingMainConfig, value: any) => void;
}

export function LandingMainEditorContent({ form, updateField }: LandingMainEditorContentProps) {
    return (
        <div className="space-y-6 animate-in fade-in-50 slide-in-from-left-2">
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
        </div>
    );
}
