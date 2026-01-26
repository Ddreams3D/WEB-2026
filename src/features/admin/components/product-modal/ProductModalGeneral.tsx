import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Info, Layers, Check, Trash2, Star, ImageIcon, FileText, Globe, ExternalLink, Wand2, Lock, Unlock, RefreshCw, Calculator, Download, Settings2 } from 'lucide-react';
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
import { useEffect, useState, useMemo } from 'react';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFinanceSettings } from '@/features/admin/finances/hooks/useFinanceSettings';
import { SlicingInboxService } from '@/features/admin/production/services/slicing-inbox.service';
import { SlicingInboxItem } from '@/features/admin/production/types';
import { calculateQuoteCosts, calculateSuggestedPrice } from '@/features/admin/quoter/utils/calculations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

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
  slugEditable: boolean;
  setSlugEditable: (editable: boolean) => void;
  handleLockSlug: () => void;
  handleGenerateAI: () => void;
  handleSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isGenerating: boolean;
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
  handleImageUploaded,
  slugEditable,
  setSlugEditable,
  handleLockSlug,
  handleGenerateAI,
  handleSlugChange,
  isGenerating
}) => {
  const { theme } = useTheme();
  const [availableLandings, setAvailableLandings] = useState<ServiceLandingConfig[]>([]);
  const [availableThemes, setAvailableThemes] = useState<SeasonalThemeConfig[]>([]);
  const [loadingLandings, setLoadingLandings] = useState(false);
  const [isAdvancedSeo, setIsAdvancedSeo] = useState(false);

  // Production & Pricing Logic
  const { settings } = useFinanceSettings();
  const [pendingSlices, setPendingSlices] = useState<SlicingInboxItem[]>([]);
  const [isSliceModalOpen, setIsSliceModalOpen] = useState(false);
  const [loadingSlices, setLoadingSlices] = useState(false);

  const handleFetchSlices = async () => {
    setLoadingSlices(true);
    try {
        const items = await SlicingInboxService.getPendingItems();
        setPendingSlices(items);
        setIsSliceModalOpen(true);
    } catch (error) {
        toast.error('Error al cargar inbox de slicing');
    } finally {
        setLoadingSlices(false);
    }
  };

  const handleImportSlice = (item: SlicingInboxItem) => {
    setFormData(prev => ({
        ...prev,
        productionData: {
            ...(prev as any).productionData, // Keep existing fields if any
            lastSliced: new Date().toISOString(),
            grams: item.grams,
            printTimeMinutes: item.time,
            machineType: item.machineType,
            filamentType: item.filamentType,
            fileName: item.fileName,
            qualityProfile: item.qualityProfile,
            printerModel: item.printerModel,
            nozzleDiameter: item.nozzleDiameter,
            totalLayers: item.totalLayers,
            filamentLengthMeters: item.filamentLengthMeters,
        }
    }));
    toast.success('Datos de slicing importados');
    setIsSliceModalOpen(false);
  };

  const pricing = useMemo(() => {
    if (!(formData as any).productionData) return null;
    
    // Check if we have minimal data to calculate
    const { grams, printTimeMinutes, machineType, additionalCosts, customMargin } = (formData as any).productionData;
    if (!grams && !printTimeMinutes) return null;

    const costData = {
        totalMinutes: printTimeMinutes || 0,
        materialWeight: grams || 0,
        humanMinutes: 0,
        extraCost: additionalCosts || 0,
        failureRate: 0,
        machineDetails: [{
            machineId: 'temp',
            machineName: (formData as any).productionData.printerModel || 'Generic',
            type: (machineType?.toLowerCase() === 'resin' ? 'resin' : 'fdm') as 'fdm' | 'resin',
            duration: printTimeMinutes || 0,
            weight: grams || 0
        }]
    };

    const costs = calculateQuoteCosts(costData, settings);
    const marginToUse = customMargin !== undefined ? customMargin : (settings.profitMargin || 50);
    // Round up the suggested price to favor the company (no weird decimals)
    const suggested = Math.ceil(calculateSuggestedPrice(costs, marginToUse));

    return { costs, suggested, marginToUse };
  }, [(formData as any).productionData, settings]);

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

  const formatProductionTime = (minutes: number) => {
    if (!minutes) return '0m';
    const d = Math.floor(minutes / 1440);
    const h = Math.floor((minutes % 1440) / 60);
    const m = Math.floor(minutes % 60);
    
    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const formatWeight = (grams: number) => {
    if (!grams) return '0g';
    if (grams >= 1000) {
      const kgs = Math.floor(grams / 1000);
      const grs = Math.round(grams % 1000);
      return `${kgs} kgs y ${grs} gr`;
    }
    return `${grams}g`;
  };

  const calculateKwh = (minutes: number, type?: string) => {
     if (!minutes) return '0.00';
     const hours = minutes / 60;
     const power = type?.toLowerCase() === 'resin' ? 0.1 : 0.2;
     return (hours * power).toFixed(2);
  };

  return (
    <motion.div 
        key="general"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-4"
    >
        {/* Slug & AI Control */}
        <div className="bg-card rounded-xl border p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">URL & Generación IA</span>
                </div>
                {/* AI Button */}
                <Button 
                    onClick={handleGenerateAI} 
                    disabled={isGenerating || !formData.slug}
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generando...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Generar Contenido
                        </>
                    )}
                </Button>
            </div>
            
            <div className="flex gap-2">
                 <div className="relative flex-1">
                    <input 
                        type="text" 
                        value={formData.slug || ''}
                        onChange={handleSlugChange}
                        disabled={!slugEditable}
                        placeholder="slug-del-producto"
                        className={`w-full pl-3 pr-10 py-2 rounded-lg border ${slugEditable ? 'bg-background border-input' : 'bg-muted border-transparent text-muted-foreground'} text-sm font-mono focus:ring-2 focus:ring-primary/20 transition-all`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 rounded-full hover:bg-muted"
                            onClick={handleLockSlug}
                            title={slugEditable ? "Bloquear URL" : "Desbloquear URL"}
                        >
                            {slugEditable ? <Unlock className="w-3 h-3 text-amber-500" /> : <Lock className="w-3 h-3 text-green-600" />}
                        </Button>
                    </div>
                 </div>
            </div>
            <p className="text-[11px] text-muted-foreground flex gap-4">
                <span>1. Define Slug (ej. maceta-groot)</span>
                <span>2. Bloquea & Sube Imagen</span>
                <span>3. Generar con IA</span>
            </p>
        </div>

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

        {/* Production & Pricing Block */}
        <div className="bg-card rounded-xl border p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Producción & Precio Sugerido</span>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleFetchSlices}
                    className="h-8 text-xs"
                    disabled={loadingSlices}
                >
                    <Download className={`w-3 h-3 mr-2 ${loadingSlices ? 'animate-bounce' : ''}`} />
                    Importar Slicer
                </Button>
            </div>

            {/* Production Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/30 p-3 rounded-lg border border-dashed">
                <div>
                    <Label className="text-[10px] text-muted-foreground uppercase">Peso</Label>
                    <div className="font-mono text-sm font-medium">
                        {formatWeight((formData as any).productionData?.grams || 0)}
                    </div>
                </div>
                <div>
                    <Label className="text-[10px] text-muted-foreground uppercase">Tiempo</Label>
                    <div className="font-mono text-sm font-medium">
                        {formatProductionTime((formData as any).productionData?.printTimeMinutes || 0)}
                    </div>
                </div>
                <div>
                    <Label className="text-[10px] text-muted-foreground uppercase">Material (Soles)</Label>
                    <div className="font-mono text-sm font-medium">
                        {pricing?.costs.material.toFixed(2) || '0.00'}
                    </div>
                </div>
                 <div>
                    <Label className="text-[10px] text-muted-foreground uppercase">Energía (kWh)</Label>
                    <div className="font-mono text-sm font-medium">
                        {calculateKwh((formData as any).productionData?.printTimeMinutes, (formData as any).productionData?.machineType)}
                    </div>
                </div>
            </div>

            {/* Extra Costs & Margin Inputs */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4 border-dashed">
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Costos Extra (Pintura/Mano de obra)</Label>
                    <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">S/.</span>
                        <input 
                            type="number" 
                            min="0"
                            step="0.10"
                            value={(formData as any).productionData?.additionalCosts || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                productionData: {
                                    ...(prev as any).productionData,
                                    additionalCosts: parseFloat(e.target.value) || 0
                                }
                            }))}
                            className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-md bg-background focus:ring-1 focus:ring-primary"
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Margen de Ganancia (%)</Label>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="0"
                            max="1000"
                            value={(formData as any).productionData?.customMargin ?? settings.profitMargin ?? 50}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                productionData: {
                                    ...(prev as any).productionData,
                                    customMargin: parseFloat(e.target.value) || 0
                                }
                            }))}
                            className="w-full pl-3 pr-8 py-1.5 text-sm border rounded-md bg-background focus:ring-1 focus:ring-primary"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                    </div>
                </div>
            </div>

            {/* Pricing Result */}
            {pricing && (
                <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <div>
                        <div className="text-xs text-muted-foreground">Costo Base Total</div>
                        <div className="text-sm font-bold text-foreground">
                             S/. {pricing.costs.totalDirect.toFixed(2)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-muted-foreground">Precio Sugerido ({pricing.marginToUse}%)</div>
                        <div className="text-lg font-bold text-primary">
                             S/. {pricing.suggested.toFixed(2)}
                        </div>
                    </div>
                    <Button 
                        size="sm" 
                        onClick={() => setFormData(prev => ({ ...prev, price: Math.ceil(pricing.suggested) }))}
                        title="Aplicar precio sugerido (redondeado)"
                        className="ml-4"
                    >
                        Aplicar
                    </Button>
                </div>
            )}
            
            {/* Fallback Message */}
            {!pricing && (
                 <p className="text-xs text-muted-foreground text-center py-2">
                    Importa datos del slicer para ver costos y sugerencias.
                </p>
            )}
        </div>

        {/* Slicing Import Modal */}
        <Dialog open={isSliceModalOpen} onOpenChange={setIsSliceModalOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Importar desde Slicer</DialogTitle>
                    <DialogDescription>Selecciona un archivo reciente</DialogDescription>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {pendingSlices.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-4">No hay items pendientes.</p>
                    ) : (
                        pendingSlices.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => handleImportSlice(item)}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                            >
                                <div className="space-y-1">
                                    <div className="font-medium text-sm">{item.fileName}</div>
                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                        <span>{item.grams}g</span>
                                        <span>{item.time}m</span>
                                        <Badge variant="outline" className="text-[10px] h-4">{item.machineType}</Badge>
                                    </div>
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                    {formatDistanceToNow(new Date(item.createdAt), { locale: es })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>

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
                    {/* SEO Indexing Control */}
                    <div className="flex flex-col gap-2 mb-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                        {isAdvancedSeo ? (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-muted-foreground">Configuración SEO Avanzada</Label>
                                    <button 
                                        onClick={() => setIsAdvancedSeo(false)}
                                        className="text-[10px] text-primary hover:underline"
                                    >
                                        Volver a modo simple
                                    </button>
                                </div>
                                <Select
                                    value={(() => {
                                        const tags = formData.tags || [];
                                        const noIndex = tags.includes('scope:noindex');
                                        const noFollow = tags.includes('scope:nofollow');
                                        if (noIndex && noFollow) return 'noindex_nofollow';
                                        if (noIndex && !noFollow) return 'noindex_follow';
                                        if (!noIndex && noFollow) return 'index_nofollow';
                                        return 'index_follow';
                                    })()}
                                    onValueChange={(val) => {
                                        const current = (formData.tags || []).filter(t => t !== 'scope:noindex' && t !== 'scope:nofollow');
                                        const newTags = [...current];
                                        if (val === 'noindex_nofollow') {
                                            newTags.push('scope:noindex', 'scope:nofollow');
                                        } else if (val === 'noindex_follow') {
                                            newTags.push('scope:noindex');
                                        } else if (val === 'index_nofollow') {
                                            newTags.push('scope:nofollow');
                                        }
                                        setFormData(prev => ({ ...prev, tags: newTags }));
                                    }}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="index_follow">
                                            <div className="flex flex-col">
                                                <span className="font-medium">Index, Follow (Público)</span>
                                                <span className="text-[10px] text-muted-foreground">Visible en Google, sigue enlaces.</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="noindex_nofollow">
                                            <div className="flex flex-col">
                                                <span className="font-medium">No Index, No Follow (Privado)</span>
                                                <span className="text-[10px] text-muted-foreground">Oculto en Google, no sigue enlaces.</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="noindex_follow">
                                            <div className="flex flex-col">
                                                <span className="font-medium">No Index, Follow (Especial)</span>
                                                <span className="text-[10px] text-muted-foreground">Oculto, pero sigue enlaces internos.</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="index_nofollow">
                                            <div className="flex flex-col">
                                                <span className="font-medium">Index, No Follow (Raro)</span>
                                                <span className="text-[10px] text-muted-foreground">Visible, pero no sigue enlaces.</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Switch
                                        id="seo-index"
                                        checked={!((formData.tags || []).includes('scope:noindex'))}
                                        onCheckedChange={(checked) => {
                                            const current = (formData.tags || []).filter(t => t !== 'scope:noindex' && t !== 'scope:nofollow');
                                            const newTags = [...current];
                                            if (!checked) {
                                                // OFF = No Index, No Follow (Private)
                                                newTags.push('scope:noindex', 'scope:nofollow');
                                            }
                                            // ON = Index, Follow (Public) -> Removed tags
                                            setFormData(prev => ({ ...prev, tags: newTags }));
                                        }}
                                    />
                                    <div className="space-y-0.5">
                                        <Label htmlFor="seo-index" className="text-sm font-medium">Indexación en Google</Label>
                                        <div className="text-[10px] text-muted-foreground">
                                            {!((formData.tags || []).includes('scope:noindex')) 
                                                ? <span className="text-green-600 font-medium">Visible (Público)</span> 
                                                : <span className="text-amber-600 font-medium">Oculto (Privado)</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsAdvancedSeo(true)}
                                    className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                                    title="Configuración avanzada de robots"
                                >
                                    <Settings2 className="w-3 h-3 mr-1" />
                                    Opciones
                                </Button>
                            </div>
                        )}
                    </div>
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
                        {availableThemes.length > 0 && (
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">Campañas</div>
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

                    {/* Landing Prices Editor - Added by Expert Logic */}
                    {(() => {
                        const assignedTags = formData.tags || [];
                        const priceConfigs: { key: string; name: string }[] = [];

                        // 1. Check for Service Landings
                        availableLandings.forEach(landing => {
                            const standardTag = `scope:landing-${landing.slug}`;
                            const customTag = landing.featuredTag;
                            
                            const isAssigned = assignedTags.includes(standardTag) || (customTag && assignedTags.includes(customTag));
                            
                            if (isAssigned) {
                                priceConfigs.push({
                                    key: landing.slug,
                                    name: `Landing: ${landing.name}`
                                });
                            }
                        });

                        // 2. Check for Themes
                        availableThemes.forEach(theme => {
                            const standardTag = `scope:landing-${theme.id}`;
                            const customTag = theme.landing?.featuredTag;
                            
                            const isAssigned = assignedTags.includes(standardTag) || (customTag && assignedTags.includes(customTag));
                            
                            if (isAssigned) {
                                if (!priceConfigs.find(c => c.key === theme.id)) {
                                    priceConfigs.push({
                                        key: theme.id,
                                        name: `Campaña: ${theme.name}`
                                    });
                                }
                            }
                        });

                        if (priceConfigs.length === 0) return null;

                        return (
                            <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <span className="bg-orange-100 text-orange-700 p-1 rounded-md"><ExternalLink className="w-3 h-3" /></span>
                                        Precios por Landing
                                    </label>
                                    <span className="text-[10px] text-muted-foreground">Deja vacío para usar precio base</span>
                                </div>
                                <div className="space-y-2">
                                    {priceConfigs.map(config => {
                                        const currentPrice = (formData as Product).landingPrices?.[config.key] ?? '';
                                        const basePrice = (formData as Product).price ?? 0;
                                        
                                        return (
                                            <div key={config.key} className="flex items-center justify-between gap-4 p-2.5 bg-muted/40 rounded-lg border border-border/50 group hover:border-orange-200 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-foreground/90">{config.name}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{config.key}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-muted-foreground">S/</span>
                                                    <input
                                                        type="number"
                                                        value={currentPrice}
                                                        onChange={(e) => {
                                                            const val = e.target.value === '' ? undefined : Number(e.target.value);
                                                            setFormData(prev => {
                                                                const prevProduct = prev as Product;
                                                                const newPrices = { ...(prevProduct.landingPrices || {}) };
                                                                
                                                                if (val === undefined) {
                                                                    delete newPrices[config.key];
                                                                } else {
                                                                    newPrices[config.key] = val;
                                                                }
                                                                
                                                                return { ...prev, landingPrices: newPrices };
                                                            });
                                                        }}
                                                        placeholder={`Base: ${basePrice}`}
                                                        className="w-24 h-8 text-sm bg-background border border-input rounded-md px-2 text-right focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
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
                    defaultName={formData.slug || formData.name}
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
