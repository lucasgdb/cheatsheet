import type { ReactNode } from 'react';

/**
 * One cheatsheet line: title and keys on the first row (fixed 24px track so every
 * row has the same rhythm), commands spanning the full width below.
 * In narrow panes the keys drop under the title.
 */
export function EntryRow({ title, keys, commands }: { title: ReactNode; keys?: ReactNode; commands?: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[minmax(24px,auto)] items-center gap-x-3 gap-y-1.5 border-t border-dashed border-dash py-2 @max-pane:grid-cols-1">
      <div className="text-trim leading-[1.45] text-text">{title}</div>
      {keys ? <div className="flex justify-end @max-pane:justify-start">{keys}</div> : <div className="@max-pane:hidden" />}
      {commands ? <div className="col-span-full flex flex-wrap gap-x-3.5 gap-y-1 leading-[18px]">{commands}</div> : null}
    </div>
  );
}
