import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cheatsheets, countEntries, getCheatsheet } from '@cheatsheets/content';
import { PageTransition } from '@cheatsheets/ui';
import { CheatsheetView } from '@/components/cheatsheet-view';
import { JsonLd } from '@/components/json-ld';
import { siteName, siteUrl } from '@/lib/site';

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
    keywords: sheet.seo.keywords,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: sheet.seo.title, description: sheet.seo.description },
    twitter: { title: sheet.seo.title, description: sheet.seo.description },
  };
}

export default async function CheatsheetPage({ params }: Props) {
  const sheet = getCheatsheet((await params).slug);
  if (!sheet) notFound();
  const url = `${siteUrl}/${sheet.slug}`;

  return (
    <PageTransition>
    <div data-sheet={sheet.slug} className="min-h-[calc(100dvh-var(--spacing-nav))] bg-bg font-mono text-fg">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'TechArticle',
              '@id': `${url}#article`,
              headline: sheet.seo.title,
              description: sheet.seo.description,
              url,
              inLanguage: 'en',
              keywords: sheet.seo.keywords.join(', '),
              about: { '@type': 'SoftwareApplication', name: sheet.name, applicationCategory: 'DeveloperApplication' },
              articleSection: sheet.categories.map((category) => category.id),
              wordCount: countEntries(sheet),
              isPartOf: { '@type': 'WebSite', name: siteName, url: siteUrl },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: siteName, item: siteUrl },
                { '@type': 'ListItem', position: 2, name: sheet.name, item: url },
              ],
            },
          ],
        }}
      />
      <CheatsheetView sheet={sheet} />
    </div>
    </PageTransition>
  );
}
