'use client';

import { useEffect } from 'react';
import { WhatsAppService } from '@/services/whatsapp.service';

export function WhatsAppController() {
  useEffect(() => {
    // Load WhatsApp templates from Firestore on app mount
    WhatsAppService.initialize();
  }, []);

  return null; // This component doesn't render anything
}
