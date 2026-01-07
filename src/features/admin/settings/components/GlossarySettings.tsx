"use client"

import React, { useState } from 'react';
import { useGlossary } from '../hooks/useGlossary';
import { useNotifications } from '@/contexts/NotificationContext';
import { GLOSSARY_CATEGORIES } from '@/services/glossary.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Search, Pencil, Eye, BookOpen, Plus, Trash2, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlossaryItem, GlossaryCategory } from '@/shared/types/glossary';

import { CategoryViewer } from './CategoryViewer';
import { SectionGuidelines } from './SectionGuidelines';

export function GlossarySettings() {
  const { items, loading, saving, updateItem, addItem, removeItem, saveGlossary } = useGlossary();
  const { addLocalNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // New Item State
  const [newItem, setNewItem] = useState<Partial<GlossaryItem>>({
    term: '',
    definition: '',
    category: 'core'
  });

  const handleAddItem = () => {
    if (!newItem.term || !newItem.definition || !newItem.category) return;
    
    const id = newItem.term.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    addItem({
      id,
      term: newItem.term,
      definition: newItem.definition,
      category: newItem.category,
      lastUpdated: new Date().toISOString()
    } as GlossaryItem);

    addLocalNotification('Glosario', `Término "${newItem.term}" añadido`, 'success');

    setNewItem({ term: '', definition: '', category: 'core' });
    setIsAddDialogOpen(false);
  };

  const handleSaveAll = async () => {
    await saveGlossary();
    addLocalNotification('Sistema', 'Cambios guardados correctamente', 'success');
  };

  const handleUpdateItem = (id: string, definition: string) => {
    updateItem(id, definition);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    addLocalNotification('Glosario', 'Término eliminado', 'warning');
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Order categories as defined in GLOSSARY_CATEGORIES
  const orderedCategories = Object.keys(GLOSSARY_CATEGORIES).filter(cat => groupedItems[cat]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            Centro de Documentación
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Base de conocimiento y definiciones del sistema.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-card border shadow-sm p-1.5 rounded-xl px-3">
            <Label htmlFor="edit-mode" className="text-sm font-medium cursor-pointer flex items-center gap-2 select-none">
              {isEditMode ? <Pencil className="w-4 h-4 text-primary" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              <span className={isEditMode ? "text-foreground" : "text-muted-foreground"}>
                {isEditMode ? "Modo Edición" : "Modo Lectura"}
              </span>
            </Label>
            <Switch 
              id="edit-mode" 
              checked={isEditMode} 
              onCheckedChange={setIsEditMode}
            />
          </div>

          <Button 
            onClick={handleSaveAll} 
            disabled={saving || !isEditMode} 
            size="lg"
            className={isEditMode ? "shadow-lg shadow-primary/20" : "opacity-50"}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar Todo
          </Button>
        </div>
      </div>

      <SectionGuidelines 
        title="Diccionario del Negocio (La Verdad Absoluta)"
        description="Aquí se definen los términos oficiales del proyecto. Si no está aquí, no existe. Esto evita que llamemos 'Cesta' al 'Carrito' o 'Admin' al 'Editor'."
        dos={[
          "Define entidades de negocio (Producto, Servicio, Pedido).",
          "Aclara estados confusos (¿Qué diferencia hay entre 'Pendiente' y 'Procesando'?)",
          "Establece nombres oficiales de módulos (ej. 'Universal Editor')."
        ]}
        donts={[
          "NO definas componentes visuales (Botón, Modal) -> Usa 'Vocabulario'.",
          "NO expliques librerías técnicas (React, Next.js) -> Usa 'Arquitectura'.",
          "NO inventes términos nuevos sin consultarlo antes."
        ]}
      />

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar términos..." 
            className="pl-9 h-12 bg-muted/30 border-muted-foreground/20 focus-visible:bg-background transition-all"
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
                  placeholder="Ej. Landing Page"
                  value={newItem.term}
                  onChange={(e) => setNewItem({ ...newItem, term: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={newItem.category} 
                  onValueChange={(value) => setNewItem({ ...newItem, category: value as GlossaryCategory })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GLOSSARY_CATEGORIES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="definition">Definición</Label>
                <Textarea
                  id="definition"
                  placeholder="Explica qué es y para qué sirve..."
                  className="min-h-[100px]"
                  value={newItem.definition}
                  onChange={(e) => setNewItem({ ...newItem, definition: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddItem} disabled={!newItem.term || !newItem.definition}>
                Guardar Término
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content Grid */}
      <div className="space-y-8">
        {orderedCategories.length > 0 ? (
          <Tabs defaultValue={orderedCategories[0]} className="w-full">
            <div className="mb-8">
              <TabsList className="bg-transparent p-0 h-auto flex flex-wrap gap-2 justify-start w-full">
                {orderedCategories.map(categoryKey => (
                  <TabsTrigger 
                    key={categoryKey} 
                    value={categoryKey}
                    className="px-4 py-2 rounded-full border border-border/50 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary transition-all hover:border-primary/50"
                  >
                    {GLOSSARY_CATEGORIES[categoryKey] || categoryKey}
                    <Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1.5 bg-foreground/10 text-current opacity-70">
                      {groupedItems[categoryKey]?.length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {orderedCategories.map(categoryKey => (
              <TabsContent key={categoryKey} value={categoryKey} className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CategoryViewer 
                  items={groupedItems[categoryKey] || []} 
                  isEditMode={isEditMode}
                  onUpdate={handleUpdateItem}
                  onRemove={handleRemoveItem}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-60">
            <div className="p-4 rounded-full bg-muted">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">No se encontraron resultados</h3>
              <p className="text-sm text-muted-foreground">Intenta con otro término o categoría.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
