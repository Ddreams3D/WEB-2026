import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// import { SlicingInboxService } from '@/features/admin/production/services/slicing-inbox.service'; // Replaced by Admin SDK
import { adminDb } from '@/lib/admin-sdk';
import { sendTelegramNotification } from '@/lib/telegram-bot';

const HookSchema = z.object({
  secret_token: z.string(),
  name: z.string().min(1),
  fileName: z.string(),
  grams: z.number().min(0),
  time: z.number().min(0),
  machineType: z.enum(['FDM', 'RESIN']).default('FDM'),
  filamentType: z.string().optional(),
  qualityProfile: z.string().optional(),
  fileSize: z.number().optional(), 
  fileTimestamp: z.number().optional(),
  scriptVersion: z.string().optional(),
  printerModel: z.string().optional(),
  nozzleDiameter: z.string().optional(),
  totalLayers: z.number().optional(),
  filamentLengthMeters: z.number().optional(), // New
  multicolorChanges: z.number().optional(), // New: Multicolor Tool Changes
  linkedProductId: z.string().optional(), // New: Direct Link
  target: z.string().optional() // New: 'product' or 'quote'
});

export async function POST(req: NextRequest) {
  const start = Date.now();
  let resultStatus = 'error';

  try {
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    const body = await req.json();

    // 1. Validación Zod
    const result = HookSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: result.error.issues }, 
        { status: 400 }
      );
    }

    const { secret_token, ...data } = result.data;

    // 2. Validación de Token
    if (secret_token !== process.env.SLICER_HOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Guardar en Inbox (PRIORIDAD ALTA)
    // Usamos Admin SDK para evitar problemas de permisos (bypass rules)
    let inboxId: string;
    try {
      if (!adminDb) {
         throw new Error('Admin SDK not initialized');
      }

      const COLLECTION = 'slicing_inbox';
      
      // Generar Fingerprint
      let fingerprint = '';
      if (data.fileSize && data.fileTimestamp) {
         fingerprint = `${data.fileName}|${data.fileSize}|${data.fileTimestamp}|${data.grams}|${data.time}`;
      } else {
         fingerprint = `${data.fileName}|${data.grams}|${data.time}|${data.machineType}`;
      }

      // Check Idempotencia Real (Solo si no viene vinculado explícitamente)
      if (!data.linkedProductId) {
         const snapshot = await adminDb.collection(COLLECTION)
            .where('fingerprint', '==', fingerprint)
            .where('status', '==', 'pending')
            .get();
         
         if (!snapshot.empty) {
             const existing = snapshot.docs[0].data();
             const existingDate = existing.createdAt ? new Date(existing.createdAt) : new Date();
             const diffMinutes = (Date.now() - existingDate.getTime()) / 60000;
             
             if (diffMinutes < 30) {
                 console.log(`[SlicerHook] Duplicate ignored: ${data.fileName}`);
                 return NextResponse.json({ success: true, id: snapshot.docs[0].id, duplicate: true });
             }
         }
      }

      // ACTUALIZAR PRODUCTO (Vinculación Automática)
      if (data.linkedProductId) {
          try {
              await adminDb.collection('products').doc(data.linkedProductId).update({
                productionData: {
                    lastSliced: new Date().toISOString(),
                    grams: data.grams,
                    printTimeMinutes: data.time,
                    machineType: data.machineType,
                    filamentType: data.filamentType,
                    fileName: data.fileName,
                    qualityProfile: data.qualityProfile,
                    printerModel: data.printerModel,
                    nozzleDiameter: data.nozzleDiameter,
                    totalLayers: data.totalLayers,
                    filamentLengthMeters: data.filamentLengthMeters,
                    multicolorChanges: data.multicolorChanges || 0
                }
              });
          } catch (prodErr) {
              console.error('[SlicerHook] Error updating product:', prodErr);
              // Continuamos, no bloqueante
          }
      }

      // Crear nuevo item
      const newItem = {
        ...data,
        source: 'slicer-hook',
        fingerprint,
        createdAt: new Date().toISOString(),
        status: data.linkedProductId ? 'linked' : 'pending',
        linkedAt: data.linkedProductId ? new Date().toISOString() : null,
        linkedBy: data.linkedProductId ? 'SlicerScript' : null
      };

      const docRef = await adminDb.collection(COLLECTION).add(newItem);
      inboxId = docRef.id;
      resultStatus = 'saved';

    } catch (dbError: any) {
      console.error('[SlicerHook] Critical DB Error:', dbError);
      return NextResponse.json({ 
        error: 'Database Error', 
        details: dbError?.message || String(dbError) 
      }, { status: 500 });
    }

    // 4. Logging de Observabilidad
    const duration = Date.now() - start;
    console.log(`[SlicerHook] processed in ${duration}ms | status: ${resultStatus} | ua: ${userAgent} | ver: ${data.scriptVersion || 'N/A'}`);

    // 5. Notificar a Telegram (FIRE AND FORGET) - Deshabilitado por usuario
    /*
    (async () => {
      try {
        const hours = Math.floor(data.time / 60);
        const mins = Math.round(data.time % 60);
        const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
        const profileStr = data.qualityProfile ? ` (${data.qualityProfile})` : '';

        const message = `✅ *Nuevo Slicing Detectado*\n\n` +
          `📦 **${data.name}**\n` +
          `⚖️ ${data.grams}g | ⏱️ ${timeStr}\n` +
          `🧵 ${data.filamentType || 'Generico'} (${data.machineType})${profileStr}\n` +
          `📄 ${data.fileName}`;

        await sendTelegramNotification(message);
      } catch (tgError) {
        console.warn('[SlicerHook] Telegram notification failed (non-blocking):', tgError);
      }
    })();
    */

    // Retornamos éxito inmediato al script local
    return NextResponse.json({ success: true, id: inboxId });

  } catch (error) {
    console.error('[SlicerHook] Error interno:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
