import type { Category, Cheatsheet } from '@cheatsheets/content';

/** "Config and contexts" → "config and contexts"; keeps acronyms like "RBAC". */
function lowerFirst(text: string): string {
  return /^[A-Z][A-Z]/.test(text) ? text : text.charAt(0).toLowerCase() + text.slice(1);
}

/** Section heading as people search for it, e.g. "tmux sessions", "kubectl RBAC". */
export function sectionHeading(sheet: Cheatsheet, category: Category): string {
  return `${sheet.name} ${lowerFirst(category.title)}`;
}
