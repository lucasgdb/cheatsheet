/**
 * Key notation used in `Entry.keys`:
 * - Each string is one alternative; alternatives render separated by "/".
 * - Space-separated tokens inside an alternative are pressed in sequence ("then").
 * - `P` is the sheet's prefix key (only for `control.kind === "prefix"`).
 * - `C-x` means Ctrl + x.
 */
export type Entry = {
  title: string;
  keys?: string[];
  commands?: string[];
};

export type Category = {
  id: string;
  description: string;
  entries: Entry[];
};

export type ControlOption = {
  value: string;
  label: string;
};

export type Control =
  | {
      /** Replaces the `P` token in key sequences. */
      kind: 'prefix';
      label: string;
      default: string;
      options: ControlOption[];
    }
  | {
      /** Replaces the leading binary name in commands (e.g. kubectl → k). */
      kind: 'alias';
      binary: string;
      label: string;
      default: string;
      options: ControlOption[];
    };

/** How commands are highlighted. */
export type Syntax = 'tmux' | 'shell';

/** How category labels read in the status bar and pane headers. */
export type WindowStyle = 'index' | 'colon';

export type Cheatsheet = {
  slug: string;
  name: string;
  syntax: Syntax;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    /** Shell command shown in the prompt line above the title. */
    command: string;
    lede: string;
  };
  search: {
    label: string;
    placeholder: string;
  };
  control: Control;
  status: {
    left: string;
    windowStyle: WindowStyle;
    countNoun: string;
    /** Extra static items on the right side of the status bar. */
    right: string[];
    clock: boolean;
  };
  categories: Category[];
};
