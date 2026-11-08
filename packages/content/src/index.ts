import { kubectl } from './kubectl';
import { tmux } from './tmux';
import type { Cheatsheet } from './types';

export type * from './types';

/** Order here is the order in the site navigation. */
export const cheatsheets: Cheatsheet[] = [tmux, kubectl];

export function getCheatsheet(slug: string): Cheatsheet | undefined {
  return cheatsheets.find((sheet) => sheet.slug === slug);
}

export function countEntries(sheet: Cheatsheet): number {
  return sheet.categories.reduce((total, category) => total + category.entries.length, 0);
}
