'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Info, FileText, Layers, Tag, Save, ArrowLeft, LayoutGrid, Box, Check, Eye, Image as ImageIcon } from 'lucide-react';
import { Service } from '@/shared/types/domain';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useServiceForm } from '../hooks/useServiceForm';
import { ServiceModalGeneral } from './service-modal/ServiceModalGeneral';
import { ServiceModalDetails } from './service-modal/ServiceModalDetails';
import { ServiceModalContent } from './service-modal/ServiceModalContent';
import { ServiceModalImages } from './service-modal/ServiceModalImages';
import { ServiceModalSeo } from './service-modal/ServiceModalSeo';
import { ProductCard } from '@/features/catalog/components/ProductCard';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Service>) => void;
  service?: Service | null;
}

export default function ServiceModal({ isOpen, onClose, onSave, service }: ServiceModalProps) {
  const {
    formData,
    setFormData,
    categories,
    activeTabId,
    setActiveTabId,
    activeSection,
    setActiveSection,
    editingBlock,
    setEditingBlock,
    isSubmitting,
    isImageUploading,
    setIsImageUploading,
    handleSubmit,
    handleChange,
    handleCheckboxChange,
    handleImageUploaded,
    removeImage,
    addTab,
    updateTab,
    removeTab,
    updateSpecs,
    updateTags
  } = useServiceForm({ service, onSave, onClose });

  // --- RENDER HELPERS ---
  const sections = [
    { id: 'info', label: 'Info Básica', icon: LayoutGrid },
    { id: 'details', label: 'Detalles', icon: Box },
    { id: 'content', label: 'Contenido', icon: FileText },
    { id: 'images', label: 'Imágenes', icon: ImageIcon },
    { id: 'seo', label: 'SEO', icon: Tag },
  ];

  // Helper to construct preview service from formData
  const previewService: Service = {
    ...formData,
    id: formData.id || 'preview-id',
    kind: 'service',
    name: formData.name || 'Nombre del Servicio',
    description: formData.description || '',
    shortDescription: formData.shortDescription || 'Breve descripción del servicio...',
    price: formData.price || 0,
    images: formData.images || [],
    categoryId: formData.categoryId || 'general',
    categoryName: formData.categoryName || 'Categoría',
    slug: formData.slug || 'preview-slug',
    isActive: formData.isActive ?? true,
    isFeatured: formData.isFeatured ?? false,
    createdAt: formData.createdAt || new Date(),
    updatedAt: new Date(),
    // Service specific
    customPriceDisplay: formData.customPriceDisplay,
    displayOrder: formData.displayOrder || 0,
    tabs: formData.tabs || [],
    tabsTitle: formData.tabsTitle || 'Selecciona tu perfil',
    specifications: formData.specifications || [],
    tags: formData.tags || [],
  } as Service;

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
                <span className="font-bold text-lg hidden lg:block tracking-tight">Editor de Servicios</span>
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
                                    placeholder="Nombre del Servicio..."
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div 
                            onClick={() => setEditingBlock('price')}
                            className={`bg-card rounded-2xl border shadow-sm transition-all cursor-pointer ${editingBlock === 'price' ? 'ring-2 ring-primary' : 'hover:shadow-md'} p-3`}
                        >
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Precio Base</label>
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
                                    name="isActive"
                                    checked={formData.isActive || false}
                                    onChange={handleCheckboxChange}
                                    className="w-6 h-6 rounded-md accent-primary cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                  </motion.div>

                  {/* SECTIONS CONTENT */}
                  <AnimatePresence mode="wait">
                    {activeSection === 'info' && (
                        <ServiceModalGeneral
                            formData={formData}
                            handleChange={handleChange}
                            handleCheckboxChange={handleCheckboxChange}
                            categories={categories}
                        />
                    )}

                    {activeSection === 'details' && (
                        <ServiceModalDetails
                            formData={formData}
                            handleChange={handleChange}
                            updateSpecs={updateSpecs}
                        />
                    )}

                    {activeSection === 'content' && (
                        <ServiceModalContent
                            formData={formData}
                            handleChange={handleChange}
                            activeTabId={activeTabId}
                            setActiveTabId={setActiveTabId}
                            addTab={addTab}
                            updateTab={updateTab}
                            removeTab={removeTab}
                        />
                    )}

                    {activeSection === 'images' && (
                        <ServiceModalImages
                            formData={formData}
                            handleImageUploaded={handleImageUploaded}
                            removeImage={removeImage}
                            setIsImageUploading={setIsImageUploading}
                        />
                    )}

                    {activeSection === 'seo' && (
                        <ServiceModalSeo
                            formData={formData}
                            handleChange={handleChange}
                            updateTags={updateTags}
                        />
                    )}
                  </AnimatePresence>
                </div>

                {/* RIGHT COLUMN: PREVIEW */}
                <div className="hidden xl:block sticky top-8 space-y-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">Vista Previa en Vivo</span>
                    </div>

                    <div className="relative group perspective-1000">
                         {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative transform transition-all duration-300 group-hover:scale-[1.02]">
                            <ProductCard 
                                product={previewService} 
                                className="shadow-2xl ring-1 ring-black/5 dark:ring-white/10" 
                            />
                        </div>
                    </div>

                    <Card className="bg-card/50 backdrop-blur border-primary/20">
                        <CardContent className="p-4 space-y-3">
                            <h4 className="font-semibold flex items-center gap-2 text-sm">
                                <Info className="w-4 h-4 text-primary" />
                                Tips para Servicios
                            </h4>
                            <ul className="text-xs space-y-2 text-muted-foreground">
                                <li className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    Usa imágenes de alta calidad (ratio 1:1 recomendado).
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    Configura las pestañas de contenido para diferentes perfiles de cliente.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    El precio base es referencial, usa "Cotización personalizada" si es variable.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
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
