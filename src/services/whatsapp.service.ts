import { WHATSAPP_TEMPLATES, WhatsAppTemplateId, WhatsAppTemplate } from '@/config/whatsapp.templates';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';
import { WhatsAppPersistenceService } from './whatsapp-persistence.service';

export class WhatsAppService {
  private static templates: Record<WhatsAppTemplateId, WhatsAppTemplate> = { ...WHATSAPP_TEMPLATES };
  private static isInitialized = false;

  /**
   * Initializes the service by loading templates from Firestore.
   * Should be called at app startup.
   */
  static async initialize() {
    if (this.isInitialized) return;
    
    try {
      const loadedTemplates = await WhatsAppPersistenceService.loadTemplates();
      this.templates = loadedTemplates;
      this.isInitialized = true;
      console.log('WhatsApp Service initialized with custom templates');
    } catch (error) {
      console.warn('Failed to load dynamic WhatsApp templates, using defaults', error);
    }
  }

  /**
   * Updates the local cache of templates.
   * Useful when Admin updates settings.
   */
  static updateTemplates(newTemplates: Record<WhatsAppTemplateId, WhatsAppTemplate>) {
    this.templates = { ...newTemplates };
  }

  /**
   * Generates a complete WhatsApp URL with the processed message.
   * @param templateId The ID of the template to use
   * @param data Object containing values for the variables in the template
   * @param phoneNumber Optional override for the phone number (defaults to business phone)
   * @returns Full WhatsApp URL
   */
  static getLink(
    templateId: WhatsAppTemplateId, 
    data: Record<string, string | number> = {}, 
    phoneNumber: string = PHONE_BUSINESS
  ): string {
    const message = this.getMessage(templateId, data);
    return this.buildUrl(phoneNumber, message);
  }

  /**
   * Generates the processed text message without the URL.
   */
  static getMessage(templateId: WhatsAppTemplateId, data: Record<string, string | number> = {}): string {
    // Use internal cache instead of constant
    const template = this.templates[templateId];
    
    if (!template) {
      console.warn(`WhatsApp Template '${templateId}' not found. Using empty message.`);
      return '';
    }

    let message = template.message;

    // Replace all variables {{variableName}} with data values
    Object.keys(data).forEach(key => {
      const value = data[key] !== undefined && data[key] !== null ? String(data[key]) : '';
      // Global replace for the variable
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    // Cleanup: Remove any remaining {{variable}} tags that weren't provided
    message = message.replace(/{{[^}]+}}/g, '');

    return message.trim();
  }

  /**
   * Low-level URL builder
   */
  static buildUrl(phone: string, message: string): string {
    // Clean phone number: remove +, spaces, dashes
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  /**
   * Get all current templates (for Admin UI or debugging)
   */
  static getTemplates() {
    return this.templates;
  }
}
