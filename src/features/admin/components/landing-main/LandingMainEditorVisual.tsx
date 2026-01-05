import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Laptop, Sun, Moon, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { LandingMainConfig } from '@/shared/types/landing';

interface LandingMainEditorVisualProps {
    form: LandingMainConfig;
    updateField: (key: keyof LandingMainConfig, value: any) => void;
    handleAddBubble: () => void;
    handleRemoveBubble: (index: number) => void;
    handleUpdateBubble: (index: number, value: string) => void;
}

export function LandingMainEditorVisual({
    form,
    updateField,
    handleAddBubble,
    handleRemoveBubble,
    handleUpdateBubble
}: LandingMainEditorVisualProps) {
    return (
        <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-2">
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

            {/* Floating Bubbles */}
            <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Burbujas Flotantes
                    </h3>
                    <Button size="sm" variant="outline" onClick={handleAddBubble}>
                        <Plus className="w-3 h-3 mr-2" />
                        Agregar
                    </Button>
                </div>
                
                <div className="space-y-3">
                    {(form.bubbleImages || []).map((img, idx) => (
                        <div key={idx} className="flex gap-2">
                            <Input 
                                value={img} 
                                onChange={e => handleUpdateBubble(idx, e.target.value)}
                                placeholder="URL de la imagen PNG"
                                className="font-mono text-xs"
                            />
                            {img && (
                                <div className="w-10 h-10 rounded border bg-background flex-shrink-0 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt="" className="w-full h-full object-contain" />
                                </div>
                            )}
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => handleRemoveBubble(idx)}
                                className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    {(form.bubbleImages || []).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4 italic">
                            No hay burbujas configuradas. Agrega URLs de imágenes.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
