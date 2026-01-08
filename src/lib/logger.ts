import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type LogLevel = 'info' | 'warn' | 'error';

const LOGS_COLLECTION = 'system_logs';

export const Logger = {
  async log(level: LogLevel, message: string, context?: string, metadata?: Record<string, any>) {
    // Always log to console for Vercel/Runtime logs
    const consoleMsg = `[${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
    if (level === 'error') console.error(consoleMsg, metadata);
    else if (level === 'warn') console.warn(consoleMsg, metadata);
    else console.log(consoleMsg, metadata);

    // Only persist errors and critical warnings to Firestore to save costs/latency
    // We prioritize visibility for errors over cost
    if (level === 'error' || (level === 'warn' && process.env.NODE_ENV === 'production')) {
      try {
        // Dynamic import to avoid issues if db is not initialized in some contexts
        if (!db) {
            console.warn('Logger: DB not initialized, skipping Firestore write');
            return;
        }
        
        // Sanitize metadata to ensure it's a plain object and handles circular refs roughly
        const sanitizedMetadata = metadata ? JSON.parse(JSON.stringify(metadata, (key, value) => {
            if (key === 'password' || key === 'token') return '***'; // Basic redaction
            return value;
        })) : {};

        await addDoc(collection(db, LOGS_COLLECTION), {
          level,
          message,
          context: context || 'Global',
          metadata: sanitizedMetadata,
          timestamp: serverTimestamp(),
          environment: process.env.NODE_ENV || 'development'
        });
      } catch (err) {
        // Fallback if Firestore fails (don't throw to avoid crashing the main process)
        console.error('FAILED TO WRITE LOG TO FIRESTORE:', err);
      }
    }
  },

  async info(message: string, context?: string, metadata?: Record<string, any>) {
    return this.log('info', message, context, metadata);
  },

  async warn(message: string, context?: string, metadata?: Record<string, any>) {
    return this.log('warn', message, context, metadata);
  },

  async error(message: string, context?: string, error?: unknown, metadata?: Record<string, any>) {
    let errorMetadata: Record<string, any> = {};
    
    if (error instanceof Error) {
      errorMetadata = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...metadata
      };
    } else {
      errorMetadata = { 
        rawError: String(error),
        ...metadata 
      };
    }
    
    return this.log('error', message, context, errorMetadata);
  }
};
