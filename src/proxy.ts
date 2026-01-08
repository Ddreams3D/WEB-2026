import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fallback-secret-please-change-in-prod'
);

export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('ddreams_admin_session');

    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(sessionCookie.value, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      const ip = request.headers.get('x-forwarded-for') || (request as any).ip || 'unknown';
      console.warn('Invalid admin session attempt from:', ip);
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('ddreams_admin_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
