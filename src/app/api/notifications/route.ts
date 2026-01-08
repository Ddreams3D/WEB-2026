import { NextResponse } from 'next/server';
import { sendEmail } from '@/actions/email.actions';
import { verifyIdToken } from '@/lib/auth-admin';
import { AdminService } from '@/services/admin.service';

export async function POST(request: Request) {
  try {
    // 1. Security Check: Verify Admin Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

    if (!token) {
      console.warn('[API/Notifications] Unauthorized access attempt (No token)');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyIdToken(token);
    if (!user) {
      console.warn('[API/Notifications] Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Check if user is Admin
    const isAdmin = await AdminService.checkIsAdmin(user.localId, user.email);
    if (!isAdmin) {
      console.warn(`[API/Notifications] User ${user.email} is not admin`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Process Notification
    const body = await request.json();
    const { orderId, message, type, email } = body;

    if (!orderId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'email' && email) {
        console.log(`[API] Sending email notification for order ${orderId} to ${email}`);
        
        const result = await sendEmail({
            to: email,
            subject: `Actualización de Pedido #${orderId}`,
            html: `
                <h1>Ddreams 3D - Estado de tu Pedido</h1>
                <p>Hola,</p>
                <p>Tu pedido <strong>#${orderId}</strong> tiene una actualización:</p>
                <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    ${message}
                </div>
                <p>Si tienes dudas, contáctanos.</p>
            `
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    } else {
        console.log(`[API] Mocking ${type} notification for ${orderId} (No email provided or type not email)`);
    }

    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      message: 'Notification sent successfully' 
    });
  } catch (error) {
    console.error('Error processing notification request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
