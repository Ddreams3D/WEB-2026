'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ActionResponse } from '@/shared/types/actions';

const OrganicLeadSchema = z.object({
  projectType: z.string().optional(),
  usageContext: z.string().optional(),
  projectDetails: z.string().optional(),
  style: z.string().optional(),
  size: z.string().optional(),
  deliverables: z.string().optional(),
  references: z.string().optional(),
  budget: z.string().optional(),
  contactType: z.enum(['persona', 'empresa']),
  fullName: z.string().min(1, 'El nombre es requerido'),
  companyName: z.string().optional(),
  email: z.string().email('Correo inválido'),
  phone: z.string().min(6, 'Teléfono inválido'),
  preferredContactTime: z.string().optional(),
  notes: z.string().optional(),
  serviceSlug: z.string().min(1),
});

export type OrganicLeadInput = z.infer<typeof OrganicLeadSchema>;

export async function registerOrganicLead(
  input: OrganicLeadInput
): Promise<ActionResponse<{ id: string }>> {
  const parsed = OrganicLeadSchema.safeParse(input);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Datos inválidos';
    return { success: false, error: firstError, code: 'VALIDATION_ERROR' };
  }

  if (!db) {
    return { success: false, error: 'Firestore no disponible', code: 'NO_DB' };
  }

  try {
    const docRef = await addDoc(collection(db, 'service_leads'), {
      ...parsed.data,
      source: 'organic-modeling-configurator',
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      data: { id: docRef.id },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'No se pudo registrar el lead',
      code: 'FIRESTORE_ERROR',
    };
  }
}

