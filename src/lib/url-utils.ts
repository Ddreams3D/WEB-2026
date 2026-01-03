export function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback to production domain if not in development mode
  if (process.env.NODE_ENV === 'production') {
    return 'https://ddreams3d.com';
  }

  return 'http://localhost:3000';
}
