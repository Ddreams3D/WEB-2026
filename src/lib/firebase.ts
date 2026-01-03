import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
};

export const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 0 &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'undefined' &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'null';

// Initialize Firebase only if configured
let app: FirebaseApp | null;
let db: Firestore | null;
let auth: Auth | null;
let storage: FirebaseStorage | null;
let analytics: Analytics | null;

if (isFirebaseConfigured) {
  // Check if apps are already initialized to avoid "Firebase: Firebase App named '[DEFAULT]' already exists" error
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  
  // Initialize Analytics only on client side
  if (typeof window !== 'undefined') {
    isSupported().then(supported => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    });
  }
} else {
  console.warn('Firebase not configured. Using mock mode.');
  // Export nulls or mocks to prevent crashes on import, 
  // but consumers must check isFirebaseConfigured or existence of these objects
  app = null;
  db = null;
  auth = null;
  storage = null;
  analytics = null;
}

export { db, auth, storage, analytics };
export default app;
