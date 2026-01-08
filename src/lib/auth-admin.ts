import { env } from '@/lib/env';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

// Secret key for signing tokens (Must be strong and kept secret)
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fallback-secret-please-change-in-prod'
);

const ALG = 'HS256';

interface GoogleUser {
  localId: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  photoUrl?: string;
  lastLoginAt: string;
  createdAt: string;
}

/**
 * Signs a new Admin Session JWT.
 * Valid for 24 hours.
 */
export async function signAdminSession(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

/**
 * Verifies if the current request has a valid admin session cookie.
 * Use this in Server Actions to protect sensitive operations.
 */
export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('ddreams_admin_session');

  if (!sessionCookie?.value) return false;

  try {
    const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
    return payload.role === 'admin';
  } catch (error) {
    // Token invalid or expired
    return false;
  }
}

/**
 * Verifies a Firebase ID Token using the Google Identity Toolkit REST API.
 * This is a server-side helper to verify tokens without the Firebase Admin SDK.
 * 
 * @param idToken The Firebase ID Token sent from the client
 * @returns The user object if valid, null otherwise
 */
export async function verifyIdToken(idToken: string): Promise<GoogleUser | null> {
  if (!env?.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.error('[AuthAdmin] Missing Firebase API Key');
    return null;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.warn('[AuthAdmin] Token verification failed:', error.error?.message);
      return null;
    }

    const data = await response.json();
    if (data.users && data.users.length > 0) {
      return data.users[0] as GoogleUser;
    }

    return null;
  } catch (error) {
    console.error('[AuthAdmin] Error verifying token:', error);
    return null;
  }
}
