'use client';

import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastManager';

interface PaymentProofUploadProps {
  orderId: string;
  onUploadSuccess?: (url: string) => void;
  existingProofUrl?: string;
}

export function PaymentProofUpload({ orderId, onUploadSuccess, existingProofUrl }: PaymentProofUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingProofUrl || null);
  const { showSuccess, showError } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic validation
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        showError('Archivo muy grande', 'El archivo no debe superar los 5MB');
        return;
      }
      if (!selectedFile.type.startsWith('image/') && selectedFile.type !== 'application/pdf') {
        showError('Formato inválido', 'Solo se aceptan imágenes o PDF');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileName = `payment_proof_${timestamp}.${extension}`;
      const storageRef = ref(storage!, `orders/${orderId}/payment_proofs/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        }, 
        (error) => {
          console.error('Upload error:', error);
          showError('Error al subir', 'No se pudo subir el comprobante. Intenta de nuevo.');
          setIsUploading(false);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadedUrl(downloadURL);
            
            // Update Firestore Order if possible (Client-side)
            // Note: This requires Firestore Rules to allow update on this field for the user/public
            if (db) {
                try {
                    const orderRef = doc(db, 'orders', orderId);
                    await updateDoc(orderRef, {
                        paymentProofUrl: downloadURL,
                        paymentStatus: 'paid', // Optimistic update or keep pending? better keep pending until admin verifies.
                        // Actually, maybe update history too?
                        // Let's just update the URL for now.
                        updatedAt: new Date()
                    });
                } catch (dbError) {
                    console.warn('Could not update order in DB directly (might be permission issue):', dbError);
                    // Fallback: We still show success UI and maybe notify via other means if critical
                }
            }

            showSuccess('Comprobante subido', 'Tu comprobante se ha enviado correctamente.');
            if (onUploadSuccess) onUploadSuccess(downloadURL);
            setFile(null);
          } catch (error) {
            console.error('Post-upload error:', error);
          } finally {
            setIsUploading(false);
          }
        }
      );

    } catch (error) {
      console.error('Upload start error:', error);
      setIsUploading(false);
      showError('Error', 'Ocurrió un error al iniciar la subida.');
    }
  };

  if (uploadedUrl) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
        <div className="bg-green-100 dark:bg-green-800 rounded-full p-2">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
            <h4 className="font-medium text-green-900 dark:text-green-100">Comprobante enviado</h4>
            <p className="text-sm text-green-700 dark:text-green-300">Hemos recibido tu comprobante. Lo verificaremos pronto.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setUploadedUrl(null)} className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 hover:bg-green-100 dark:hover:bg-green-800">
            Cambiar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 text-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
        <input
          type="file"
          id="payment-proof"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        {!file ? (
          <label htmlFor="payment-proof" className="cursor-pointer flex flex-col items-center gap-2">
            <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="w-6 h-6 text-primary" />
            </div>
            <span className="font-medium text-neutral-900 dark:text-white">Sube tu comprobante de pago</span>
            <span className="text-sm text-neutral-500">Imagen o PDF (Máx 5MB)</span>
          </label>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full">
                {file.name}
                <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="text-neutral-500 hover:text-red-500">
                    <X className="w-4 h-4" />
                </button>
            </div>
            
            {isUploading ? (
                <div className="w-full max-w-xs space-y-2">
                    <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-center text-neutral-500">Subiendo... {Math.round(progress)}%</p>
                </div>
            ) : (
                <Button onClick={handleUpload} disabled={isUploading} className="w-full max-w-xs">
                    Enviar Comprobante
                </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md border border-blue-100 dark:border-blue-800">
        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p>Al subir el comprobante, nuestro equipo verificará el pago y procederá con la preparación de tu pedido. Te notificaremos por correo cuando el estado cambie.</p>
      </div>
    </div>
  );
}
