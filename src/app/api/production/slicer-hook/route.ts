import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SlicingInboxService } from '@/features/admin/production/services/slicing-inbox.service';
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
  linkedProductId: z.string().optional() // New: Direct Link
});

export async function POST(req: NextRequest) {
  const start = Date.now();
  let resultStatus = 'error';

  try {
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    // Optional: Basic UA check
    // if (!userAgent.includes('DdreamsHook')) { ... }

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
    let inboxId: string;
    try {
      inboxId = await SlicingInboxService.createItem({
        ...data,
        source: 'slicer-hook'
      });
      resultStatus = 'saved';
    } catch (dbError) {
      console.error('[SlicerHook] Critical DB Error:', dbError);
      return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }

    // 4. Logging de Observabilidad
    const duration = Date.now() - start;
    console.log(`[SlicerHook] processed in ${duration}ms | status: ${resultStatus} | ua: ${userAgent} | ver: ${data.scriptVersion || 'N/A'}`);

    // 5. Notificar a Telegram (FIRE AND FORGET)
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

    // Retornamos éxito inmediato al script local
    return NextResponse.json({ success: true, id: inboxId });

  } catch (error) {
    console.error('[SlicerHook] Error interno:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
