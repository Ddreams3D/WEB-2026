import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { Service } from '@/shared/types/domain';
import { useServiceForm } from '../hooks/useServiceForm';
import { ServiceModalGeneral } from './service-modal/ServiceModalGeneral';
import { ServiceModalDetails } from './service-modal/ServiceModalDetails';
import { ServiceModalContent } from './service-modal/ServiceModalContent';
import { ServiceModalImages } from './service-modal/ServiceModalImages';
import { ServiceModalSeo } from './service-modal/ServiceModalSeo';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Service>) => void;
  service?: Service | null;
}

export default function ServiceModal({ isOpen, onClose, onSave, service }: ServiceModalProps) {
  const {
    formData,
    categories,
    activeTabId,
    setActiveTabId,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {service ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="info">Info Básica</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="content">Contenido (Tabs)</TabsTrigger>
                <TabsTrigger value="images">Imágenes</TabsTrigger>
                <TabsTrigger value="seo">SEO y Tags</TabsTrigger>
              </TabsList>

              {/* TAB: INFO BÁSICA */}
              <TabsContent value="info" className="space-y-6">
                <ServiceModalGeneral
                    formData={formData}
                    handleChange={handleChange}
                    handleCheckboxChange={handleCheckboxChange}
                    categories={categories}
                />
              </TabsContent>

              {/* TAB: DETALLES */}
              <TabsContent value="details" className="space-y-6">
                <ServiceModalDetails
                    formData={formData}
                    handleChange={handleChange}
                    updateSpecs={updateSpecs}
                />
              </TabsContent>

              {/* TAB: CONTENIDO (TABS) */}
              <TabsContent value="content" className="space-y-6">
                <ServiceModalContent
                    formData={formData}
                    handleChange={handleChange}
                    activeTabId={activeTabId}
                    setActiveTabId={setActiveTabId}
                    addTab={addTab}
                    updateTab={updateTab}
                    removeTab={removeTab}
                />
              </TabsContent>

              {/* TAB: IMÁGENES */}
              <TabsContent value="images" className="space-y-6">
                <ServiceModalImages
                    formData={formData}
                    handleImageUploaded={handleImageUploaded}
                    removeImage={removeImage}
                    setIsImageUploading={setIsImageUploading}
                />
              </TabsContent>

              {/* TAB: SEO */}
              <TabsContent value="seo" className="space-y-6">
                <ServiceModalSeo
                    formData={formData}
                    handleChange={handleChange}
                    updateTags={updateTags}
                />
              </TabsContent>
            </Tabs>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 rounded-b-2xl flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="service-form"
            disabled={isSubmitting || isImageUploading}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Guardando...' : isImageUploading ? 'Subiendo imagen...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}
