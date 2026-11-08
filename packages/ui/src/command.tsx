import type { ComponentProps, ReactNode } from 'react';
import { cn } from './cn';

export type CommandSyntax = 'tmux' | 'shell';

const PUNCTUATION = new Set(['|', '>', '--']);

/** tmux: commands starting with ":" run inside tmux, everything else in the shell. */
function highlightTmux(text: string): ReactNode {
  if (text.startsWith(':')) return text;
  return (
    <>
      <span className="text-dollar">$</span> {text}
    </>
  );
}

/** shell: binary and punctuation muted, first word after the binary is the verb, flags coloured. */
function highlightShell(text: string): ReactNode {
  let verbSeen = false;
  const parts = text.split(' ').map((token, i) => {
    let className: string | undefined;
    if (i === 0 || PUNCTUATION.has(token)) className = 'text-muted';
    else if (token.startsWith('-')) className = 'text-flag';
    else if (!verbSeen) {
      verbSeen = true;
      className = 'text-verb';
    }
    return (
      <span key={i} className={className}>
        {i > 0 ? ' ' : ''}
        {token}
      </span>
    );
  });
  return (
    <>
      <span className="text-dollar">$</span> {parts}
    </>
  );
}

export function Command({
  text,
  syntax,
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'children'> & { text: string; syntax: CommandSyntax }) {
  return (
    <button
      type="button"
      className={cn(
        "relative p-0 text-left text-xs text-cmd [overflow-wrap:anywhere] max-sm:text-[13px] after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-[''] pointer-fine:after:hidden",
        syntax === 'tmux'
          ? 'hover:text-cmd-hover'
          : 'decoration-accent underline-offset-3 hover:text-cmd-hover hover:underline',
        className,
      )}
      {...props}
    >
      <code className="font-[inherit]">{syntax === 'tmux' ? highlightTmux(text) : highlightShell(text)}</code>
    </button>
  );
}
