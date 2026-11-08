import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cheatsheets, getCheatsheet } from '@cheatsheets/content';
import { PageTransition } from '@cheatsheets/ui';
import { CheatsheetView } from '@/components/cheatsheet-view';
import { JsonLd } from '@/components/json-ld';
import { authorName, authorUrl } from '@/lib/site';
import { sheetGraph } from '@/lib/structured-data';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return cheatsheets.map((sheet) => ({ slug: sheet.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sheet = getCheatsheet((await params).slug);
  if (!sheet) return {};
  const url = `/${sheet.slug}`;
  return {
    title: sheet.seo.title,
    description: sheet.seo.description,
    authors: [{ name: authorName, url: authorUrl }],
    alternates: { canonical: url },
    // Replaces the root's icon set, so the Apple touch icon (app/apple-icon.png) is listed again.
    icons: {
      icon: { url: `/favicon/${sheet.slug}`, type: 'image/svg+xml' },
      apple: { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    },
    openGraph: {
      type: 'article',
      url,
      title: sheet.seo.title,
      description: sheet.seo.description,
      publishedTime: sheet.publishedAt,
      modifiedTime: sheet.updatedAt,
      authors: [authorUrl],
    },
    twitter: { card: 'summary_large_image', title: sheet.seo.title, description: sheet.seo.description },
  };
}

export default async function CheatsheetPage({ params }: Props) {
  const sheet = getCheatsheet((await params).slug);
  if (!sheet) notFound();
  return (
    <PageTransition>
    <div data-sheet={sheet.slug} className="min-h-[calc(100dvh-var(--spacing-nav))] bg-bg font-mono text-fg">
      <JsonLd data={sheetGraph(sheet)} />
      <CheatsheetView sheet={sheet} />
    </div>
    </PageTransition>
  );
}
