import { notFound } from 'next/navigation';
import { cheatsheets, getCheatsheet } from '@cheatsheets/content';
import { ogSize, renderOgImage } from '@/lib/og';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'Cheat sheet preview';

export function generateStaticParams() {
  return cheatsheets.map((sheet) => ({ slug: sheet.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const sheet = getCheatsheet((await params).slug);
  if (!sheet) notFound();
  return renderOgImage({
    slug: sheet.slug,
    title: sheet.name,
    command: sheet.hero.command,
    summary: sheet.summary,
    status: `${sheet.status.left}  ${sheet.categories
      .slice(0, 6)
      .map((category, index) => (sheet.status.windowStyle === 'index' ? `${index}:${category.id}` : `:${category.id}`))
      .join('  ')}`,
  });
}
