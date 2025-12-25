import { MetadataRoute } from 'next';
import { getAppUrl } from '@/lib/url-utils';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppUrl();

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/images/'],
      disallow: ['/admin/', '/private/', '/protegido/', '/cart', '/checkout', '/login', '/profile'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
