import { cheatsheets, countEntries } from '@cheatsheets/content';
import { Command, EntryRow, Hero, HeroLede, HeroPath, Pane, PaneGrid } from '@cheatsheets/ui';
import { JsonLd } from '@/components/json-ld';
import { SiteNav } from '@/components/site-nav';
import { TransitionLink } from '@/components/view-transitions';
import { siteDescription, siteName, siteUrl } from '@/lib/site';

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-bg font-mono text-fg">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebSite', name: siteName, url: siteUrl, description: siteDescription, inLanguage: 'en' },
            {
              '@type': 'ItemList',
              itemListElement: cheatsheets.map((sheet, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: sheet.seo.title,
                url: `${siteUrl}/${sheet.slug}`,
              })),
            },
          ],
        }}
      />
      <SiteNav />
      <main className="pb-16">
        <Hero className="gutter mx-auto max-w-[1240px]">
          <HeroPath command="ls" />
          <h1 className="font-display text-[clamp(34px,6vw,60px)] leading-none font-extrabold tracking-[-0.03em] text-hi">
            cheatsheets<span className="text-accent">_</span>
          </h1>
          <HeroLede>{siteDescription} Pick a tool to see every shortcut and command on one screen.</HeroLede>
        </Hero>
        <div className="gutter mx-auto max-w-[1240px]">
          <PaneGrid>
            {cheatsheets.map((sheet) => (
              <Pane
                key={sheet.slug}
                data-sheet={sheet.slug}
                label={
                  <TransitionLink href={`/${sheet.slug}`} className="hover:underline">
                    {sheet.name}
                  </TransitionLink>
                }
                meta={`${countEntries(sheet)} entries`}
                description={sheet.seo.description}
              >
                {sheet.categories.slice(0, 4).map((category) => {
                  const command = category.entries.find((entry) => entry.commands?.length)?.commands?.[0];
                  return (
                    <EntryRow
                      key={category.id}
                      title={category.description}
                      commands={command ? <Command text={command} syntax={sheet.syntax} tabIndex={-1} /> : undefined}
                    />
                  );
                })}
                <TransitionLink
                  href={`/${sheet.slug}`}
                  className="mt-3 inline-block border border-line px-3 py-1.5 text-xs text-accent hover:border-accent"
                >
                  Open the {sheet.name} cheat sheet →
                </TransitionLink>
              </Pane>
            ))}
          </PaneGrid>
        </div>
      </main>
    </div>
  );
}
