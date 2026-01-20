import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Info, Layers, Check, Trash2, Star, ImageIcon, FileText, Globe, ExternalLink } from 'lucide-react';
import { EditableBlock } from '../EditableBlock';
import ImageUpload from '../ImageUpload';
import { StringListEditor } from '../AdminEditors';
import { motion } from 'framer-motion';
import { Product, ProductImage } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { useTheme } from '@/contexts/ThemeContext';
import { THEME_CONFIG } from '@/config/themes';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';
import { cleanAndSlugify } from '@/features/admin/utils/image-upload-utils';
import { extractMetadataFromFilename } from '@/lib/utils';
import { ServiceLandingsService } from '@/services/service-landings.service';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { fetchThemesFromFirestore } from '@/services/seasonal.service';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { useEffect, useState } from 'react';

interface ProductModalGeneralProps {
  formData: Partial<Product | Service>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product | Service>>>;
  editingBlock: string | null;
  setEditingBlock: (block: string | null) => void;
  availableCategories: string[];
  setAvailableCategories: React.Dispatch<React.SetStateAction<string[]>>;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  isAddingCategory: boolean;
  setIsAddingCategory: (isAdding: boolean) => void;
  isImageUploading: boolean;
  handleImageUploaded: (url: string) => void;
}

export const ProductModalGeneral: React.FC<ProductModalGeneralProps> = ({
  formData,
  setFormData,
  editingBlock,
  setEditingBlock,
  availableCategories,
  setAvailableCategories,
  newCategoryName,
  setNewCategoryName,
  isAddingCategory,
  setIsAddingCategory,
  isImageUploading,
  handleImageUploaded
}) => {
  const { theme } = useTheme();
  const [availableLandings, setAvailableLandings] = useState<ServiceLandingConfig[]>([]);
  const [availableThemes, setAvailableThemes] = useState<SeasonalThemeConfig[]>([]);
  const [loadingLandings, setLoadingLandings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoadingLandings(true);
            const [landings, themes] = await Promise.all([
                ServiceLandingsService.getAll(),
                fetchThemesFromFirestore()
            ]);
            setAvailableLandings(landings);
            setAvailableThemes(themes);
        } catch (error) {
            console.error('Error fetching landings/themes:', error);
        } finally {
            setLoadingLandings(false);
        }
    };
    fetchData();
  }, []);

  const getReadableTagName = (tag: string) => {
    if (tag === 'scope:global') return 'Global';
    if (tag === 'scope:hidden') return 'Oculto';
    
    if (tag.startsWith('scope:landing-')) {
        const slug = tag.replace('scope:landing-', '');
        
        // Try to find in services
        const landing = availableLandings.find(l => l.slug === slug);
        if (landing) return `Landing: ${landing.name}`;
        
        // Try to find in themes (by ID or featured tag logic if strictly mapped)
        const theme = availableThemes.find(t => t.id === slug);
        if (theme) return `Campaña: ${theme.name}`;
        
        // Check featured tags from themes
        const themeByTag = availableThemes.find(t => t.landing.featuredTag === tag);
        if (themeByTag) return `Campaña: ${themeByTag.name}`;

        return `Landing: ${slug}`;
    }
    
    return tag;
  };

  return (
    <motion.div 
        key="general"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-4"
    >
        {/* Full Description Block */}
        <EditableBlock
            id="fullDescription"
            title="Descripción Detallada"
            icon={FileText}
            isEditing={editingBlock === 'fullDescription'}
            onEdit={() => setEditingBlock('fullDescription')}
            onSave={() => setEditingBlock(null)}
            onCancel={() => setEditingBlock(null)}
            preview={<p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{formData.description || 'Sin descripción detallada...'}</p>}
        >
            <textarea
                name="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-4 bg-muted/50 rounded-xl border-none focus:ring-1 focus:ring-primary min-h-[150px]"
                placeholder="Descripción completa del producto..."
            />
        </EditableBlock>

        {/* Short Description Block */}
        <EditableBlock
            id="description"
            title="Descripción Corta"
            icon={Info}
            isEditing={editingBlock === 'description'}
            onEdit={() => setEditingBlock('description')}
            onSave={() => setEditingBlock(null)}
            onCancel={() => setEditingBlock(null)}
            preview={<p className="text-muted-foreground leading-relaxed">{formData.shortDescription || 'Sin descripción corta...'}</p>}
        >
            <textarea
                name="shortDescription"
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                className="w-full p-4 bg-muted/50 rounded-xl border-none focus:ring-1 focus:ring-primary min-h-[100px]"
                placeholder="Breve descripción para listados..."
            />
        </EditableBlock>

         {/* Organization Block */}
        <EditableBlock
            id="organization"
            title="Organización"
            icon={Layers}
            isEditing={editingBlock === 'organization'}
            onEdit={() => setEditingBlock('organization')}
            onSave={() => setEditingBlock(null)}
            onCancel={() => setEditingBlock(null)}
            className="z-20 relative" 
            preview={
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs uppercase text-muted-foreground font-semibold">Categoría</div>
                        <div className="font-medium mt-1">{formData.categoryName || 'General'}</div>
                    </div>
                    <div>
                        <div className="text-xs uppercase text-muted-foreground font-semibold">Tags</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags?.map(t => (
                                <span 
                                    key={t} 
                                    className={`px-3 py-1 border rounded-md text-xs font-medium shadow-sm transition-colors ${THEME_CONFIG[theme].badgeClass}`}
                                >
                                    {getReadableTagName(t)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            }
        >
             <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <div className="flex flex-wrap gap-2">
                        {availableCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFormData(prev => ({ ...prev, categoryName: cat }))}
                                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                                    formData.categoryName === cat 
                                        ? 'bg-primary text-primary-foreground border-primary' 
                                        : 'bg-background hover:bg-muted'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                        {/* INLINE CATEGORY CREATION */}
                        {isAddingCategory ? (
                            <div className="flex items-center gap-2 bg-background border rounded-full pl-3 pr-1 py-1 animate-in fade-in slide-in-from-left-5">
                                <input 
                                    type="text" 
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nueva categoría..."
                                    className="bg-transparent border-none text-sm w-32 focus:ring-0 p-0"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && newCategoryName.trim()) {
                                            setAvailableCategories(prev => [...prev, newCategoryName.trim()]);
                                            setFormData(prev => ({ ...prev, categoryName: newCategoryName.trim() }));
                                            setNewCategoryName('');
                                            setIsAddingCategory(false);
                                        } else if (e.key === 'Escape') {
                                            setIsAddingCategory(false);
                                        }
                                    }}
                                />
                                <div className="flex gap-1">
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-6 w-6 rounded-full hover:bg-green-100 text-green-600"
                                        onClick={() => {
                                            if (newCategoryName.trim()) {
                                                setAvailableCategories(prev => [...prev, newCategoryName.trim()]);
                                                setFormData(prev => ({ ...prev, categoryName: newCategoryName.trim() }));
                                                setNewCategoryName('');
                                                setIsAddingCategory(false);
                                            }
                                        }}
                                    >
                                        <Check className="w-3 h-3" />
                                    </Button>
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-6 w-6 rounded-full hover:bg-red-100 text-red-600"
                                        onClick={() => setIsAddingCategory(false)}
                                    >
                                        <Plus className="w-3 h-3 rotate-45" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAddingCategory(true)}
                                className="px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-dashed border-muted-foreground/30 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Agregar
                            </button>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Etiquetas (Tags)</label>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {/* Global Scope */}
                        <button
                            onClick={() => {
                                const current = formData.tags || [];
                                if (!current.includes('scope:global')) {
                                    setFormData(prev => ({ ...prev, tags: [...current, 'scope:global'] }));
                                }
                            }}
                            className="text-xs px-2 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                            <Globe className="w-3 h-3" /> + Global
                        </button>

                        {/* Dynamic Landing Scope Selector */}
                        <div className="flex items-center">
                            <Select
                                value=""
                                onValueChange={(tag) => {
                                    const current = formData.tags || [];
                                    if (!current.includes(tag)) {
                                        setFormData(prev => ({ ...prev, tags: [...current, tag] }));
                                    }
                                }}
                            >
                                <SelectTrigger className="h-7 text-xs w-[160px] px-2 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 rounded-md focus:ring-0 focus:ring-offset-0">
                                    <div className="flex items-center gap-1 truncate w-full">
                                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                        <SelectValue placeholder="+ Asignar Landing" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                    {loadingLandings ? (
                                        <div className="p-2 text-xs text-muted-foreground text-center">Cargando...</div>
                                    ) : (availableLandings.length === 0 && availableThemes.length === 0) ? (
                    <div className="p-2 text-xs text-muted-foreground text-center">No hay landings</div>
                ) : (
                    <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">General</div>
                        <SelectItem value="scope:global" className="text-xs pl-4">
                            Web Principal
                        </SelectItem>

                        {availableThemes.length > 0 && (
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">Campañas</div>
                        )}
                                            {availableThemes.map(theme => {
                                                const tag = theme.landing?.featuredTag || `scope:landing-${theme.id}`;
                                                return (
                                                    <SelectItem key={theme.id} value={tag} className="text-xs pl-4">
                                                        {theme.name}
                                                    </SelectItem>
                                                );
                                            })}

                                            {availableLandings.length > 0 && (
                                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">Servicios</div>
                                            )}
                                            {availableLandings.map(landing => {
                                                const tag = `scope:landing-${landing.slug}`;
                                                return (
                                                    <SelectItem key={landing.id} value={tag} className="text-xs pl-4">
                                                        {landing.name}
                                                    </SelectItem>
                                                );
                                            })}
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                         <button
                            onClick={() => {
                                const current = formData.tags || [];
                                if (!current.includes('scope:hidden')) {
                                    setFormData(prev => ({ ...prev, tags: [...current, 'scope:hidden'] }));
                                }
                            }}
                            className="text-xs px-2 py-1 rounded-md border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            + Oculto
                        </button>
                    </div>
                    <StringListEditor 
                        items={formData.tags || []} 
                        onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                        placeholder="Ej. Novedad"
                    />
                </div>
             </div>
        </EditableBlock>

        {/* Images Block */}
        <EditableBlock
            id="images"
            title="Galería de Imágenes"
            icon={ImageIcon}
            isEditing={editingBlock === 'images'}
            onEdit={() => setEditingBlock('images')}
            onSave={() => setEditingBlock(null)}
            onCancel={() => setEditingBlock(null)}
            className="z-10 relative"
            preview={
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images?.map((img, idx) => (
                        <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group">
                            <Image src={img.url} alt={img.alt || 'Imagen'} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                            {idx === 0 && <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">Principal</div>}
                        </div>
                    ))}
                    {(!formData.images || formData.images.length === 0) && (
                        <div className="col-span-4 py-8 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                            Sin imágenes
                        </div>
                    )}
                </div>
            }
        >
            <div className="space-y-4">
                <ImageUpload 
                    onChange={(url, viewType, fileName) => {
                        handleImageUploaded(url);

                        // Auto-SEO & Metadata Filling from Filename
                        if (fileName) {
                            const metadata = extractMetadataFromFilename(fileName);
                            
                            setFormData(prev => {
                                const newData = { ...prev };
                                let hasChanges = false;

                                // 1. Auto-fill Name
                                if (!newData.name) {
                                    newData.name = metadata.name;
                                    hasChanges = true;
                                    
                                    // Auto-slug
                                    if (!newData.slug) {
                                        newData.slug = cleanAndSlugify(metadata.name);
                                    }
                                }

                                // 2. Auto-fill Short Description
                                if (!newData.shortDescription) {
                                    newData.shortDescription = metadata.name;
                                    hasChanges = true;
                                }

                                // 3. Auto-fill Tags
                                const currentTags = newData.tags || [];
                                const uniqueNewTags = metadata.tags.filter(t => !currentTags.includes(t));
                                
                                if (uniqueNewTags.length > 0) {
                                    newData.tags = [...currentTags, ...uniqueNewTags];
                                    hasChanges = true;
                                }

                                return hasChanges ? newData : prev;
                            });
                        }
                    }} 
                    onRemove={() => handleImageUploaded('')}
                    onUploadStatusChange={(status) => {
                        // If we needed to lift the state up, we could call a handler here.
                        // Currently isImageUploading is passed down but not a setter.
                    }}
                    storagePath={StoragePathBuilder.products(
                        cleanAndSlugify(formData.categoryName || 'general'), 
                        formData.slug || 'temp'
                    )}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {formData.images?.map((img, index) => (
                        <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border bg-muted">
                            <Image src={img.url} alt={img.alt || 'Imagen'} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="rounded-full w-8 h-8"
                                    onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter(i => i.id !== img.id) }))}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                {index !== 0 && (
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-full w-8 h-8"
                                        onClick={() => {
                                            const images = [...(formData.images || [])];
                                            const [moved] = images.splice(index, 1);
                                            images.unshift(moved);
                                            setFormData(prev => ({ ...prev, images }));
                                        }}
                                    >
                                        <Star className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </EditableBlock>
    </motion.div>
  );
};
