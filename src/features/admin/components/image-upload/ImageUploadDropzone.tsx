import React from 'react';
import { ImageIcon } from '@/lib/icons';

interface ImageUploadDropzoneProps {
    handleClick: () => void;
}

export function ImageUploadDropzone({ handleClick }: ImageUploadDropzoneProps) {
    return (
        <div
            onClick={handleClick}
            className="relative cursor-pointer w-full h-48 border-2 border-dashed border-input rounded-lg hover:border-primary transition-all duration-200 bg-muted/10 hover:bg-muted/30 group"
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <div className="p-4 bg-background rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform duration-200">
                    <ImageIcon className="h-8 w-8 opacity-70" />
                </div>
                <p className="text-sm font-medium">Click para subir imagen</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP (Max 10MB)</p>
            </div>
        </div>
    );
}
