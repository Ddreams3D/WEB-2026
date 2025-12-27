import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { mockCategories, mockProducts, mockUsers, mockReviews } from '@/shared/data/mockData';

// Helper to remove undefined values since Firestore doesn't support them
const deepClean = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => deepClean(v));
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = deepClean(value);
      }
      return acc;
    }, {} as any);
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
    const batch = writeBatch(db);
    let count = 0;

    // Categories
    mockCategories.forEach((item) => {
      const ref = doc(collection(db, 'categories'), item.id);
      batch.set(ref, deepClean(item));
      count++;
    });

    // Products
    mockProducts.forEach((item) => {
      const ref = doc(collection(db, 'products'), item.id);
      batch.set(ref, deepClean(item));
      count++;
    });
    
    // Users
    mockUsers.forEach((item) => {
      const ref = doc(collection(db, 'users'), item.id);
      batch.set(ref, deepClean(item));
      count++;
    });

    // Reviews
    mockReviews.forEach((item) => {
      const ref = doc(collection(db, 'reviews'), item.id);
      batch.set(ref, deepClean(item));
      count++;
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${count} items to Firestore`,
      details: {
        categories: mockCategories.length,
        products: mockProducts.length,
        users: mockUsers.length,
        reviews: mockReviews.length
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
