import type { ReactNode } from 'react';

export type StatusWindow = { id: string; label: string; current: boolean };

/** tmux-style status line pinned to the bottom of the viewport. */
export function StatusBar({
  left,
  windows,
  onSelect,
  right,
}: {
  left: ReactNode;
  windows: StatusWindow[];
  onSelect: (id: string) => void;
  right?: ReactNode;
}) {
  return (
    <div className="fixed [view-transition-name:status-bar] inset-x-0 bottom-0 z-40 bg-bar pb-[env(safe-area-inset-bottom,0px)] text-[12.5px] text-bar-fg">
      <nav aria-label="Sections" className="gutter flex h-[26px] items-center gap-3 whitespace-nowrap">
        <span>{left}</span>
        <div className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto [scrollbar-width:none]">
          {windows.map((window) => (
            <button
              key={window.id}
              type="button"
              aria-current={window.current ? 'true' : undefined}
              onClick={() => onSelect(window.id)}
              className="px-1.5 text-bar-fg aria-[current=true]:bg-bar-fg aria-[current=true]:text-bar"
            >
              {window.label}
            </button>
          ))}
        </div>
        {right ? <div className="ml-auto flex gap-3.5">{right}</div> : null}
      </nav>
    </div>
  );
}
