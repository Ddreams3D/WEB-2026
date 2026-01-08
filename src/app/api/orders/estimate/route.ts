import { NextResponse } from 'next/server';
import { apiRateLimiter } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    const isAllowed = await apiRateLimiter.check(5, ip); // 5 requests per 10s window

    if (!isAllowed) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
    }

    const body = await request.json();
    const { order } = body;

    if (!order) {
        return NextResponse.json({ error: 'Order data required' }, { status: 400 });
    }

    // Lógica de negocio para estimación de entrega
    let baseDays = 7;
      
    // Ajustar días según estado actual
    switch (order.status) {
      case 'quote_requested': baseDays = 10; break;
      case 'pending_payment': baseDays = 7; break;
      case 'processing': baseDays = 5; break;
      case 'ready': baseDays = 1; break; // Listo para recoger/enviar
      case 'shipped': baseDays = 2; break; // Tiempo de tránsito promedio
      default: baseDays = 7;
    }

    // Ajustar si hay servicios personalizados (toman más tiempo)
    // Verificamos propiedad 'type' en items (según definición OrderItem)
    const hasCustomServices = order.items?.some((i: { type: string }) => i.type === 'service');
    if (hasCustomServices) {
      baseDays += 5;
    }

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + baseDays);

    // Saltar fines de semana (simple)
    const day = estimatedDelivery.getDay();
    if (day === 0) estimatedDelivery.setDate(estimatedDelivery.getDate() + 1); // Domingo -> Lunes
    if (day === 6) estimatedDelivery.setDate(estimatedDelivery.getDate() + 2); // Sábado -> Lunes

    return NextResponse.json({ 
        estimatedDeliveryDate: estimatedDelivery.toISOString() 
    });

  } catch (error) {
     console.error('Error calculating delivery date:', error);
     return NextResponse.json({ error: 'Calculation failed' }, { status: 500 });
  }
}
