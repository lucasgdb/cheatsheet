export type KeyGroup = {
  /** True when this group is the user's prefix key. */
  prefix: boolean;
  keys: string[];
};

/** One alternative: groups pressed in sequence. */
export type KeySequence = KeyGroup[];

/**
 * Parses key notation into renderable groups.
 * - Each string is an alternative.
 * - Space-separated tokens are pressed in sequence.
 * - `P` is replaced by the prefix (e.g. "Ctrl+b") when one is given.
 * - `C-x` means Ctrl + x, `M-x` means Meta + x (`meta` names it: Alt, Option…), `S-x` means Shift + x.
 */
export function parseKeys(alternatives: string[], prefix?: string, meta = 'Alt'): KeySequence[] {
  return alternatives.map((alternative) =>
    alternative.split(' ').map((token): KeyGroup => {
      if (prefix && token === 'P') return { prefix: true, keys: prefix.split('+') };
      if (token.startsWith('C-') && token.length > 2) return { prefix: false, keys: ['Ctrl', token.slice(2)] };
      if (token.startsWith('M-') && token.length > 2) return { prefix: false, keys: [meta, token.slice(2)] };
      if (token.startsWith('S-') && token.length > 2) return { prefix: false, keys: ['Shift', token.slice(2)] };
      return { prefix: false, keys: [token] };
    }),
  );
}

export function keysToText(sequences: KeySequence[]): string {
  return sequences.map((groups) => groups.map((group) => group.keys.join('+')).join(' then ')).join(' / ');
}
