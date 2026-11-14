import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.renesadventures.tours';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The staff invoice tool lives under /admin and is password-gated, but a
      // crawled URL is an invitation to try the password. Neither it nor the
      // API belongs in search results.
      disallow: ['/admin', '/api'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
