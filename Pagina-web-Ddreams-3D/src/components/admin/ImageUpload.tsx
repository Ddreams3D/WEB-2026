'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, X, ImageIcon } from '@/lib/icons';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      
      // Simular subida de imagen creando una URL temporal
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // En un entorno real, aquí subirías la imagen a un servicio como Cloudinary, AWS S3, etc.
        // Por ahora, usamos la URL de datos local
        onChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Product image"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              onClick={handleRemove}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 bg-red-500 text-white rounded-full hover:bg-red-600 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            variant="outline"
            className="mt-2 w-full"
          >
            {isUploading ? 'Subiendo...' : 'Cambiar imagen'}
          </Button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="relative cursor-pointer w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-sm">Subiendo imagen...</p>
              </div>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 mb-4" />
                <p className="text-sm font-medium">Haz clic para subir una imagen</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  PNG, JPG, GIF hasta 5MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}