'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { Cheatsheet, Entry } from '@cheatsheets/content';
import {
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
  Segmented,
  StatusBar,
  keysToText,
  parseKeys,
} from '@cheatsheets/ui';
import { StatusClock } from './status-clock';

const paneId = (categoryId: string) => `p-${categoryId}`;

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
  const applyAlias = useCallback(
    (command: string) =>
      control.kind === 'alias' && setting !== control.binary
        ? command.replace(new RegExp(`^${control.binary}\\b`), setting)
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
        ...(entry.commands ?? []),
        keysToText(parseKeys(entry.keys ?? [], prefix)),
      ]
        .join(' ')
        .toLowerCase();
      return words.every((word) => haystack.includes(word));
    };
    return sheet.categories
      .map((category) => ({ ...category, entries: category.entries.filter((entry) => matches(entry, category.id)) }))
      .filter((category) => category.entries.length > 0);
  }, [deferredQuery, sheet.categories, prefix]);

  const windowLabel = (categoryId: string) => {
    const index = sheet.categories.findIndex((category) => category.id === categoryId);
    return sheet.status.windowStyle === 'index' ? `${index}:${categoryId}` : `:${categoryId}`;
  };

  // Scroll the pane (title included) into view, then flash it once scrolling settles.
  const jump = (id: string) => {
    setCurrent(id);
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
    <main className="min-h-[calc(100dvh-var(--spacing-nav))] pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
      <Hero className="gutter mx-auto max-w-[1240px]">
        <HeroPath command={sheet.hero.command} />
        <HeroTitle name={sheet.name} />
        <HeroLede>{sheet.hero.lede}</HeroLede>
        <div className="flex flex-wrap items-stretch gap-3">
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
        </div>
      </Hero>

      <div className="gutter mx-auto max-w-[1240px]">
        <PaneGrid>
          {categories.length === 0 ? (
            <PaneEmpty>Nothing matches “{query}”.</PaneEmpty>
          ) : (
            categories.map((category) => (
              <Pane
                key={category.id}
                id={paneId(category.id)}
                label={windowLabel(category.id)}
                meta={`${category.entries.length} ${sheet.status.countNoun}`}
                description={category.description}
              >
                {category.entries.map((entry) => (
                  <EntryRow
                    key={entry.title}
                    title={entry.title}
                    keys={entry.keys?.length ? <KeyCombo sequences={parseKeys(entry.keys, prefix)} /> : undefined}
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

      <StatusBar
        left={sheet.status.left}
        windows={sheet.categories.map((category) => ({
          id: paneId(category.id),
          label: windowLabel(category.id),
          current: current === paneId(category.id),
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
              <span>{setting === control.binary ? control.binary : `alias ${setting}`}</span>
            )}
            {sheet.status.clock ? <StatusClock className="max-sm:hidden" /> : null}
          </>
        }
      />
    </main>
  );
}
