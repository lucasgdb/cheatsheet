import type { MetadataRoute } from 'next';
import { cheatsheets } from '@cheatsheets/content';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'monthly', priority: 1 },
    ...cheatsheets.map((sheet) => ({
      url: `${siteUrl}/${sheet.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ];
}
