'use client';

import { Button } from '@/components/ui/button';
import { FileText, Layers, Tag, Save, ArrowLeft, LayoutGrid, Box, Check, Eye } from 'lucide-react';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductForm } from '../hooks/useProductForm';
import { ProductModalGeneral } from './product-modal/ProductModalGeneral';
import { ProductModalDetails } from './product-modal/ProductModalDetails';
import { ProductModalContent } from './product-modal/ProductModalContent';
import { ProductModalSeo } from './product-modal/ProductModalSeo';
import { ProductCard } from '@/features/catalog/components/ProductCard';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Product | Service>) => void;
  product?: Product | Service | null;
  forcedType?: 'product' | 'service';
  categoryCounts?: Record<string, number>;
}

export default function ProductModal({ isOpen, onClose, onSave, product, forcedType }: ProductModalProps) {
  const {
    formData,
    setFormData,
    availableCategories,
    setAvailableCategories,
    availableMaterials,
    setAvailableMaterials,
    activeTabId,
    setActiveTabId,
    activeSection,
    setActiveSection,
    isSubmitting,
    isImageUploading,
    slugEditable,
    setSlugEditable,
    editingBlock,
    setEditingBlock,
    newCategoryName,
    setNewCategoryName,
    isAddingCategory,
    setIsAddingCategory,
    handleSubmit,
    handleChange,
    handleCheckboxChange,
    handleImageUploaded
  } = useProductForm({ product, forcedType, onSave, onClose });

  // --- RENDER HELPERS ---
  const sections = [
    { id: 'general', label: 'General', icon: LayoutGrid },
    { id: 'details', label: 'Detalles', icon: Box },
    { id: 'content', label: 'Contenido', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Tag },
  ];

  // Helper to construct preview product from formData
  const previewProduct: Product | Service = {
    ...formData,
    id: formData.id || 'preview-id',
    name: formData.name || 'Nombre del Producto',
    description: formData.description || '',
    shortDescription: formData.shortDescription || 'Breve descripción del producto...',
    price: formData.price || 0,
    images: formData.images || [],
    kind: formData.kind || forcedType || 'product',
    categoryId: formData.categoryId || 'general',
    categoryName: formData.categoryName || 'Categoría',
    slug: formData.slug || 'preview-slug',
    isActive: formData.isActive ?? true,
    isFeatured: formData.isFeatured ?? false,
    rating: formData.rating || 5,
    createdAt: formData.createdAt || new Date(),
    updatedAt: new Date(),
    // Default values for other fields to satisfy type
    tags: formData.tags || [],
    options: (formData as Product).options || [],
    specifications: formData.specifications || [],
    tabs: formData.tabs || [],
  } as Product | Service;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-[1600px] h-full max-h-[95vh] bg-background rounded-3xl shadow-2xl border flex overflow-hidden relative ring-1 ring-black/5 dark:ring-white/10"
          >
          {/* 1. LEFT SIDEBAR NAV */}
          <nav className="w-20 lg:w-64 border-r bg-card flex flex-col justify-between h-full z-20 shadow-xl shrink-0">
            <div>
              <div className="p-6 flex items-center gap-3 border-b border-border/50">
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <span className="font-bold text-lg hidden lg:block tracking-tight">Editor de Productos</span>
              </div>
              <div className="p-4 space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      activeSection === section.id 
                        ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <section.icon className={`w-5 h-5 ${activeSection === section.id ? 'animate-pulse' : ''}`} />
                    <span className="font-medium hidden lg:block">{section.label}</span>
                    {activeSection === section.id && (
                        <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden lg:block" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-muted/20">
              <Button 
                onClick={() => handleSubmit()} 
                disabled={isSubmitting || isImageUploading}
                className="w-full h-12 rounded-xl font-semibold shadow-lg hover:shadow-primary/20 transition-all"
              >
                {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Layers className="w-5 h-5" />
                    </motion.div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        <span className="hidden lg:inline">Guardar Cambios</span>
                    </div>
                )}
              </Button>
            </div>
          </nav>

          {/* 2. MAIN CANVAS AREA */}
          <main className="flex-1 overflow-y-auto bg-neutral-50/50 dark:bg-neutral-900/50 relative scroll-smooth">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4]" 
                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
            />
            
            <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8 relative z-10">
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 items-start">
                
                {/* LEFT COLUMN: FORM EDITORS */}
                <div className="space-y-6 pb-20">
                  
                  {/* HERO SECTION (Always Visible) */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Editable Title */}
                    <div className="group relative">
                        {editingBlock === 'title' ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    placeholder="Nombre del Producto..."
                                    autoFocus
                                    onBlur={() => setEditingBlock(null)}
                                    className="w-full font-extrabold bg-transparent border-b-2 border-primary focus:ring-0 p-0 placeholder:text-muted-foreground/40 text-foreground tracking-tight text-3xl lg:text-4xl"
                                />
                                <Button size="icon" variant="ghost" onClick={() => setEditingBlock(null)}><Check className="w-6 h-6 text-green-500" /></Button>
                            </div>
                        ) : (
                            <h1 
                                onClick={() => setEditingBlock('title')}
                                className="font-extrabold text-foreground tracking-tight cursor-text hover:text-primary/80 transition-colors text-3xl lg:text-4xl"
                            >
                                {formData.name || <span className="text-muted-foreground opacity-50 italic">Sin Nombre</span>}
                            </h1>
                        )}
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div 
                            onClick={() => setEditingBlock('price')}
                            className={`bg-card rounded-2xl border shadow-sm transition-all cursor-pointer ${editingBlock === 'price' ? 'ring-2 ring-primary' : 'hover:shadow-md'} p-3`}
                        >
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Precio</label>
                            {editingBlock === 'price' ? (
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xl font-medium text-muted-foreground">S/</span>
                                    <input 
                                        type="number" 
                                        name="price"
                                        value={formData.price ?? 0}
                                        onChange={handleChange}
                                        autoFocus
                                        onBlur={() => setEditingBlock(null)}
                                        className="text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 w-full"
                                        placeholder="0.00"
                                    />
                                </div>
                            ) : (
                                <div className="text-2xl font-bold mt-1">S/ {formData.price?.toFixed(2) || '0.00'}</div>
                            )}
                        </div>
                        
                        {formData.kind === 'product' && (
                            <div 
                                onClick={() => setEditingBlock('stock')}
                                className={`bg-card rounded-2xl border shadow-sm transition-all cursor-pointer ${editingBlock === 'stock' ? 'ring-2 ring-primary' : 'hover:shadow-md'} p-3`}
                            >
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</label>
                                {editingBlock === 'stock' ? (
                                    <input 
                                        type="number" 
                                        name="stock"
                                        value={formData.stock ?? 0}
                                        onChange={handleChange}
                                        autoFocus
                                        onBlur={() => setEditingBlock(null)}
                                        className="text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 w-full mt-1"
                                    />
                                ) : (
                                    <div className="text-2xl font-bold mt-1">{formData.stock || 0} u.</div>
                                )}
                            </div>
                        )}

                        <div className="bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow flex items-center justify-between p-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</label>
                                <div className="mt-1 font-semibold text-lg flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                    {formData.isActive ? 'Publicado' : 'Borrador'}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isActive || false}
                                    onChange={(e) => handleCheckboxChange('isActive', e.target.checked)}
                                    className="w-6 h-6 rounded-md accent-primary cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                  </motion.div>

                  {/* SECTIONS CONTENT */}
                  <AnimatePresence mode="wait">
                    {activeSection === 'general' && (
                        <ProductModalGeneral
                            formData={formData}
                            setFormData={setFormData}
                            editingBlock={editingBlock}
                            setEditingBlock={setEditingBlock}
                            availableCategories={availableCategories}
                            setAvailableCategories={setAvailableCategories}
                            newCategoryName={newCategoryName}
                            setNewCategoryName={setNewCategoryName}
                            isAddingCategory={isAddingCategory}
                            setIsAddingCategory={setIsAddingCategory}
                            isImageUploading={isImageUploading}
                            handleImageUploaded={handleImageUploaded}
                        />
                    )}

                    {activeSection === 'details' && (
                        <ProductModalDetails
                            formData={formData}
                            setFormData={setFormData}
                            availableMaterials={availableMaterials}
                            setAvailableMaterials={setAvailableMaterials}
                        />
                    )}

                    {activeSection === 'content' && (
                        <ProductModalContent
                            formData={formData}
                            setFormData={setFormData}
                            activeTabId={activeTabId}
                            setActiveTabId={setActiveTabId}
                        />
                    )}

                    {activeSection === 'seo' && (
                        <ProductModalSeo
                            formData={formData}
                            setFormData={setFormData}
                            slugEditable={slugEditable}
                            setSlugEditable={setSlugEditable}
                        />
                    )}
                  </AnimatePresence>
                </div>

                {/* RIGHT COLUMN: PREVIEW SIDEBAR */}
                <div className="hidden xl:block sticky top-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
                        <Eye className="w-5 h-5" />
                        Vista Previa en Vivo
                    </h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        Tarjeta de Producto
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                        <ProductCard 
                            product={previewProduct} 
                            showAddToCart={true}
                            className="bg-card shadow-xl"
                        />
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 border border-dashed border-muted-foreground/20 text-sm text-muted-foreground space-y-2">
                    <p className="font-medium text-foreground">💡 Tips de Edición:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Usa imágenes cuadradas (1:1) o 4:3 para mejor visualización.</li>
                        <li>El precio tachado aparecerá si llenas el "Precio Original".</li>
                        <li>La etiqueta "Bajo Pedido" se muestra automáticamente.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
