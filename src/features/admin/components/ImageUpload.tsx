'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ProductImage as ProductImageComponent } from '@/shared/components/ui/DefaultImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, X, ImageIcon, Check, RefreshCw } from '@/lib/icons';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { generateSlug } from '@/lib/utils';
import { ProductImageViewType, ProductImage } from '@/shared/types';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, viewType: ProductImageViewType) => void;
  onRemove: () => void;
  onUploadStatusChange?: (isUploading: boolean) => void;
  defaultName?: string;
  existingImages?: ProductImage[];
}

const VIEW_TYPES: { value: ProductImageViewType; label: string }[] = [
  { value: 'frontal', label: 'Frontal' },
  { value: 'lateral', label: 'Lateral' },
  { value: 'posterior', label: 'Posterior' },
  { value: 'superior', label: 'Superior' },
  { value: 'inferior', label: 'Inferior' },
  { value: 'detalle', label: 'Detalle' },
  { value: 'en_uso', label: 'En Uso' },
  { value: 'empaque', label: 'Empaque' },
  { value: 'otro', label: 'Otro' },
];

// Helper para generar nombre SEO inteligente
const generateSeoFilename = (
  productName: string | undefined, 
  originalFile: File, 
  viewType: ProductImageViewType, 
  existingImages: ProductImage[]
): string => {
  if (!productName) {
    const nameWithoutExt = originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || originalFile.name;
    return generateSlug(nameWithoutExt);
  }

  const baseSlug = generateSlug(productName);
  
  // Contar cuántas imágenes existen de este tipo
  // Filtramos por viewType si está disponible, o intentamos adivinar por el nombre si no (fallback)
  // Pero ahora asumiremos que viewType se guarda correctamente
  const count = existingImages.filter(img => img.viewType === viewType).length;
  const index = count;

  // Si es 'otro' o no definido, usamos numeración secuencial
  if (viewType === 'otro') {
    const suffix = index > 0 ? `-${index + 1}` : '';
    return `${baseSlug}${suffix}`;
  }
  
  // Usamos el tipo de vista en el nombre
  const suffix = index > 0 ? `-${index + 1}` : '';
  return `${baseSlug}-${viewType}${suffix}`;
};

// Helper para comprimir imágenes en el cliente antes de subir
const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
              resolve(file); // Fallback: return original if canvas fails
              return;
          }

          // Max dimensions (Full HD is enough for web product images)
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                  resolve(blob);
              } else {
                  resolve(file); // Fallback
              }
            },
            'image/jpeg',
            0.85 // 85% quality (better for products)
          );
        };
        img.onerror = (err) => {
          console.warn('Image load error, using original file', err);
          resolve(file);
        };
      };
      reader.onerror = (err) => {
        console.warn('FileReader error, using original file', err);
        resolve(file);
      };
    } catch (e) {
      console.warn('Compression error, using original file', e);
      resolve(file);
    }
  });
};

export default function ImageUpload({ value, onChange, onRemove, onUploadStatusChange, defaultName, existingImages = [] }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [selectedViewType, setSelectedViewType] = useState<ProductImageViewType>('otro');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filenameInputRef = useRef<HTMLInputElement>(null);

  // Clean up preview URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (previewUrl && !value) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, value]);

  // Auto-select text when input appears
  useEffect(() => {
    if (selectedFile && !value && filenameInputRef.current) {
        setTimeout(() => filenameInputRef.current?.select(), 100);
    }
  }, [selectedFile, value]);

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
    // For now defaults to 'otro' to force user selection or keep it neutral
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
      console.log('Starting upload process...');
      
      // 1. Comprimir imagen (Critical for Mobile)
      const compressedBlob = await compressImage(selectedFile);
      const fileToUpload = new File([compressedBlob], `${fileName}.jpg`, { 
          type: 'image/jpeg',
          lastModified: Date.now()
      });
      
      if (storage) {
          // FIX: Upload to 'images/catalogo' instead of root 'products'
          const storageRef = ref(storage, `images/catalogo/${Date.now()}_${fileName}.jpg`);
          
          // 2. Upload with Progress Tracking
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
                    onChange(url, selectedViewType);
                    
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
                        onChange(result, selectedViewType);
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

  // 1. Mostrar Preview y Formulario de Renombrado si hay archivo seleccionado pero no subido
  if (selectedFile && !value) {
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Configuración de Imagen</h4>
        
        {/* View Type Selector Chips */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">Tipo de Vista</label>
          <div className="flex flex-wrap gap-2">
            {VIEW_TYPES.map((type) => (
              <button
                type="button"
                key={type.value}
                onClick={() => handleViewTypeChange(type.value)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedViewType === type.value
                    ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            Nombre del archivo (SEO)
          </label>
          <div className="flex">
            <input
              ref={filenameInputRef}
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
              .{selectedFile.name.split('.').pop()}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Se usará: {fileName}.{selectedFile.name.split('.').pop()}
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <Button 
            type="button"
            variant="ghost" 
            size="sm" 
            onClick={handleCancelSelection}
            disabled={isUploading}
            className="h-8"
          >
            Cancelar
          </Button>
          <Button 
            type="button"
            size="sm" 
            onClick={handleUpload}
            disabled={isUploading || !fileName}
            className="h-8 gap-2"
          >
            {isUploading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isSuccess ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            {isUploading ? 'Subiendo' : isSuccess ? '¡Completado!' : 'Confirmar Subida'}
          </Button>
        </div>
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
        <div className="relative">
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border border-border">
            <ProductImageComponent
              src={value}
              alt="Product image"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              onClick={handleRemove}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            variant="outline"
            size="sm"
            className="mt-2 w-full border-dashed border-border hover:bg-accent hover:text-accent-foreground"
          >
            Cambiar imagen
          </Button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="relative cursor-pointer w-full h-48 border-2 border-dashed border-input rounded-lg hover:border-primary transition-all duration-200 bg-muted/10 hover:bg-muted/30 group"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            <div className="p-4 bg-background rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform duration-200">
               <ImageIcon className="h-8 w-8 opacity-70" />
            </div>
            <p className="text-sm font-medium">Haz clic para seleccionar imagen</p>
            <p className="text-xs opacity-60 mt-1 text-center px-4">
              Podrás renombrarla antes de subir (JPG/PNG, máx 10MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
