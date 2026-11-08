import type { MouseEvent } from 'react';

export type SectionLink = { id: string; label: string };

/** "jump to:" row of in-page links. Plain anchors, so they work without JS and can be shared. */
export function SectionLinks({
  items,
  onSelect,
  label = 'jump to:',
}: {
  items: SectionLink[];
  onSelect?: (id: string) => void;
  label?: string;
}) {
  const handle = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onSelect || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onSelect(id);
  };
  return (
    <nav aria-label="Jump to section" data-print-hide className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs whitespace-nowrap text-muted max-sm:-mx-4 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-4 max-sm:[mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-24px),transparent)] max-sm:[scrollbar-width:none]">
      <span>{label}</span>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={handle(item.id)}
          className="text-muted-2 underline transition-colors decoration-line underline-offset-4 hover:text-accent hover:decoration-accent pointer-coarse:py-2"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
