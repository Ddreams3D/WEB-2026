import React from 'react';
import Image from 'next/image';
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
        <div className="space-y-6">
            {/* Theme Mode */}
            <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Tema y Colores
                </h3>
                
                <div className="space-y-3">
                    <Label>Preferencia de Tema</Label>
                    <div className="flex items-center justify-between p-3 border rounded-md bg-background/50 text-sm">
                        <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4 text-orange-500" />
                            <span className="font-medium">Modo Claro (Bloqueado)</span>
                        </div>
                        <span className="text-xs text-muted-foreground italic">
                            La landing principal siempre usa el tema claro por defecto.
                        </span>
                    </div>
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
                                <div className="relative w-10 h-10 rounded border bg-background flex-shrink-0 overflow-hidden">
                                    <Image 
                                        src={img} 
                                        alt="" 
                                        fill 
                                        className="object-contain" 
                                    />
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
