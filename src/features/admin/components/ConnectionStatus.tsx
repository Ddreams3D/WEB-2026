import React from 'react';
import { Wifi, WifiOff, Database, HardDrive } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase';

export default function ConnectionStatus() {
  const isConnected = isFirebaseConfigured;

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-full ${isConnected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Estado de Conexión</span>
          <span className={`text-sm font-bold ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
            {isConnected ? 'Conectado a Firestore' : 'Modo Offline (Mock)'}
          </span>
        </div>
      </div>

      <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700 mx-2" />

      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
          <Database className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Fuente de Datos</span>
          <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
            {isConnected ? 'Firebase Cloud' : 'Local Storage / Fallback'}
          </span>
        </div>
      </div>
    </div>
  );
}
