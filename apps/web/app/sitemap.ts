import type { MetadataRoute } from 'next';
import { cheatsheets } from '@cheatsheets/content';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = cheatsheets.map((sheet) => sheet.updatedAt).sort().at(-1);
  return [
    { url: siteUrl, lastModified: latest },
    ...cheatsheets.map((sheet) => ({ url: `${siteUrl}/${sheet.slug}`, lastModified: sheet.updatedAt })),
  ];
}
