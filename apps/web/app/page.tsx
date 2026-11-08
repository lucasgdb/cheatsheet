import type { Metadata } from 'next';
import { cheatsheets, countEntries } from '@cheatsheets/content';
import {
  CopyCommand,
  EntryRow,
  Hero,
  HeroLede,
  HeroPath,
  PageTransition,
  Pane,
  PaneGrid,
  SiteFooter,
} from '@cheatsheets/ui';
import { JsonLd } from '@/components/json-ld';
import { SiteCredit } from '@/components/site-credit';
import { TransitionLink } from '@/components/view-transitions';
import { authorName, authorUrl, siteDescription } from '@/lib/site';
import { homeGraph } from '@/lib/structured-data';

const toolNames = cheatsheets.map((sheet) => sheet.name).join(' & ');

export const metadata: Metadata = {
  title: { absolute: `${toolNames} cheat sheets: searchable, no ads` },
  description: `Searchable ${cheatsheets.map((sheet) => sheet.name).join(' and ')} cheat sheets with your own prefix key or alias applied to every shortcut and command. Free, no ads.`,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-[calc(100dvh-var(--spacing-nav))] bg-bg font-mono text-fg">
        <JsonLd data={homeGraph(cheatsheets)} />
        <main className="pb-16">
          <Hero className="gutter mx-auto max-w-[1240px]">
            <HeroPath command="ls" />
            <h1 className="font-display text-[clamp(30px,8vw,60px)] leading-none font-extrabold tracking-[-0.03em] text-hi">
              cheatsheets<span aria-hidden="true" className="text-accent">_</span>
            </h1>
            <HeroLede>
              {siteDescription} Each cheat sheet puts the shortcuts and commands of one tool on a single searchable page,
              adapts them to your own setup (your tmux prefix, your kubectl alias) and copies any command with a click.
              They’re made and kept up to date by <a href={authorUrl} className="text-text underline decoration-line underline-offset-4 hover:text-accent">{authorName}</a>,
              checked against the official documentation.
            </HeroLede>
          </Hero>
          <div className="gutter mx-auto max-w-[1240px]">
            <PaneGrid>
              {cheatsheets.map((sheet) => (
                <Pane
                  key={sheet.slug}
                  data-sheet={sheet.slug}
                  label={
                    <TransitionLink href={`/${sheet.slug}`} className="hover:underline pointer-coarse:inline-block pointer-coarse:py-2">
                      {sheet.name}
                    </TransitionLink>
                  }
                  meta={`${countEntries(sheet)} entries`}
                  description={sheet.summary}
                >
                  {sheet.categories.slice(0, 4).map((category) => {
                    const command = category.entries.find((entry) => entry.commands?.length)?.commands?.[0];
                    return (
                      <EntryRow
                        key={category.id}
                        title={category.description}
                        commands={command ? <CopyCommand text={command} syntax={sheet.syntax} /> : undefined}
                      />
                    );
                  })}
                  <TransitionLink
                    href={`/${sheet.slug}`}
                    className="mt-3 inline-flex min-h-[30px] items-center border border-line px-3 text-xs text-accent transition-colors hover:border-accent pointer-coarse:min-h-11"
                  >
                    Open the {sheet.name} cheat sheet →
                  </TransitionLink>
                </Pane>
              ))}
            </PaneGrid>
          </div>
          <SiteFooter>
            <SiteCredit />
          </SiteFooter>
        </main>
      </div>
    </PageTransition>
  );
}
