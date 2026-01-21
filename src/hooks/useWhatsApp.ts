import { useCallback } from 'react';
import { WhatsAppService } from '@/services/whatsapp.service';
import { WhatsAppTemplateId } from '@/config/whatsapp.templates';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';

interface UseWhatsAppOptions {
  analyticsLocation?: string;
}

export function useWhatsApp(options: UseWhatsAppOptions = {}) {
  const sendMessage = useCallback((
    templateId: WhatsAppTemplateId,
    data: Record<string, string | number> = {},
    analyticsLabel?: string
  ) => {
    // 1. Generate Link
    const link = WhatsAppService.getLink(templateId, data);

    // 2. Track Event
    trackEvent(AnalyticsEvents.WHATSAPP_CLICK, {
      // Use GENERAL as fallback if no location provided
      location: options.analyticsLocation || AnalyticsLocations.GENERAL,
      template: templateId,
      label: analyticsLabel || templateId
    });

    // 3. Open in new tab
    window.open(link, '_blank');
  }, [options.analyticsLocation]);

  const getLink = useCallback((
    templateId: WhatsAppTemplateId,
    data: Record<string, string | number> = {}
  ) => {
    return WhatsAppService.getLink(templateId, data);
  }, []);

  return { sendMessage, getLink };
}
