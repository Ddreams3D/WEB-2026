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
import AdminProtection from '@/features/admin/components/AdminProtection';

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
    <AdminProtection>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Inicialización de Datos (Seed)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleSeed} 
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Procesando...' : 'Iniciar Migración'}
              </Button>
              {status === 'loading' && <span className="text-muted-foreground animate-pulse">Escribiendo en Firestore...</span>}
            </div>

            {message && (
              <div className={`p-4 rounded-md ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}

            <div className="bg-slate-950 text-slate-50 p-4 rounded-md h-[400px] overflow-y-auto font-mono text-xs">
              {logs.length === 0 ? (
                <span className="text-slate-500">Esperando inicio...</span>
              ) : (
                logs.map((log, i) => <div key={i}>{log}</div>)
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminProtection>
  );
}
