import React from 'react';
import { Sheet } from '@/components/ui/simple-sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, Megaphone, Palette } from 'lucide-react';
import { LandingMainConfig } from '@/shared/types/landing';
import { LandingMainEditorContent } from './LandingMainEditorContent';
import { LandingMainEditorVisual } from './LandingMainEditorVisual';
import { LandingMainEditorAnnouncement } from './LandingMainEditorAnnouncement';

interface LandingMainEditorProps {
    form: LandingMainConfig;
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;
    updateField: (key: keyof LandingMainConfig, value: any) => void;
    updateAnnouncement: (updates: Partial<any>) => void;
    handleAddBubble: () => void;
    handleRemoveBubble: (index: number) => void;
    handleUpdateBubble: (index: number, value: string) => void;
}

export function LandingMainEditor({
    form,
    isEditing,
    setIsEditing,
    updateField,
    updateAnnouncement,
    handleAddBubble,
    handleRemoveBubble,
    handleUpdateBubble
}: LandingMainEditorProps) {
  return (
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

                <TabsContent value="content">
                    <LandingMainEditorContent 
                        form={form} 
                        updateField={updateField} 
                    />
                </TabsContent>

                <TabsContent value="visual">
                    <LandingMainEditorVisual
                        form={form}
                        updateField={updateField}
                        handleAddBubble={handleAddBubble}
                        handleRemoveBubble={handleRemoveBubble}
                        handleUpdateBubble={handleUpdateBubble}
                    />
                </TabsContent>

                <TabsContent value="announcement">
                    <LandingMainEditorAnnouncement
                        form={form}
                        updateAnnouncement={updateAnnouncement}
                    />
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-8 border-t mt-8">
                <Button onClick={() => setIsEditing(false)} className="min-w-[120px]">
                    Hecho
                </Button>
            </div>
        </div>
    </Sheet>
  );
}
