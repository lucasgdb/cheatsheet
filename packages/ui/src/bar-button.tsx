import type { ComponentProps } from 'react';
import { cn } from './cn';

/** Small terminal-style action next to the search prompt (e.g. "print"). */
export function BarButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'min-h-[38px] border border-line px-3 transition-colors text-xs text-muted-2 hover:border-accent hover:text-accent pointer-coarse:min-h-11',
        className,
      )}
      {...props}
    />
  );
}
