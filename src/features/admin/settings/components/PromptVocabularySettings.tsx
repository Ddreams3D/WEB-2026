"use client"

import React, { useState } from 'react';
import { usePromptVocabulary } from '../hooks/usePromptVocabulary';
import { useNotifications } from '@/contexts/NotificationContext';
import { PROMPT_VOCAB_CATEGORIES } from '@/services/prompt-vocabulary.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Search, Pencil, Eye, Languages, Plus, Trash2, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { PromptVocabularyItem, PromptVocabularyCategory } from '@/shared/types/prompt-vocabulary';
import { toast } from 'sonner';
import { SectionGuidelines } from './SectionGuidelines';

export function PromptVocabularySettings() {
  const { items, loading, saving, updateItem, addItem, removeItem, save } = usePromptVocabulary();
  const { addLocalNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // New Item State
  const [newItem, setNewItem] = useState<Partial<PromptVocabularyItem>>({
    term: '',
    meaning: '',
    category: 'global',
    aliases: []
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
        <p className="text-muted-foreground">Cargando vocabulario...</p>
      </div>
    );
  }

  const filtered = items.filter(item =>
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.aliases || []).some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const ordered = Object.keys(PROMPT_VOCAB_CATEGORIES).filter(cat => grouped[cat]);

  const handleAddItem = () => {
    if (!newItem.term || !newItem.meaning) {
      toast.error('Nombre y significado son obligatorios');
      return;
    }

    const item: PromptVocabularyItem = {
      id: newItem.term?.toLowerCase().replace(/\s+/g, '-') || crypto.randomUUID(),
      term: newItem.term || '',
      meaning: newItem.meaning || '',
      category: (newItem.category as PromptVocabularyCategory) || 'global',
      aliases: newItem.aliases || [],
      lastUpdated: new Date().toISOString()
    };

    addItem(item);
    addLocalNotification('Vocabulario', `Término "${item.term}" añadido`, 'success');
    setIsAddDialogOpen(false);
    setNewItem({ term: '', meaning: '', category: 'global', aliases: [] });
    toast.success('Término añadido (Recuerda guardar los cambios)');
  };

  const handleSave = async () => {
    await save();
    addLocalNotification('Sistema', 'Vocabulario guardado correctamente', 'success');
  };

  const handleRemove = (id: string) => {
    removeItem(id);
    addLocalNotification('Vocabulario', 'Término eliminado', 'warning');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Languages className="w-8 h-8 text-primary" />
            </div>
            Lenguaje del Proyecto
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Diccionario técnico para que la IA entienda tus "palabras clave" y alias al generar código.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card p-1.5 rounded-lg border shadow-sm">
            <Switch
              id="edit-mode"
              checked={isEditMode}
              onCheckedChange={setIsEditMode}
              className="scale-90"
            />
            <Label htmlFor="edit-mode" className="text-sm font-medium cursor-pointer flex items-center gap-1.5 pr-2 select-none">
              {isEditMode ? (
                <>
                  <Pencil className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary">Modo Edición</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Modo Lectura</span>
                </>
              )}
            </Label>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={saving} 
            size="lg"
            className={cn(
              "shadow-lg transition-all",
              isEditMode ? "shadow-primary/20 hover:shadow-primary/40" : "opacity-80"
            )}
            variant={isEditMode ? 'default' : 'secondary'}
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Cambios
          </Button>
        </div>
      </div>

      <SectionGuidelines 
        title="¿Qué va en el Lenguaje del Proyecto?"
        description="Aquí se definen las 'instrucciones cortas' que la IA debe reconocer para generar código específico."
        dos={[
          "Palabras clave que activan componentes UI (ej. 'Botón Mágico' -> <MagicButton />).",
          "Alias para estructuras de código recurrentes.",
          "Mapeos directos: Término humano -> Código técnico."
        ]}
        donts={[
          "Conceptos teóricos o definiciones largas (Usa 'Glosario').",
          "Reglas éticas o de comportamiento general (Usa 'Reglas de IA').",
          "Explicaciones que no tienen un equivalente en código."
        ]}
      />

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Buscar por término, significado o alias..."
            className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-muted-foreground/20 focus-visible:ring-primary/20 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto h-12 gap-2 shadow-sm">
              <Plus className="w-5 h-5" />
              Nuevo Término
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Término</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="term">Término (Nombre)</Label>
                <Input
                  id="term"
                  placeholder="Ej. Botón Mágico"
                  value={newItem.term}
                  onChange={(e) => setNewItem({ ...newItem, term: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meaning">Significado Técnico</Label>
                <Textarea
                  id="meaning"
                  placeholder="Ej. Componente <MagicButton /> con variante 'glow'..."
                  value={newItem.meaning}
                  onChange={(e) => setNewItem({ ...newItem, meaning: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Categoría</Label>
                  <Select 
                    value={newItem.category} 
                    onValueChange={(val) => setNewItem({ ...newItem, category: val as PromptVocabularyCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROMPT_VOCAB_CATEGORIES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Alias (Opcional)</Label>
                  <Input
                    placeholder="Separa con comas..."
                    value={newItem.aliases?.join(', ')}
                    onChange={(e) => setNewItem({ ...newItem, aliases: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddItem} disabled={!newItem.term || !newItem.meaning}>
                Añadir a la Lista
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      {ordered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-muted/5 rounded-3xl border border-dashed border-muted-foreground/20">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-10" />
          <p className="text-lg">No encontramos nada para "{searchQuery}"</p>
          <Button variant="link" onClick={() => setSearchQuery('')} className="mt-2 text-primary">
            Limpiar búsqueda
          </Button>
        </div>
      ) : (
        <Tabs defaultValue={ordered[0]} className="w-full">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 border rounded-xl gap-1 overflow-x-auto">
              {ordered.map(categoryKey => (
                <TabsTrigger
                  key={categoryKey}
                  value={categoryKey}
                  className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2.5 rounded-lg transition-all text-sm font-medium min-w-fit"
                >
                  {PROMPT_VOCAB_CATEGORIES[categoryKey]}
                  <Badge variant="secondary" className="ml-2 bg-muted-foreground/10 text-muted-foreground text-[10px] h-5 px-1.5 min-w-[1.25rem]">
                    {grouped[categoryKey].length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {ordered.map(categoryKey => (
            <TabsContent key={categoryKey} value={categoryKey} className="mt-6 animate-in slide-in-from-left-2 duration-300">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {grouped[categoryKey].map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      'group relative flex flex-col gap-3 p-5 rounded-2xl border bg-card transition-all duration-300',
                      isEditMode 
                        ? 'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5' 
                        : 'hover:border-border hover:bg-muted/20'
                    )}
                  >
                    {/* Header: Term & ID */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
                        {item.term}
                      </div>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.id)}
                          className="h-8 w-8 -mr-2 -mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Content */}
                    {!isEditMode ? (
                      <div className="space-y-3">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.meaning}
                        </p>
                        {item.aliases && item.aliases.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.aliases.map(alias => (
                              <Badge key={alias} variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-normal bg-muted/30 text-muted-foreground border-transparent">
                                {alias}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 pt-1">
                        <Textarea
                          value={item.meaning}
                          onChange={(e) => updateItem(item.id, { meaning: e.target.value })}
                          className="min-h-[80px] text-sm bg-muted/30 focus:bg-background border-transparent focus:border-input transition-all resize-none"
                          placeholder="Significado..."
                        />
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Alias</Label>
                          <Input
                            value={(item.aliases || []).join(', ')}
                            onChange={(e) => updateItem(item.id, { aliases: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="h-8 text-xs bg-muted/30 focus:bg-background border-transparent focus:border-input"
                            placeholder="Alias..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
