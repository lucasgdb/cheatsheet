import type { ComponentProps, ReactNode } from 'react';
import { cn } from './cn';

export type CommandSyntax = 'tmux' | 'vim' | 'shell' | 'claude';

/** Prompt-box input in Claude Code: slash commands, ! bash, @ mentions and # memory. */
const CLAUDE_INPUT = /^[/!@#&]/;

const PUNCTUATION = new Set(['|', '>', '--']);
const ENV_ASSIGNMENT = /^[A-Z_][A-Z0-9_]*=/;

/** tmux / vim: commands starting with ":" run inside the app, everything else in the shell. */
function highlightPrompt(text: string): ReactNode {
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
  const tokens = text.split(' ');
  const binaryIndex = tokens.findIndex((token) => !ENV_ASSIGNMENT.test(token));
  const parts = tokens.map((token, i) => {
    let className: string | undefined;
    if (i <= binaryIndex || PUNCTUATION.has(token)) className = 'text-muted';
    else if (token.startsWith('-')) className = 'text-flag';
    // A quoted argument (a prompt, a JSON string) is never the verb.
    else if (!verbSeen && !/^["']/.test(token)) {
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

/** claude: prompt-box input keeps its leading word in the accent, shell commands read like 'shell'. */
function highlightClaude(text: string): ReactNode {
  if (!CLAUDE_INPUT.test(text)) return highlightShell(text);
  const space = text.indexOf(' ');
  const head = space === -1 ? text : text.slice(0, space);
  return (
    <>
      <span className="text-verb">{head}</span>
      {space === -1 ? null : text.slice(space)}
    </>
  );
}

function highlight(text: string, syntax: CommandSyntax): ReactNode {
  if (syntax === 'shell') return highlightShell(text);
  if (syntax === 'claude') return highlightClaude(text);
  return highlightPrompt(text);
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
        syntax === 'shell' || syntax === 'claude'
          ? 'decoration-accent underline-offset-3 hover:text-cmd-hover hover:underline'
          : 'hover:text-cmd-hover',
        className,
      )}
      {...props}
    >
      <code className="font-[inherit]">{highlight(text, syntax)}</code>
    </button>
  );
}
