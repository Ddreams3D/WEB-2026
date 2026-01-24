import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Validate Secret Token (Same as hook)
    const secretToken = req.nextUrl.searchParams.get('secret_token');
    if (secretToken !== process.env.SLICER_HOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Database connection unavailable' }, { status: 500 });
    }

    // 2. Fetch Products
    // We only need ID and Name for the dropdown, maybe image for UI flair if we want
    const q = query(
      collection(db, 'products'),
      orderBy('updatedAt', 'desc'),
      limit(100) // Reasonable limit for dropdown
    );

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || 'Sin Nombre',
      imageUrl: doc.data().images?.[0]?.url || null
    }));

    return NextResponse.json(products);

  } catch (error) {
    console.error('[ProductsList] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
