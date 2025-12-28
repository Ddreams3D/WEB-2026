export const analytics = {
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    console.log(`[Analytics] ${eventName}`, properties);
    // Aquí iría la integración real (GA4, Mixpanel, etc.)
  },
  trackPageView: (url: string) => {
    console.log(`[Analytics] Page View: ${url}`);
  },
  identifyUser: (userId: string, traits?: Record<string, any>) => {
    console.log(`[Analytics] Identify: ${userId}`, traits);
  },
  social: (platform: string, action: string, target: string) => {
    console.log(`[Analytics] Social: ${platform} - ${action} - ${target}`);
  }
};
