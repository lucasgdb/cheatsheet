import { claude } from './claude';
import { docker } from './docker';
import { kubectl } from './kubectl';
import { terraform } from './terraform';
import { tmux } from './tmux';
import { vim } from './vim';
import type { Cheatsheet } from './types';

export type * from './types';

/** Order here is the order in the site navigation. */
export const cheatsheets: Cheatsheet[] = [tmux, vim, kubectl, docker, terraform, claude];

export function getCheatsheet(slug: string): Cheatsheet | undefined {
  return cheatsheets.find((sheet) => sheet.slug === slug);
}

export function countEntries(sheet: Cheatsheet): number {
  return sheet.categories.reduce((total, category) => total + category.entries.length, 0);
}

/**
 * File name of a ready-made PDF in /public/pdf: "tmux.pdf" for the default setting,
 * "tmux-ctrl-a.pdf" for Ctrl+a, "kubectl-k.pdf" for the k alias.
 */
export function pdfFileName(sheet: Cheatsheet, setting: string): string {
  if (setting === sheet.control.default) return `${sheet.slug}.pdf`;
  const suffix = setting.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${sheet.slug}-${suffix}.pdf`;
}
