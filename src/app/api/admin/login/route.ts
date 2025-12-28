import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Validación en el servidor (Seguro: el usuario no puede ver esto)
    // TODO: Idealmente mover esto a una variable de entorno process.env.ADMIN_PASSWORD
    if (password === 'ddreams2026') {
      
      const response = NextResponse.json({ success: true });
      
      // Establecer cookie segura desde el servidor (HttpOnly evita acceso desde JS)
      response.cookies.set('ddreams_admin_session', 'true', {
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
    return NextResponse.json(
      { success: false, message: 'Error interno' },
      { status: 500 }
    );
  }
}
