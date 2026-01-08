'use server';

import { z } from 'zod';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ActionResponse } from '@/shared/types/actions';
import { Logger } from '@/lib/logger';

// Esquema de validación estricto
const PaymentProofSchema = z.object({
  orderId: z.string().min(1, "El ID del pedido es requerido"),
  proofUrl: z.string().url("La URL del comprobante no es válida"),
});

export async function submitPaymentProofAction(input: { orderId: string; proofUrl: string }): Promise<ActionResponse<void>> {
  // 1. Validación Zod (Integridad de Tipado)
  const validation = PaymentProofSchema.safeParse(input);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message
    };
  }

  const { orderId, proofUrl } = validation.data;

  // 2. Ejecución segura (Separación Cliente/Servidor)
  try {
    if (!db) {
      throw new Error('Base de datos no inicializada');
    }

    const orderRef = doc(db, 'orders', orderId);
    
    // Usamos el SDK de cliente en el servidor (actúa como cliente privilegiado si las reglas lo permiten,
    // o como usuario anónimo si no hay auth context transferido).
    // Idealmente, aquí se usaría firebase-admin para bypass de reglas.
    await updateDoc(orderRef, {
      paymentProofUrl: proofUrl,
      paymentStatus: 'pending_verification', // Estado más preciso que 'paid'
      updatedAt: new Date(), // Usamos Date nativo que Firestore convierte
      lastAction: 'payment_proof_uploaded'
    });

    return { success: true, data: undefined };

  } catch (error: any) {
    await Logger.error('Error submitting payment proof', 'submitPaymentProofAction', error, { orderId });
    return {
      success: false,
      error: 'Error al registrar el comprobante. Por favor contacta a soporte.'
    };
  }
}
