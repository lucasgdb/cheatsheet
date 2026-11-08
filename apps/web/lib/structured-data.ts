import type { Cheatsheet } from '@cheatsheets/content';
import { authorId, authorName, authorUrl, siteDescription, siteName, siteUrl } from './site';

export const websiteId = `${siteUrl}/#website`;

/** Nodes every page's graph carries, so each page's JSON-LD is self-contained. */
export function siteNodes() {
  return [
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: siteName,
      alternateName: 'Lucas Bittencourt’s command line cheat sheets',
      url: `${siteUrl}/`,
      description: siteDescription,
      inLanguage: 'en',
      publisher: { '@id': authorId },
    },
    { '@type': 'Person', '@id': authorId, name: authorName, url: authorUrl },
  ];
}

/** TechArticle + WebPage + BreadcrumbList for one cheat sheet. */
export function sheetGraph(sheet: Cheatsheet) {
  const url = `${siteUrl}/${sheet.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...siteNodes(),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: sheet.seo.title,
        isPartOf: { '@id': websiteId },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        inLanguage: 'en',
      },
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: sheet.seo.title,
        description: sheet.seo.description,
        url,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        image: `${url}/opengraph-image`,
        inLanguage: 'en',
        keywords: sheet.seo.keywords.join(', '),
        datePublished: `${sheet.publishedAt}T00:00:00Z`,
        dateModified: `${sheet.updatedAt}T00:00:00Z`,
        author: { '@id': authorId },
        publisher: { '@id': authorId },
        isPartOf: { '@id': websiteId },
        articleSection: sheet.categories.map((category) => category.title),
        citation: sheet.sources.map((source) => source.url),
        about: {
          '@type': 'SoftwareApplication',
          name: sheet.name,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: sheet.tool.operatingSystem,
          url: sheet.tool.url,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: sheet.name, item: url },
        ],
      },
    ],
  };
}

/** CollectionPage + ItemList of all cheat sheets, for the home page. */
export function homeGraph(sheets: Cheatsheet[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...siteNodes(),
      {
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/#webpage`,
        url: `${siteUrl}/`,
        name: siteName,
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': `${siteUrl}/#sheets` },
        inLanguage: 'en',
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#sheets`,
        name: 'Cheat sheets',
        numberOfItems: sheets.length,
        itemListElement: sheets.map((sheet, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `${sheet.name} cheat sheet`,
          url: `${siteUrl}/${sheet.slug}`,
        })),
      },
    ],
  };
}
