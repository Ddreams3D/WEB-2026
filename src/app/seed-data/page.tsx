'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { categories } from '@/data/categories.data';
import { products } from '@/data/products.data';
import { users } from '@/data/users.data';
import { reviews } from '@/data/reviews.data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Helper to remove undefined values
const deepClean = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(v => deepClean(v));
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.entries(obj as Record<string, unknown>).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = deepClean(value);
      }
      return acc;
    }, {} as Record<string, unknown>);
  }
  return obj;
};

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const handleSeed = async () => {
    try {
      setStatus('loading');
      setLogs([]);
      addLog('Iniciando migración...');

      if (!db) {
        throw new Error('Firebase Firestore no está inicializado');
      }
      const firestore = db;

      const batch = writeBatch(firestore);
      let count = 0;

      // Categories
      addLog(`Procesando ${categories.length} categorías...`);
      categories.forEach((item) => {
        const ref = doc(collection(firestore, 'categories'), item.id);
        batch.set(ref, deepClean(item));
        count++;
      });

      // Products
      addLog(`Procesando ${products.length} productos...`);
      products.forEach((item) => {
        const ref = doc(collection(firestore, 'products'), item.id);
        batch.set(ref, deepClean(item));
        count++;
      });
      
      // Users
      addLog(`Procesando ${users.length} usuarios...`);
      users.forEach((item) => {
        const ref = doc(collection(firestore, 'users'), item.id);
        batch.set(ref, deepClean(item));
        count++;
      });

      // Reviews
      addLog(`Procesando ${reviews.length} reseñas...`);
      reviews.forEach((item) => {
        const ref = doc(collection(firestore, 'reviews'), item.id);
        batch.set(ref, deepClean(item));
        count++;
      });

      addLog('Enviando datos a Firestore...');
      await batch.commit();

      addLog('¡Migración completada con éxito!');
      setStatus('success');
      setMessage(`Se han migrado ${count} documentos correctamente.`);
    } catch (error: unknown) {
      console.error('Seed error:', error);
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(errorMessage);
      addLog(`ERROR: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Migración de Datos a Firebase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm text-yellow-800">
            Asegúrate de haber creado la base de datos Firestore en modo de prueba (Test Mode) antes de continuar.
          </div>
          
          <Button 
            onClick={handleSeed} 
            disabled={status === 'loading'}
            className="w-full"
          >
            {status === 'loading' ? 'Migrando...' : 'Iniciar Migración'}
          </Button>

          {status === 'error' && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
              Error: {message}
            </div>
          )}

          {status === 'success' && (
            <div className="p-4 bg-green-50 text-green-600 rounded-md border border-green-200">
              {message}
            </div>
          )}

          <div className="mt-4 p-4 bg-gray-100 rounded-md h-64 overflow-y-auto font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
            {logs.length === 0 && <div className="text-gray-400">Los logs aparecerán aquí...</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
