import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { categories } from '@/data/categories.data';
import { products } from '@/data/products.data';
import { users } from '@/data/users.data';
import { reviews } from '@/data/reviews.data';

export const dynamic = 'force-dynamic';

// Helper to remove undefined values since Firestore doesn't support them
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

export async function GET() {
  // Prevent seeding in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ 
      success: false, 
      error: 'Seeding is disabled in production environment' 
    }, { status: 403 });
  }

  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }
    const firestore = db;
    const batch = writeBatch(firestore);
    let count = 0;

    // Categories
    categories.forEach((item) => {
      const ref = doc(collection(firestore, 'categories'), item.id);
      batch.set(ref, deepClean(item));
      count++;
    });

    // Products
    products.forEach((item) => {
      const ref = doc(collection(firestore, 'products'), item.id);
      batch.set(ref, deepClean(item));
      count++;
    });
    
    // Users
    users.forEach((item) => {
      const ref = doc(collection(firestore, 'users'), item.id);
      batch.set(ref, deepClean(item));
      count++;
    });

    // Reviews
    reviews.forEach((item) => {
      const ref = doc(collection(firestore, 'reviews'), item.id);
      batch.set(ref, deepClean(item));
      count++;
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${count} items to Firestore`,
      details: {
        categories: categories.length,
        products: products.length,
        users: users.length,
        reviews: reviews.length
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
