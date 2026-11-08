import type { ComponentProps, ReactNode } from 'react';
import { cn } from './cn';

export function PaneGrid({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-pane-grid
      className={cn(
        // Borders come from each pane's 1px ring (box-shadow, not outline: outlines paint after
        // everything in some browsers and would cover the hovered pane's border). An empty
        // trailing cell stays the page colour.
        'grid grid-cols-[repeat(auto-fill,minmax(min(100%,380px),1fr))] gap-px p-px',
        className,
      )}
      {...props}
    />
  );
}

/**
 * A tmux-like pane. Hover (or `data-flash`, set after a jump) lights up its border.
 * The pane rises above its neighbours while lit; z-index eases with the border so the
 * edge shared with the next pane doesn't vanish before the border has faded out.
 * It is a size container so rows can adapt to the pane's width, not the screen's.
 */
export function Pane({
  label,
  heading,
  meta,
  description,
  className,
  children,
  ...props
}: Omit<ComponentProps<'section'>, 'title'> & {
  /** Terminal-style label shown on screen (e.g. "0:sessions"). */
  label: ReactNode;
  /** What the section is, for search engines and screen readers (e.g. "tmux sessions"). */
  heading?: string;
  meta?: ReactNode;
  description?: ReactNode;
}) {
  return (
    <section
      data-pane
      className={cn(
        '@container relative min-w-0 z-0 shadow-[0_0_0_1px_var(--color-line)] transition-[z-index] duration-150 hover:z-10 data-flash:z-10 bg-bg px-4 pt-3.5 pb-[18px] max-[480px]:px-3 max-[480px]:pt-3 max-[480px]:pb-3.5',
        "after:pointer-events-none after:absolute after:-inset-px after:border after:border-transparent after:transition-colors after:content-[''] hover:after:border-accent",
        'data-flash:animate-pane-flash data-flash:after:animate-pane-ring',
        className,
      )}
      {...props}
    >
      <header className="mb-1 flex justify-between text-xs text-muted">
        <h2 className="font-medium text-accent">
          {heading ? (
            <>
              <span aria-hidden="true">{label}</span>
              <span className="sr-only">{heading}</span>
            </>
          ) : (
            label
          )}
        </h2>
        {meta ? <span>{meta}</span> : null}
      </header>
      {description ? <p className="mb-3 text-xs leading-normal text-muted"># {description}</p> : null}
      {children}
    </section>
  );
}

export function PaneEmpty({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('col-span-full bg-bg px-4 py-10 text-muted-2', className)} {...props} />;
}
