'use client';

import { useState } from 'react';
import { SUPPORT_CATEGORIES, SupportCategory, SupportItem, SupportHero } from '@/app/soportes-personalizados/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/features/admin/components/ImageUpload';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { revalidateServiceLandingAction } from '@/actions/service-landings-actions';
import { useRouter } from 'next/navigation';
import { ServiceLandingsService } from '@/services/service-landings.service';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

interface SupportsAdminClientProps {
    initialLanding: ServiceLandingConfig | null;
}

export default function SupportsAdminClient({ initialLanding }: SupportsAdminClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<SupportCategory[]>(SUPPORT_CATEGORIES);
  const [isHeroOpen, setIsHeroOpen] = useState(true);
  
  // Extract hero data from landing config or use defaults
  const [heroData, setHeroData] = useState<SupportHero>({
    title: initialLanding?.sections?.find(s => s.type === 'hero')?.title || 'Soportes personalizados para tus dispositivos',
    subtitle: initialLanding?.sections?.find(s => s.type === 'hero')?.subtitle || 'Ordena tu escritorio y tu zona de juego con soportes diseñados específicamente para tus equipos, sin piezas genéricas.',
    imageUrl: initialLanding?.heroImage || 'https://placehold.co/1600x900/020617/0ea5e9?text=Soportes+personalizados'
  });

  // Hero Handlers
  const handleSaveHero = async () => {
    try {
        let updatedLanding: ServiceLandingConfig;

        if (initialLanding) {
            // Update existing landing
            updatedLanding = {
                ...initialLanding,
                heroImage: heroData.imageUrl,
                sections: initialLanding.sections.map(section => {
                    if (section.type === 'hero') {
                        return {
                            ...section,
                            title: heroData.title,
                            subtitle: heroData.subtitle
                        };
                    }
                    return section;
                })
            };

            // If no hero section existed, add one
            if (!updatedLanding.sections.find(s => s.type === 'hero')) {
                updatedLanding.sections.unshift({
                    id: 'hero-main',
                    type: 'hero',
                    title: heroData.title,
                    subtitle: heroData.subtitle
                });
            }
        } else {
            // Create new landing config if it doesn't exist
            // Use FIXED ID to prevent duplicate/ghost entries
            updatedLanding = {
                id: 'soportes-personalizados-landing', 
                slug: 'soportes-personalizados',
                name: 'Soportes Personalizados',
                isActive: true,
                themeMode: 'system',
                metaTitle: 'Soportes Personalizados | Ddreams 3D',
                metaDescription: 'Colección exclusiva de soportes personalizados.',
                heroImage: heroData.imageUrl,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                sections: [
                    {
                        id: 'hero-main',
                        type: 'hero',
                        title: heroData.title,
                        subtitle: heroData.subtitle
                    }
                ]
            };
        }

        // 1. Save using Client Service (Direct Firestore Write with Auth)
        await ServiceLandingsService.save(updatedLanding);
        
        // 2. Revalidate Cache via Server Action
        const result = await revalidateServiceLandingAction(updatedLanding.slug);

        if (result.success) {
            toast.success('Portada actualizada correctamente');
            router.refresh();
        } else {
            toast.error(`Error al revalidar: ${result.error}`);
        }
    } catch (error) {
        toast.error('Ocurrió un error inesperado al guardar.');
        console.error(error);
    }
  };

  // ... (Keep existing category/item handlers for now, though they are local-only) ...
  // Category Handlers
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SupportCategory | undefined>(undefined);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupportItem | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: SupportCategory) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = (category: SupportCategory) => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === category.id ? category : c));
      toast.success('Categoría actualizada (Local)');
    } else {
      setCategories([...categories, category]);
      toast.success('Categoría creada (Local)');
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Categoría eliminada (Local)');
    }
  };

  // Item Handlers
  const handleAddItem = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setEditingItem(undefined);
    setItemDialogOpen(true);
  };

  const handleEditItem = (categoryId: string, item: SupportItem) => {
    setSelectedCategoryId(categoryId);
    setEditingItem(item);
    setItemDialogOpen(true);
  };

  const handleSaveItem = (item: SupportItem) => {
    if (!selectedCategoryId) return;

    setCategories(categories.map(cat => {
      if (cat.id !== selectedCategoryId) return cat;
      
      const items = editingItem 
        ? cat.items.map(i => i.id === item.id ? item : i)
        : [...cat.items, item];
        
      return { ...cat, items };
    }));
    toast.success(editingItem ? 'Producto actualizado' : 'Producto añadido');
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    if (confirm('¿Eliminar este producto?')) {
      setCategories(categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        return { ...cat, items: cat.items.filter(i => i.id !== itemId) };
      }));
      toast.success('Producto eliminado');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Soportes Personalizados
                </h1>
                <p className="text-muted-foreground">
                Gestiona las categorías, productos y la portada de la landing.
                </p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
                <a href="/soportes-personalizados" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Ir a la Landing
                </a>
            </Button>
        </div>
      </div>



      <Collapsible open={isHeroOpen} onOpenChange={setIsHeroOpen} className="space-y-2">
        <div className="flex items-center justify-between px-1">
             <h2 className="text-lg font-semibold flex items-center gap-2">
                Configuración de Portada
             </h2>
             <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                    {isHeroOpen ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle Hero Config</span>
                </Button>
            </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Imagen Principal y Textos</CardTitle>
                    <CardDescription>
                        Personaliza la imagen de fondo y los textos principales de la landing.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Imagen de Fondo (Hero)</Label>
                            <div className="border rounded-lg p-4 bg-muted/20">
                                <ImageUpload
                                    value={heroData.imageUrl}
                                    onChange={(url) => setHeroData({ ...heroData, imageUrl: url })}
                                    onRemove={() => setHeroData({ ...heroData, imageUrl: '' })}
                                    defaultName="hero-soportes"
                                    storagePath={StoragePathBuilder.services('soportes-personalizados', 'hero')}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="hero-title">Título Principal</Label>
                                <Input 
                                    id="hero-title"
                                    value={heroData.title}
                                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hero-subtitle">Subtítulo</Label>
                                <Textarea 
                                    id="hero-subtitle"
                                    value={heroData.subtitle}
                                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                                    className="h-32"
                                />
                            </div>
                            <div className="pt-2">
                                <Button onClick={handleSaveHero} className="w-full">
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Cambios de Portada
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Placeholder for categories list which is currently local only */}
      <div className="opacity-50 pointer-events-none filter blur-[1px]">
         <div className="p-4 border border-dashed rounded text-center">
             Categorías y Productos (Próximamente editable en DB)
         </div>
      </div>
    </div>
  );
}
