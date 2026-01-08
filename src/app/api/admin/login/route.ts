import { NextResponse } from 'next/server';
import { signAdminSession } from '@/lib/auth-admin';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function POST(request: Request) {
  try {
    // Rate Limiting: 10 intentos por minuto por IP (aumentado para evitar bloqueos tempranos)
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const isAllowed = await limiter.check(10, ip);
    
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, message: 'Demasiados intentos. Intenta de nuevo en un minuto.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    // Validación estricta: Solo acepta variable de entorno
    // Si no hay variable configurada, nadie puede entrar (Fail Safe)
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('CRITICAL: ADMIN_PASSWORD environment variable is not set in Netlify/Environment.');
      return NextResponse.json(
        { success: false, message: 'Error de configuración del servidor: Falta ADMIN_PASSWORD.' },
        { status: 500 }
      );
    }
    
    if (password === adminPassword) {
      
      const response = NextResponse.json({ success: true });
      
      // Generar Token JWT firmado criptográficamente
      const token = await signAdminSession();

      // Establecer cookie segura
      response.cookies.set('ddreams_admin_session', token, {
        httpOnly: true, // No accesible desde document.cookie
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'lax', // Permite navegación normal
        path: '/',
        maxAge: 60 * 60 * 24 // 24 horas
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Contraseña incorrecta' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno' },
      { status: 500 }
    );
  }
}
