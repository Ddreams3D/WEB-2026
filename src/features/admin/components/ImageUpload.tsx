'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ProductImageViewType, ProductImage } from '@/shared/types';
import { compressImage, generateSeoFilename } from '@/features/admin/utils/image-upload-utils';
import { ImageUploadConfig } from './image-upload/ImageUploadConfig';
import { ImageUploadDropzone } from './image-upload/ImageUploadDropzone';
import { ImageUploadPreview } from './image-upload/ImageUploadPreview';
import { STORAGE_PATHS } from '@/shared/constants/storage-paths';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';
import { StoragePickerModal } from './storage-manager/StoragePickerModal';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, viewType?: ProductImageViewType, originalFilename?: string) => void;
  onRemove: () => void;
  onUploadStatusChange?: (isUploading: boolean) => void;
  defaultName?: string;
  existingImages?: ProductImage[];
  storagePath?: string;
}

export default function ImageUpload({ value, onChange, onRemove, onUploadStatusChange, defaultName, existingImages = [], storagePath = STORAGE_PATHS.PRODUCTS }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [selectedViewType, setSelectedViewType] = useState<ProductImageViewType>('otro');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up preview URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (previewUrl && !value) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, value]);

  const updateUploadingState = (state: boolean) => {
    setIsUploading(state);
    if (onUploadStatusChange) {
      onUploadStatusChange(state);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño inicial (máximo 10MB antes de comprimir)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Intenta con una imagen menor a 10MB.');
      return;
    }

    // Prepare for rename UI
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    // Default to 'frontal' if it's the first image, otherwise 'otro' or maybe 'detalle'
    const initialViewType: ProductImageViewType = existingImages.length === 0 ? 'frontal' : 'otro';
    setSelectedViewType(initialViewType);

    // Suggest a SEO-friendly name based on defaultName or original name
    const smartName = generateSeoFilename(defaultName, file, initialViewType, existingImages);
    setFileName(smartName);
  };

  const handleViewTypeChange = (type: ProductImageViewType) => {
    setSelectedViewType(type);
    if (selectedFile) {
      const smartName = generateSeoFilename(defaultName, selectedFile, type, existingImages);
      setFileName(smartName);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileName) return;

    try {
      updateUploadingState(true);
      setUploadProgress(0);
      
      // 1. Comprimir imagen (Critical for Mobile)
      const compressedBlob = await compressImage(selectedFile);
      const fileToUpload = new File([compressedBlob], `${fileName}.jpg`, { 
          type: 'image/jpeg',
          lastModified: Date.now()
      });
      
      if (storage) {
          // Use provided storagePath or default to 'images/catalogo'
          const finalPath = storagePath.endsWith('/') ? storagePath : `${storagePath}/`;
          const storageRef = ref(storage, `${finalPath}${Date.now()}_${fileName}.jpg`);
          
          // 2. Upload with Progress Tracking
          const safeFileName = fileName ? fileName : `image_${Date.now()}`;
          const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
              console.log(`Upload status: pending (${Math.round(progress)}%)`);
            }, 
            (error: unknown) => {
              console.error('Error uploading image:', error);
              
              let status = 500;
              let message = 'Error desconocido al subir la imagen';
              const code = (error as { code?: string })?.code;

              // Map Firebase Storage errors to HTTP-like status codes for diagnostics
              if (code === 'storage/unauthorized') {
                status = 403;
                message = 'Permiso denegado (403). Verifica las reglas de Firebase Storage y tu sesión.';
                alert(`Upload Failed (403): ${message}\n\nRevisa Storage Rules + estado de auth en el admin.`);
              } else if (code === 'storage/canceled') {
                status = 0;
                message = 'Subida cancelada por el usuario';
              } else if (code === 'storage/quota-exceeded') {
                status = 413; // Payload Too Large / Quota
                message = 'Cuota de almacenamiento excedida (413)';
              } else if (code === 'storage/retry-limit-exceeded') {
                status = 408; // Request Timeout
                message = 'Tiempo de espera agotado (408). Tu conexión es inestable.';
              }

              console.log(`Upload finished with status: ${status} (${code})`);
              
              if (status !== 0) {
                 alert(`Error al subir (${status}): ${message}`);
              }
              
              updateUploadingState(false);
            }, 
            async () => {
              // Upload completed successfully
              try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                console.log('Upload finished with status: 200 (OK)');
                
                // Show success state briefly
                setIsSuccess(true);
                setUploadProgress(100);
                
                // Delay callback and reset to show success UI
                setTimeout(() => {
                    onChange(url, selectedViewType, fileName);
                    
                    // Reset local state
                    updateUploadingState(false);
                    setIsSuccess(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setFileName('');
                    setUploadProgress(0);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }, 1000);
                
              } catch (urlError: unknown) {
                console.error('Error getting download URL:', urlError);
                console.log('Upload finished but URL retrieval failed (500)');
                alert('La imagen se subió pero no se pudo obtener el enlace.');
                updateUploadingState(false);
              }
            }
          );
      } else {
        // Fallback to Base64 (Dev/Mock mode)
        console.log('Modo Desarrollo/Mock: Simulando subida...');
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          console.log(`Mock Upload: ${progress}%`);
          
          if (progress >= 100) {
            clearInterval(interval);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                console.log('Mock Upload Complete. URL length:', result?.length);
                if (result) {
                    // Show success state briefly
                    setIsSuccess(true);
                    
                    setTimeout(() => {
                        onChange(result, selectedViewType, fileName);
                        alert('Imagen simulada subida correctamente (Base64).');
                        
                        updateUploadingState(false);
                        setIsSuccess(false);
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setFileName('');
                        setUploadProgress(0);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }, 500);
                } else {
                    console.error('Error: Mock upload generated empty result');
                    alert('Error en subida simulada: Resultado vacío');
                    updateUploadingState(false);
                }
            };
            reader.readAsDataURL(fileToUpload);
          }
        }, 100);
      }
    } catch (error: unknown) {
      console.error('Error in upload process:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Error inesperado: ${errorMessage}`);
      updateUploadingState(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePickerSelect = (url: string) => {
    // Select image from library, default type 'otro' or 'frontal'
    // Since it's from library, we skip the rename/compress flow
    const type: ProductImageViewType = existingImages.length === 0 ? 'frontal' : 'otro';
    onChange(url, type);
    setIsPickerOpen(false);
  };

  // 1. Mostrar Preview y Formulario de Renombrado si hay archivo seleccionado (sea nuevo o reemplazo)
  if (selectedFile) {
    return (
      <div className="space-y-4">
        {previewUrl && (
           <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border border-border">
               <Image 
                   src={previewUrl} 
                   alt="Preview" 
                   fill 
                   className="object-cover"
               />
           </div>
        )}
        <ImageUploadConfig
            selectedFile={selectedFile}
            value={value}
            selectedViewType={selectedViewType}
            handleViewTypeChange={handleViewTypeChange}
            fileName={fileName}
            setFileName={setFileName}
            isUploading={isUploading}
            isSuccess={isSuccess}
            handleCancelSelection={handleCancelSelection}
            handleUpload={handleUpload}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {value ? (
        <ImageUploadPreview
            value={value}
            handleRemove={handleRemove}
            handleClick={handleClick}
            isUploading={isUploading}
        />
      ) : (
        <div className="space-y-3">
            <ImageUploadDropzone handleClick={handleClick} />
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">O selecciona de la biblioteca</span>
                </div>
            </div>

            <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setIsPickerOpen(true)}
            >
                <FolderOpen className="mr-2 h-4 w-4" />
                Buscar en Catálogo / Soportes
            </Button>
        </div>
      )}

      {isPickerOpen && (
        <StoragePickerModal 
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            onSelect={handlePickerSelect}
            initialPath={storagePath}
        />
      )}
    </div>
  );
}
