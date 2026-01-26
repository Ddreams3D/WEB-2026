import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

if (!admin.apps.length) {
  try {
    // 1. Intentar cargar service-account.json local
    // Nota: Esto funciona en local si el archivo existe en la raíz.
    // En producción (Vercel), se debe usar variables de entorno.
    const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
    
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        });
        console.log('[AdminSDK] Inicializado con service-account.json');
    } else {
        throw new Error('service-account.json not found');
    }

  } catch (e) {
    // 2. Intentar Variables de Entorno (Producción)
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        });
        console.log('[AdminSDK] Inicializado con Variables de Entorno');
    } else {
        console.warn('[AdminSDK] No se pudo inicializar: Faltan credenciales.');
    }
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;
