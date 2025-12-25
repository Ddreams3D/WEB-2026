import { MetadataRoute } from 'next';
import { getAppUrl } from '@/lib/url-utils';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/', '/protegido/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
