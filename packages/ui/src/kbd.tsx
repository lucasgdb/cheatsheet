import type { ComponentProps } from 'react';
import { Fragment } from 'react';
import { cn } from './cn';
import type { KeySequence } from './keys';

export function Kbd({ className, isPrefix, ...props }: ComponentProps<'kbd'> & { isPrefix?: boolean }) {
  return (
    <kbd
      className={cn(
        'rounded-[3px] border border-b-2 px-1.5 py-px font-mono text-xs leading-[18px]',
        isPrefix ? 'border-pfx-line bg-pfx text-accent' : 'border-kbd-line bg-kbd text-kbd-fg',
        className,
      )}
      {...props}
    />
  );
}

function Separator({ children }: { children: string }) {
  return <span className="text-[11px] text-muted">{children}</span>;
}

/** Renders alternatives ("/") of key sequences ("then"). */
export function KeyCombo({ sequences, className }: { sequences: KeySequence[]; className?: string }) {
  if (!sequences.length) return null;
  return (
    <span className={cn('inline-flex flex-wrap items-center justify-end gap-1 @max-pane:justify-start', className)}>
      {sequences.map((groups, a) => (
        <Fragment key={a}>
          {a > 0 && <Separator>/</Separator>}
          {groups.map((group, g) => (
            <Fragment key={g}>
              {g > 0 && <Separator>then</Separator>}
              <span className="inline-flex items-center gap-[3px]">
                {group.keys.map((key, k) => (
                  <Kbd key={k} isPrefix={group.prefix}>
                    {key}
                  </Kbd>
                ))}
              </span>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </span>
  );
}
