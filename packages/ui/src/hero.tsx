import type { ComponentProps } from 'react';
import { cn } from './cn';

export function Hero({ className, ...props }: ComponentProps<'header'>) {
  return <header className={cn('grid gap-[18px] pt-10 pb-7 max-[480px]:pt-7 max-[480px]:pb-5', className)} {...props} />;
}

/** Prompt line above the title: `~/cheatsheets (main) $ <command>`. */
export function HeroPath({ command }: { command: string }) {
  return (
    <p data-print-hide className="text-xs text-muted">
      ~/cheatsheets <span className="text-accent">(main)</span> $ {command}
    </p>
  );
}

export function HeroTitle({ name, className }: { name: string; className?: string }) {
  return (
    <h1
      className={cn(
        'font-display text-[clamp(30px,8vw,60px)] leading-none font-[number:var(--sheet-display-weight)] tracking-[-0.03em] text-hi',
        className,
      )}
    >
      {name}
      {/* Drawn with CSS so the heading's text reads "tmux cheat sheet". */}
      <span aria-hidden="true" className="text-accent after:content-['\_']" />
      <wbr />
      <span className="sr-only"> </span>
      cheat<span className="sr-only"> </span>sheet
    </h1>
  );
}

export function HeroLede({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('max-w-[62ch] leading-relaxed text-muted-2', className)} {...props} />;
}
