import { NextRequest, NextResponse } from 'next/server';
import { FinanceParser } from '@/features/admin/finances/utils/parser';
import { InboxService } from '@/features/admin/finances/services/InboxService';

// Telegram API base URL
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// Main Keyboard Layout
const MAIN_KEYBOARD = {
  keyboard: [
    [{ text: '📉 Gasto Empresa' }, { text: '📈 Ingreso Empresa' }],
    [{ text: '👤 Gasto Personal' }, { text: '💰 Ingreso Personal' }]
  ],
  resize_keyboard: true,
  is_persistent: true
};

// Helper to send message back to Telegram
async function sendMessage(chatId: string, text: string, options: any = {}) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return;
  
  try {
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
      reply_markup: options.reply_markup || MAIN_KEYBOARD, // Default to main keyboard if not specified
      ...options
    };

    // Remove reply_markup from top level if it's in options (to avoid duplication/conflict logic if needed)
    // But here we merge options. options.reply_markup overrides MAIN_KEYBOARD.

    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Validate Secret Token
    const secretToken = req.headers.get('x-telegram-bot-api-secret-token');
    if (process.env.TELEGRAM_SECRET_TOKEN && secretToken !== process.env.TELEGRAM_SECRET_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // 2. Extract Message
    const message = body.message || body.edited_message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id.toString();
    const userId = message.from?.id.toString();
    const messageId = message.message_id.toString();
    const text = message.text.trim();

    // 3. Authorization Check
    if (userId !== process.env.TELEGRAM_ADMIN_ID) {
      console.warn(`Unauthorized access attempt from user ${userId}`);
      return NextResponse.json({ ok: true });
    }

    // 4. Handle Menu Button Clicks (Prompt for details)
    const prompts: Record<string, string> = {
      '📉 Gasto Empresa': '🏢 *Gasto Empresa*\nIngresa: `[monto] [concepto]`',
      '📈 Ingreso Empresa': '🏢 *Ingreso Empresa*\nIngresa: `[monto] [concepto]`',
      '👤 Gasto Personal': '👤 *Gasto Personal*\nIngresa: `[monto] [concepto]`',
      '💰 Ingreso Personal': '👤 *Ingreso Personal*\nIngresa: `[monto] [concepto]`'
    };

    if (prompts[text]) {
      await sendMessage(chatId, prompts[text], {
        reply_markup: { force_reply: true } // Force user to reply to this message
      });
      return NextResponse.json({ ok: true });
    }

    // 5. Handle Replies (Context Injection)
    let textToParse = text;
    
    if (message.reply_to_message && message.reply_to_message.text) {
      const replyText = message.reply_to_message.text;
      
      // Map prompt text back to command prefixes
      if (replyText.includes('Gasto Empresa')) textToParse = `ge ${text}`;
      else if (replyText.includes('Ingreso Empresa')) textToParse = `ie ${text}`;
      else if (replyText.includes('Gasto Personal')) textToParse = `gp ${text}`;
      else if (replyText.includes('Ingreso Personal')) textToParse = `ip ${text}`;
    }

    // 6. Parse Command
    const inboxItem = FinanceParser.parseMessage(textToParse, messageId, chatId);

    if (!inboxItem) {
      // If parsing failed, check if it was just a raw command without args
      // e.g. "ge" -> Trigger prompt
      const rawLower = textToParse.toLowerCase();
      const quickPrompts: Record<string, string> = {
        'ge': '📉 Gasto Empresa',
        'ie': '📈 Ingreso Empresa',
        'gp': '👤 Gasto Personal',
        'ip': '💰 Ingreso Personal'
      };
      
      if (quickPrompts[rawLower]) {
        await sendMessage(chatId, prompts[quickPrompts[rawLower]], {
          reply_markup: { force_reply: true }
        });
        return NextResponse.json({ ok: true });
      }

      // Otherwise send Help
      await sendMessage(chatId, FinanceParser.getHelpMessage());
      return NextResponse.json({ ok: true });
    }

    // 7. Save to Inbox
    const success = await InboxService.appendItem(inboxItem);

    if (success) {
      const contextEmoji = inboxItem.context === 'personal' ? '👤' : '🏢';
      const typeEmoji = inboxItem.type === 'expense' ? '📉' : '📈';
      
      await sendMessage(chatId, `✅ *Guardado*\n${contextEmoji} ${typeEmoji} ${inboxItem.currency} ${inboxItem.amount} - ${inboxItem.description}`);
    } else {
      await sendMessage(chatId, `⚠️ *Error al guardar*\nHubo un problema de conexión.`);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
