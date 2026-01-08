import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth-admin';

export async function GET() {
  try {
    const isValid = await verifyAdminSession();
    
    if (isValid) {
      return NextResponse.json({ authenticated: true });
    }
    
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}
