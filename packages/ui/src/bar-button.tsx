import type { ComponentProps } from 'react';
import { cn } from './cn';

const barClass =
  'inline-flex min-h-[38px] items-center border border-line px-3 text-xs text-muted-2 transition-colors hover:border-accent hover:text-accent pointer-coarse:min-h-11';

/** Small terminal-style action next to the search prompt. */
export function BarButton({ className, ...props }: ComponentProps<'button'>) {
  return <button type="button" className={cn(barClass, className)} {...props} />;
}

/** The same look for a link (e.g. "print", which opens a ready-made PDF). */
export function BarLink({ className, ...props }: ComponentProps<'a'>) {
  return <a className={cn(barClass, className)} {...props} />;
}
