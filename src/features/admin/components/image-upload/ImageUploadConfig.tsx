import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Check, RefreshCw } from '@/lib/icons';
import { ProductImageViewType } from '@/shared/types';

interface ImageUploadConfigProps {
    selectedFile: File;
    value?: string;
    selectedViewType: ProductImageViewType;
    handleViewTypeChange: (type: ProductImageViewType) => void;
    fileName: string;
    setFileName: (name: string) => void;
    isUploading: boolean;
    isSuccess: boolean;
    handleCancelSelection: () => void;
    handleUpload: () => void;
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

export function ImageUploadConfig({
    selectedFile,
    value,
    selectedViewType,
    handleViewTypeChange,
    fileName,
    setFileName,
    isUploading,
    isSuccess,
    handleCancelSelection,
    handleUpload
}: ImageUploadConfigProps) {
    const filenameInputRef = useRef<HTMLInputElement>(null);

    // Auto-select text when input appears
    useEffect(() => {
        if (selectedFile && !value && filenameInputRef.current) {
            setTimeout(() => filenameInputRef.current?.select(), 100);
        }
    }, [selectedFile, value]);

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
