import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { env, isEnvValid } from './env';

const firebaseConfig = isEnvValid ? {
  apiKey: env?.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env?.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env?.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: env?.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
} : {};

export const isFirebaseConfigured = isEnvValid;

// Initialize Firebase only if configured
let app: FirebaseApp | null;
let db: Firestore | null;
let auth: Auth | null;
let storage: FirebaseStorage | null;
let analytics: Analytics | null;

if (isFirebaseConfigured && getApps().length === 0) {
  // Check if apps are already initialized to avoid "Firebase: Firebase App named '[DEFAULT]' already exists" error
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    
    // Initialize Analytics only on client side
    if (typeof window !== 'undefined') {
      isSupported().then(supported => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch(err => console.warn('Analytics not supported:', err));
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    app = null;
    db = null;
    auth = null;
    storage = null;
  }
} else if (getApps().length > 0) {
  // Already initialized
  app = getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  // Analytics might need re-fetching if needed, but usually single instance is fine
} else {
  console.warn('Firebase not configured or invalid ENV. Using mock mode.');
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
