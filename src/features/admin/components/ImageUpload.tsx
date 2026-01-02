'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, X, ImageIcon } from '@/lib/icons';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
      
      if (storage) {
          const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          onChange(url);
          setIsUploading(false);
      } else {
        // Fallback to Base64 only if storage is not configured (e.g. mock mode)
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            onChange(result);
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }
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
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
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
              className="absolute top-2 right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            variant="outline"
            className="mt-2 w-full border-border hover:bg-accent hover:text-accent-foreground"
          >
            {isUploading ? 'Subiendo...' : 'Cambiar imagen'}
          </Button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="relative cursor-pointer w-full h-48 border-2 border-dashed border-input rounded-lg hover:border-primary transition-colors bg-muted/30 hover:bg-muted/50"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm">Subiendo imagen...</p>
              </div>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm font-medium">Haz clic para subir una imagen</p>
                <p className="text-xs opacity-70 mt-1">
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
