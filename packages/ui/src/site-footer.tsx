import type { ComponentProps } from 'react';
import { cn } from './cn';

/** Quiet footer line: who made it, when it was checked, where it comes from. */
export function SiteFooter({ className, children, ...props }: ComponentProps<'footer'>) {
  return (
    <footer className={cn('gutter mx-auto mt-8 max-w-[1240px]', className)} {...props}>
      {/* The rule sits inside the gutter so it lines up with the pane grid. */}
      <div className="grid gap-1.5 border-t border-dashed border-dash pt-5 text-xs leading-relaxed text-muted [&_a]:text-muted-2 [&_a]:underline [&_a]:decoration-line [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-accent">
        {children}
      </div>
    </footer>
  );
}
