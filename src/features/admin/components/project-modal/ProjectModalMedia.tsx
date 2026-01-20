import React from 'react';
import Image from 'next/image';
import { Layers, ImageIcon, Trash2 } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { PortfolioItem } from '@/shared/types/domain';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ProjectModalMediaProps {
  formData: Partial<PortfolioItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<PortfolioItem>>>;
  editingBlock: string | null;
  setEditingBlock: (block: string | null) => void;
  isImageUploading: boolean;
  setIsImageUploading: (loading: boolean) => void;
}

export const ProjectModalMedia: React.FC<ProjectModalMediaProps> = ({
  formData,
  setFormData,
  editingBlock,
  setEditingBlock,
  isImageUploading,
  setIsImageUploading
}) => {

  const handleCoverUpload = (url: string) => {
    setFormData(prev => ({ ...prev, coverImage: url }));
  };

  const handleGalleryUpload = (url: string) => {
    setFormData(prev => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), url]
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => {
        const newGallery = [...(prev.galleryImages || [])];
        newGallery.splice(index, 1);
        return { ...prev, galleryImages: newGallery };
    });
  };

  return (
    <motion.div 
        key="media"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-8"
    >
        {/* Cover Image */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Imagen de Portada
            </h3>
            <div className="bg-card border rounded-xl p-4">
                <ImageUpload 
                    value={formData.coverImage}
                    onChange={handleCoverUpload}
                    onRemove={() => handleCoverUpload('')}
                    onUploadStatusChange={setIsImageUploading}
                    defaultName={formData.slug || 'proyecto-portada'}
                    storagePath={StoragePathBuilder.projects(formData.slug || 'temp', 'cover')}
                />
            </div>
        </div>

        {/* Gallery */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Galería del Proyecto
            </h3>
            
            <div className="bg-card border rounded-xl p-4 space-y-4">
                {/* Uploader for new images */}
                <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-sm font-medium mb-3 text-muted-foreground">Agregar nueva imagen a la galería:</p>
                    <ImageUpload 
                        onChange={handleGalleryUpload}
                        onRemove={() => {}}
                        onUploadStatusChange={setIsImageUploading}
                        defaultName={`${formData.slug || 'proyecto'}-galeria-${(formData.galleryImages?.length || 0) + 1}`}
                        storagePath={StoragePathBuilder.projects(formData.slug || 'temp', 'gallery')}
                    />
                </div>

                {/* Grid of existing images */}
                {formData.galleryImages && formData.galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <AnimatePresence>
                            {formData.galleryImages.map((url, idx) => (
                                <motion.div
                                    key={`${url}-${idx}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative aspect-square rounded-xl overflow-hidden border bg-muted group"
                                >
                                    <Image 
                                        src={url} 
                                        alt={`Galería ${idx + 1}`} 
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => removeGalleryImage(idx)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                                        {idx + 1}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
  );
};
