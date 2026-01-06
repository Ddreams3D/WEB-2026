'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, Tag, Save, ArrowLeft, LayoutGrid, FileText, Image as ImageIcon, Check } from 'lucide-react';
import { PortfolioItem } from '@/shared/types/domain';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectForm } from '../hooks/useProjectForm';
import { ProjectModalGeneral } from './project-modal/ProjectModalGeneral';
import { ProjectModalMedia } from './project-modal/ProjectModalMedia';
import { ProjectModalContent } from './project-modal/ProjectModalContent';
import { ProjectModalSeo } from './project-modal/ProjectModalSeo';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PortfolioItem>) => void;
  project?: PortfolioItem | null;
}

export default function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const {
    formData,
    setFormData,
    isSubmitting,
    activeSection,
    setActiveSection,
    editingBlock,
    setEditingBlock,
    isImageUploading,
    setIsImageUploading,
    slugEditable,
    setSlugEditable,
    handleChange,
    handleSubmit,
    CATEGORIES,
    availableCategories,
    setAvailableCategories,
    newCategoryName,
    setNewCategoryName,
    isAddingCategory,
    setIsAddingCategory
  } = useProjectForm({ project, onSave, onClose });

  // --- RENDER HELPERS ---
  const sections = [
    { id: 'general', label: 'General', icon: LayoutGrid },
    { id: 'media', label: 'Multimedia', icon: ImageIcon },
    { id: 'content', label: 'Contenido', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Tag },
  ];

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
                  <span className="font-bold text-lg hidden lg:block tracking-tight">Editor de Proyectos</span>
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
                  onClick={() => handleSubmit(new Event('submit') as any)} 
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
                                      value={formData.title || ''}
                                      onChange={(e) => handleChange('title', e.target.value)}
                                      placeholder="Título del Proyecto..."
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
                                  {formData.title || <span className="text-muted-foreground opacity-50 italic">Sin Título</span>}
                              </h1>
                          )}
                      </div>
                    </motion.div>

                    {/* SECTIONS CONTENT */}
                    <AnimatePresence mode="wait">
                      {activeSection === 'general' && (
                          <ProjectModalGeneral
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
                        />
                      )}

                      {activeSection === 'media' && (
                          <ProjectModalMedia
                              formData={formData}
                              setFormData={setFormData}
                              editingBlock={editingBlock}
                              setEditingBlock={setEditingBlock}
                              isImageUploading={isImageUploading}
                              setIsImageUploading={setIsImageUploading}
                          />
                      )}

                      {activeSection === 'content' && (
                          <ProjectModalContent
                              formData={formData}
                              setFormData={setFormData}
                              editingBlock={editingBlock}
                              setEditingBlock={setEditingBlock}
                          />
                      )}

                      {activeSection === 'seo' && (
                          <ProjectModalSeo
                              formData={formData}
                              setFormData={setFormData}
                              slugEditable={slugEditable}
                              setSlugEditable={setSlugEditable}
                          />
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* RIGHT COLUMN: PREVIEW OR ADDITIONAL INFO (Can be used for quick stats or preview) */}
                  <div className="hidden xl:block sticky top-8">
                     {/* Can add a mini preview card here if needed */}
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
