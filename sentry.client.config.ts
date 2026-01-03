import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1, // Keep it low to save quota

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  replaysSessionSampleRate: 0.01, // Sample 1% of sessions (or 0 if you want to save quota)

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes here,
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter "noise" errors
  beforeSend(event, hint) {
    const error = hint.originalException;
    const errorMessage = error && typeof error === 'object' && 'message' in error ? String(error.message) : typeof error === 'string' ? error : '';

    // 1. Ignore common network errors (often caused by user connectivity)
    if (
      errorMessage.match(/Network Error/i) ||
      errorMessage.match(/Failed to fetch/i) ||
      errorMessage.match(/Load failed/i) ||
      errorMessage.match(/Network request failed/i) ||
      errorMessage.match(/timeout/i)
    ) {
      return null;
    }

    // 2. Ignore benign ResizeObserver errors
    if (errorMessage.match(/ResizeObserver loop limit exceeded/i)) {
      return null;
    }

    // 3. Ignore browser extension errors
    if (
      event.exception?.values?.some((exception) =>
        exception.stacktrace?.frames?.some(
          (frame) =>
            frame.filename?.startsWith("chrome-extension://") ||
            frame.filename?.startsWith("moz-extension://")
        )
      )
    ) {
      return null;
    }

    // 4. Ignore non-critical hydration errors (optional, but good for noise reduction if they are known/benign)
    // if (errorMessage.match(/Hydration failed/i)) {
    //   return null; 
    // }

    return event;
  },
});
