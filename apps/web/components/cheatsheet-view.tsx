'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { pdfFileName, type Cheatsheet, type Entry } from '@cheatsheets/content';
import {
  BarLink,
  CopyCommand,
  EntryRow,
  Hero,
  HeroLede,
  HeroPath,
  HeroTitle,
  KeyCombo,
  Pane,
  PaneEmpty,
  PaneGrid,
  SearchPrompt,
  SectionLinks,
  Segmented,
  SiteFooter,
  StatusBar,
  keysToText,
  parseKeys,
} from '@cheatsheets/ui';
import { formatDate } from '@/lib/site';
import { sectionHeading } from '@/lib/sections';
import { SiteCredit } from './site-credit';
import { StatusClock } from './status-clock';

function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (private mode); the choice just won't persist.
  }
}

export function CheatsheetView({ sheet }: { sheet: Cheatsheet }) {
  const { control } = sheet;
  const storageKey = `${sheet.slug}:${control.kind}`;
  const [setting, setSetting] = useState(control.default);
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const searchRef = useRef<HTMLInputElement>(null);

  // Restore the saved prefix / alias after hydration.
  useEffect(() => {
    const saved = readStored(storageKey);
    if (saved && control.options.some((option) => option.value === saved)) setSetting(saved);
  }, [storageKey, control.options]);

  const changeSetting = (value: string) => {
    setSetting(value);
    writeStored(storageKey, value);
  };

  const prefix = control.kind === 'prefix' ? setting : undefined;
  const meta = control.kind === 'modifier' ? setting : undefined;
  const currentLabel = control.options.find((option) => option.value === setting)?.label ?? setting;
  const applyAlias = useCallback(
    (command: string) =>
      control.kind === 'alias' && setting !== control.binary
        ? command.replace(new RegExp(`^((?:[A-Z_][A-Z0-9_]*=\\S+\\s+)*)${control.binary}\\b`), `$1${setting}`)
        : command,
    [control, setting],
  );

  const categories = useMemo(() => {
    const words = deferredQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return sheet.categories;
    const matches = (entry: Entry, categoryId: string) => {
      const haystack = [
        entry.title,
        categoryId,
        sheet.categories.find((category) => category.id === categoryId)?.title ?? '',
        ...(entry.commands ?? []),
        keysToText(parseKeys(entry.keys ?? [], prefix, meta)),
      ]
        .join(' ')
        .toLowerCase();
      return words.every((word) => haystack.includes(word));
    };
    return sheet.categories
      .map((category) => ({ ...category, entries: category.entries.filter((entry) => matches(entry, category.id)) }))
      .filter((category) => category.entries.length > 0);
  }, [deferredQuery, sheet.categories, prefix, meta]);

  // Opening /tmux#panes marks that section as current (the browser already scrolled to it).
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (sheet.categories.some((category) => category.id === id)) setCurrent(id);
  }, [sheet.categories]);

  const windowLabel = (categoryId: string) => {
    const index = sheet.categories.findIndex((category) => category.id === categoryId);
    return sheet.status.windowStyle === 'index' ? `${index}:${categoryId}` : `:${categoryId}`;
  };

  // Scroll the pane (title included) into view, then flash it once scrolling settles.
  // The URL gets the section's fragment, so the position can be shared.
  const jump = (id: string) => {
    setCurrent(id);
    window.history.replaceState(window.history.state, '', `#${id}`);
    const el = document.getElementById(id);
    if (!el) return;
    el.removeAttribute('data-flash');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    let done = false;
    const flash = () => {
      if (done) return;
      done = true;
      void el.offsetWidth;
      el.setAttribute('data-flash', '');
    };
    window.addEventListener('scrollend', flash, { once: true });
    window.setTimeout(flash, 700);
  };

  // "/" focuses search, Esc clears it.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) && !target.isContentEditable) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className="pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
      <Hero className="gutter mx-auto max-w-[1240px]">
        <HeroPath command={sheet.hero.command} />
        <HeroTitle name={sheet.name} />
        <HeroLede>{sheet.hero.lede}</HeroLede>
        <div data-print-hide className="flex flex-wrap items-stretch gap-3">
          <SearchPrompt
            ref={searchRef}
            id={`search-${sheet.slug}`}
            label={sheet.search.label}
            placeholder={sheet.search.placeholder}
            aria-label={`Search ${sheet.name} cheat sheet`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setQuery('');
            }}
          />
          <Segmented label={control.label} value={setting} options={control.options} onValueChange={changeSetting} />
          <BarLink
            href={`/pdf/${pdfFileName(sheet, setting)}`}
            target="_blank"
            rel="noopener"
            aria-label={`Open a printable PDF of the ${sheet.name} cheat sheet (${control.label} ${currentLabel})`}
          >
            print
          </BarLink>
        </div>
        <SectionLinks
          items={sheet.categories.map((category) => ({ id: category.id, label: category.title.toLowerCase() }))}
          onSelect={jump}
        />
      </Hero>

      <div className="gutter mx-auto max-w-[1240px]">
        <PaneGrid>
          {categories.length === 0 ? (
            <PaneEmpty>Nothing matches “{query}”.</PaneEmpty>
          ) : (
            categories.map((category) => (
              <Pane
                key={category.id}
                id={category.id}
                label={windowLabel(category.id)}
                heading={sectionHeading(sheet, category)}
                meta={`${category.entries.length} ${sheet.status.countNoun}`}
                description={category.description}
              >
                {category.entries.map((entry) => (
                  <EntryRow
                    key={entry.title}
                    title={entry.title}
                    keys={entry.keys?.length ? <KeyCombo sequences={parseKeys(entry.keys, prefix, meta)} /> : undefined}
                    commands={
                      entry.commands?.length
                        ? entry.commands.map((command) => {
                            const text = applyAlias(command);
                            return (
                              <CopyCommand key={command} text={text} syntax={sheet.syntax} />
                            );
                          })
                        : undefined
                    }
                  />
                ))}
              </Pane>
            ))
          )}
        </PaneGrid>
      </div>

      <SiteFooter>
        <p>
          Updated <time dateTime={sheet.updatedAt}>{formatDate(sheet.updatedAt)}</time> · checked against{' '}
          {sheet.testedWith} · sources:{' '}
          {sheet.sources.map((source, index) => (
            <span key={source.url}>
              {index > 0 ? ', ' : ''}
              <a href={source.url}>{source.label}</a>
            </span>
          ))}
        </p>
        <SiteCredit />
      </SiteFooter>

      <StatusBar
        left={sheet.status.left}
        windows={sheet.categories.map((category) => ({
          id: category.id,
          label: windowLabel(category.id),
          current: current === category.id,
        }))}
        onSelect={jump}
        right={
          <>
            {sheet.status.right.map((item) => (
              <span key={item} className="max-sm:hidden">
                {item}
              </span>
            ))}
            {control.kind === 'prefix' ? (
              <span>prefix {setting.replace('Ctrl+', 'C-')}</span>
            ) : (
              <span>{currentLabel}</span>
            )}
            {sheet.status.clock ? <StatusClock className="max-sm:hidden" /> : null}
          </>
        }
      />
    </main>
  );
}
