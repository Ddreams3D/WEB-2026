import { InboxItem } from '../types';

export const FinanceParser = {
  parseMessage(text: string, messageId: string, chatId: string): InboxItem | null {
    const cleanText = text.trim();
    
    // Regex for "g 50.5 taxi" or "i 100 adelanto"
    // Supports prefixes:
    // g/i  -> Generic (Expense/Income)
    // ge/ie -> Empresa
    // gp/ip -> Personal
    const regex = /^(g|i|ge|gp|ie|ip)\s+(\d+(?:\.\d{1,2})?)\s+(.+)$/i;
    
    const match = cleanText.match(regex);
    
    if (!match) {
      return null;
    }

    const [, cmd, amountStr, description] = match;
    const amount = parseFloat(amountStr);
    const lowerCmd = cmd.toLowerCase();
    
    let type: 'expense' | 'income' = 'expense';
    let context: 'personal' | 'company' | undefined = undefined;

    // Determine Type
    if (lowerCmd.startsWith('i')) {
      type = 'income';
    }

    // Determine Context
    if (lowerCmd.endsWith('p')) {
      context = 'personal';
    } else if (lowerCmd.endsWith('e')) {
      context = 'company';
    }
    // If just 'g' or 'i', context remains undefined (or treat as default/company downstream)

    // Deterministic ID: chatId_messageId
    const id = `${chatId}_${messageId}`;

    return {
      id,
      type,
      amount,
      description: description.trim(),
      currency: 'PEN', // Default currency
      date: new Date().toISOString(),
      rawText: cleanText,
      status: 'pending',
      createdAt: Date.now(),
      context
    };
  },

  getHelpMessage(): string {
    return `
🤖 *Ddreams 3D Bot*

Usa el teclado para seleccionar una acción o escribe:

🏢 *Empresa*
• Gasto: \`ge [monto] [desc]\`
• Ingreso: \`ie [monto] [desc]\`

👤 *Personal*
• Gasto: \`gp [monto] [desc]\`
• Ingreso: \`ip [monto] [desc]\`

⚡ *Rápido*
• Gasto: \`g ...\`
• Ingreso: \`i ...\`

Ejemplo:
✅ \`ge 50 taxi cliente\`
`.trim();
  }
};
