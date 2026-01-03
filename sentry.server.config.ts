import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1, // Low sampling rate for performance/quota

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter "noise" errors on server
  beforeSend(event, hint) {
    // Add server-side filtering logic here if needed. 
    // Often server errors are more critical, so we filter less aggressively than client.
    return event;
  },
});
