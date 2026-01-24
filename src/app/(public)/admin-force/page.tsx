'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminForcePage() {
  const router = useRouter();
  const [status, setStatus] = useState('idle');

  const activateEmergencyAccess = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ddreams_admin_bypass', 'true');
        // También aseguramos el modo oscuro admin
        localStorage.setItem('adminDarkMode', 'true');
        setStatus('success');
        
        setTimeout(() => {
          // Usar window.location.href para forzar una recarga completa y asegurar que
          // AdminProtection lea el localStorage desde cero
          window.location.href = '/admin';
        }, 1500);
      } catch (e) {
        setStatus('error');
      }
    }
  };

  const clearEmergencyAccess = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ddreams_admin_bypass');
      setStatus('cleared');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <ShieldAlert className="h-24 w-24 text-red-500 animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-red-500">
          PANEL DE ACCESO DE EMERGENCIA
        </h1>
        
        <p className="text-gray-400">
          Utilice esta herramienta SOLO si tiene problemas para acceder al panel administrativo.
          Esto forzará el acceso omitiendo las verificaciones de servidor.
        </p>

        <div className="space-y-4 pt-4">
          <Button 
            onClick={activateEmergencyAccess}
            className="w-full h-16 text-xl bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
          >
            🚨 ACTIVAR ACCESO FORCE
          </Button>

          <Button 
            onClick={clearEmergencyAccess}
            variant="outline"
            className="w-full text-gray-400 border-gray-700 hover:bg-gray-800"
          >
            Limpiar Acceso de Emergencia
          </Button>
          
          <Button 
            onClick={() => router.push('/')}
            variant="ghost"
            className="w-full text-gray-500"
          >
            Volver al Inicio
          </Button>
        </div>

        {status === 'success' && (
          <div className="p-4 bg-green-900/50 border border-green-500 rounded-lg flex items-center justify-center gap-2 text-green-400 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="h-6 w-6" />
            <span>Acceso activado. Redirigiendo...</span>
          </div>
        )}
      </div>
    </div>
  );
}
