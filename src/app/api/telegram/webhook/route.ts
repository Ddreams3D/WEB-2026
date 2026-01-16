import { NextRequest, NextResponse } from 'next/server';
import { FinanceParser } from '@/features/admin/finances/utils/parser';
import { InboxService } from '@/features/admin/finances/services/InboxService';

// Telegram API base URL
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// Helper to send message back to Telegram
async function sendMessage(chatId: string, text: string) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return;
  
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Validate Secret Token (Security)
    // Telegram sends this header to verify the request comes from them
    const secretToken = req.headers.get('x-telegram-bot-api-secret-token');
    if (process.env.TELEGRAM_SECRET_TOKEN && secretToken !== process.env.TELEGRAM_SECRET_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // 2. Extract Message
    const message = body.message || body.edited_message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true }); // Ignore non-text messages
    }

    const chatId = message.chat.id.toString();
    const userId = message.from?.id.toString();
    const messageId = message.message_id.toString();
    const text = message.text;

    // 3. Authorization Check
    // Only allow configured admin user
    if (userId !== process.env.TELEGRAM_ADMIN_ID) {
      console.warn(`Unauthorized access attempt from user ${userId}`);
      return NextResponse.json({ ok: true }); // Silently ignore unauthorized users
    }

    // 4. Parse Command
    const inboxItem = FinanceParser.parseMessage(text, messageId, chatId);

    if (!inboxItem) {
      // Invalid format -> Send Help
      await sendMessage(chatId, FinanceParser.getHelpMessage());
      return NextResponse.json({ ok: true });
    }

    // 5. Save to Inbox (Firebase)
    // We attempt to append securely
    const success = await InboxService.appendItem(inboxItem);

    if (success) {
      await sendMessage(chatId, `✅ *Guardado en Inbox*\n${inboxItem.type === 'expense' ? '📉 Gasto' : '📈 Ingreso'}: ${inboxItem.currency} ${inboxItem.amount} - ${inboxItem.description}`);
    } else {
      await sendMessage(chatId, `⚠️ *Error al guardar*\nHubo un problema de conexión con la nube. Intenta de nuevo.`);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
