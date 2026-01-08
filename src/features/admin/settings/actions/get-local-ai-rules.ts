'use server';

import fs from 'fs/promises';
import path from 'path';
import { ActionResponse } from '@/shared/types/actions';
import { verifyAdminSession } from '@/lib/auth-admin';

export async function getLocalAIRules(): Promise<ActionResponse<{ content: string }>> {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' };
  }

  try {
    const filePath = path.join(process.cwd(), 'AI_RULES.md');
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, data: { content } };
  } catch (error) {
    console.error('Error reading AI_RULES.md:', error);
    return { success: false, error: 'Failed to read local rules file', code: 'FILE_READ_ERROR' };
  }
}
