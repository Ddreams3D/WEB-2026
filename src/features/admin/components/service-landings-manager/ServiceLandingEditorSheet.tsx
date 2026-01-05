import React from 'react';
import { 
  LayoutTemplate, 
  Search, 
  Sparkles,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet } from "@/components/ui/simple-sheet";
import { Textarea } from "@/components/ui/textarea";
import { ServiceLandingConfig } from '@/shared/types/service-landing';

interface ServiceLandingEditorSheetProps {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    currentLanding: ServiceLandingConfig | null;
    updateField: (field: keyof ServiceLandingConfig, value: any) => void;
}

export function ServiceLandingEditorSheet({
    isEditing,
    setIsEditing,
    currentLanding,
    updateField
}: ServiceLandingEditorSheetProps) {
  if (!currentLanding) return null;

  return (
    <Sheet 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)}
        title="Editor de Landing"
        description="Configura el contenido y diseño de tu landing page."
        className="sm:max-w-xl md:max-w-4xl"
        underHeader={true}
    >
        <div className="flex flex-col lg:flex-row gap-8 h-full pb-8">
                {/* Left Column: Form */}
                <div className="flex-1 space-y-6 pb-20">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="content">Contenido</TabsTrigger>
                            <TabsTrigger value="style">Estilo</TabsTrigger>
                        </TabsList>

                        {/* General Tab */}
                        <TabsContent value="general" className="space-y-6 animate-in fade-in-50 slide-in-from-left-2">
                            <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <LayoutTemplate className="w-4 h-4" />
                                    Configuración Básica
                                </h3>
                                
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label>Nombre Interno</Label>
                                        <Input 
                                            value={currentLanding.name} 
                                            onChange={(e) => updateField('name', e.target.value)}
                                            placeholder="Ej: Landing Impresión Resina"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug URL</Label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground bg-muted px-2 py-2 rounded-md border">
                                                /servicios/
                                            </span>
                                            <Input 
                                                value={currentLanding.slug} 
                                                onChange={(e) => updateField('slug', e.target.value)}
                                                placeholder="impresion-resina"
                                                className="font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-background p-3 rounded border">
                                        <div className="space-y-0.5">
                                            <Label>Estado Público</Label>
                                            <p className="text-xs text-muted-foreground">Visible para todos los usuarios</p>
                                        </div>
                                        <Switch 
                                            checked={currentLanding.isActive}
                                            onCheckedChange={(c) => updateField('isActive', c)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    SEO
                                </h3>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label>Meta Título</Label>
                                        <Input 
                                            value={currentLanding.metaTitle} 
                                            onChange={(e) => updateField('metaTitle', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Meta Descripción</Label>
                                        <Textarea 
                                            value={currentLanding.metaDescription} 
                                            onChange={(e) => updateField('metaDescription', e.target.value)}
                                            className="h-20 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Content Tab */}
                        <TabsContent value="content" className="space-y-6 animate-in fade-in-50 slide-in-from-left-2">
                            {/* Dynamic Sections Manager would go here */}
                            <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-muted/5">
                                <Sparkles className="w-8 h-8 text-muted-foreground/50 mb-4" />
                                <h3 className="font-medium">Gestor de Secciones</h3>
                                <p className="text-sm text-muted-foreground mt-2 mb-4">
                                    Aquí podrás arrastrar y soltar bloques de contenido (Hero, Features, CTA, etc.)
                                    <br/>
                                    <span className="text-xs opacity-70">(Próximamente en la siguiente iteración)</span>
                                </p>
                                <Button variant="outline" size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Añadir Sección
                                </Button>
                            </div>
                        </TabsContent>

                        {/* Style Tab - Placeholder */}
                        <TabsContent value="style" className="space-y-6 animate-in fade-in-50 slide-in-from-left-2">
                             <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-muted/5">
                                <h3 className="font-medium">Estilos Globales</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Configuración de colores, tipografía y tema.
                                </p>
                             </div>
                        </TabsContent>
                    </Tabs>
                </div>
        </div>
    </Sheet>
  );
}
