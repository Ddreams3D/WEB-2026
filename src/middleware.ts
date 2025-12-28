import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Solo proteger rutas de admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('ddreams_admin_session');
    
    // Si no hay cookie de sesión de admin, redirigir al login
    if (!adminSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
