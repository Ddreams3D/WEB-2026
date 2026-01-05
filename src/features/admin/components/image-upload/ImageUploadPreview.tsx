import React from 'react';
import { ProductImage as ProductImageComponent } from '@/shared/components/ui/DefaultImage';
import { Button } from '@/components/ui/button';
import { X } from '@/lib/icons';

interface ImageUploadPreviewProps {
    value: string;
    handleRemove: () => void;
    handleClick: () => void;
    isUploading: boolean;
}

export function ImageUploadPreview({
    value,
    handleRemove,
    handleClick,
    isUploading
}: ImageUploadPreviewProps) {
    return (
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
    );
}
