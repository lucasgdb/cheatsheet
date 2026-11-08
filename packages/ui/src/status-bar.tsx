import type { ReactNode } from 'react';

export type StatusWindow = { id: string; label: string; current: boolean };

/** tmux-style status line pinned to the bottom of the viewport. Windows are links to #section. */
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
    <div className="status-bar fixed inset-x-0 bottom-0 z-40 bg-bar pb-[env(safe-area-inset-bottom,0px)] text-[12.5px] text-bar-fg">
      <nav aria-label="Sections" className="gutter flex h-[26px] items-center gap-3 whitespace-nowrap pointer-coarse:h-10">
        <span>{left}</span>
        <div className="flex min-w-0 flex-1 gap-0.5 self-stretch overflow-x-auto [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent)] max-sm:pr-6">
          {windows.map((window) => (
            <a
              key={window.id}
              href={`#${window.id}`}
              aria-current={window.current ? 'true' : undefined}
              onClick={(event) => {
                event.preventDefault();
                onSelect(window.id);
              }}
              className="flex items-center px-1.5 text-bar-fg aria-[current=true]:bg-bar-fg aria-[current=true]:text-bar pointer-coarse:px-2.5"
            >
              {window.label}
            </a>
          ))}
        </div>
        {right ? <div className="ml-auto flex gap-3.5">{right}</div> : null}
      </nav>
    </div>
  );
}
