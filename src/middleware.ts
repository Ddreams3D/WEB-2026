import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key must match auth-admin.ts
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fallback-secret-please-change-in-prod'
);

export async function middleware(request: NextRequest) {
  // 1. Proteger rutas de administración
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Excepción: Login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('ddreams_admin_session');

    if (!sessionCookie?.value) {
      // No hay cookie, redirigir a login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verificar firma del token
      await jwtVerify(sessionCookie.value, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Token inválido o manipulado
      const ip = request.headers.get('x-forwarded-for') || (request as any).ip || 'unknown';
      console.warn('Invalid admin session attempt from:', ip);
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      // Borrar cookie corrupta
      response.cookies.delete('ddreams_admin_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
