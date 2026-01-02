import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`p-6 flex gap-4 border-b border-neutral-100 dark:border-neutral-700 ${
          variant === 'danger' ? 'bg-red-50 dark:bg-red-900/20' : 
          variant === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20' : ''
        }`}>
          <div className={`p-3 rounded-full shrink-0 ${
            variant === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' :
            variant === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' :
            'bg-blue-100 text-blue-600'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'destructive' : 'default'}
            className={variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
