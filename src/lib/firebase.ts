import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 0 &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'undefined' &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'null';

// Initialize Firebase only if configured
let app;
let db: any;
let auth: any;
let storage: any;

if (isFirebaseConfigured) {
  // Check if apps are already initialized to avoid "Firebase: Firebase App named '[DEFAULT]' already exists" error
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} else {
  console.warn('Firebase not configured. Using mock mode.');
  // Export nulls or mocks to prevent crashes on import, 
  // but consumers must check isFirebaseConfigured or existence of these objects
  app = null;
  db = null;
  auth = null;
  storage = null;
}

export { db, auth, storage };
export default app;
