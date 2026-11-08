export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cheatsheet.lucasbittencourt.dev').replace(/\/$/, '');

export const siteName = 'cheatsheets';

export const siteDescription =
  'Fast, searchable cheat sheets for the command line tools you use every day. No ads.';

export const authorName = 'Lucas Bittencourt';

export const authorUrl = 'https://lucasbittencourt.dev';

/** The Person entity published by the author's own site; referenced from this site's JSON-LD. */
export const authorId = 'https://lucasbittencourt.dev/#person';

/** "2026-11-08" → "Nov 8, 2026" (fixed locale and UTC so server and client agree). */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
