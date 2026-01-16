import { InboxItem } from '../types';

export const FinanceParser = {
  parseMessage(text: string, messageId: string, chatId: string): InboxItem | null {
    const cleanText = text.trim();
    
    // Regex for "g 50.5 taxi" or "i 100 adelanto"
    // ^(g|i)     -> Starts with g or i (case insensitive)
    // \s+        -> One or more spaces
    // (\d+...)   -> The amount (integer or decimal)
    // \s+        -> One or more spaces
    // (.+)       -> The description (rest of the string)
    const regex = /^(g|i)\s+(\d+(?:\.\d{1,2})?)\s+(.+)$/i;
    
    const match = cleanText.match(regex);
    
    if (!match) {
      return null;
    }

    const [, typeChar, amountStr, description] = match;
    const amount = parseFloat(amountStr);
    const type = typeChar.toLowerCase() === 'g' ? 'expense' : 'income';
    
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
      createdAt: Date.now()
    };
  },

  getHelpMessage(): string {
    return `
🤖 *Ddreams 3D Bot*

Comandos válidos:
• Gasto: \`g [monto] [concepto]\`
• Ingreso: \`i [monto] [concepto]\`

Ejemplos:
✅ \`g 15.50 taxi cliente\`
✅ \`i 500 adelanto proyecto\`

❌ \`gasto 50 taxi\` (Usa solo 'g')
    `.trim();
  }
};
