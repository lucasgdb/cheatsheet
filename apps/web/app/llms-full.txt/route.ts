import { cheatsheets, type Cheatsheet } from '@cheatsheets/content';
import { authorName, siteUrl } from '@/lib/site';

export const dynamic = 'force-static';

/** Key notation to plain text: "P d" → "prefix then d", "C-o" → "Ctrl+o". */
function keyText(sheet: Cheatsheet, alternatives: string[]): string {
  return alternatives
    .map((alt) =>
      alt
        .split(' ')
        .map((token) => {
          if (token === 'P' && sheet.control.kind === 'prefix') return `prefix (${sheet.control.default})`;
          if (token.startsWith('C-') && token.length > 2) return `Ctrl+${token.slice(2)}`;
          if (token.startsWith('M-') && token.length > 2) return `Alt+${token.slice(2)}`;
          return token;
        })
        .join(' then '),
    )
    .join(' / ');
}

function sheetMarkdown(sheet: Cheatsheet): string {
  const out = [`# ${sheet.name} cheat sheet`, '', `Source: ${siteUrl}/${sheet.slug} · updated ${sheet.updatedAt} · ${sheet.testedWith}`, '', sheet.hero.lede, ''];
  for (const category of sheet.categories) {
    out.push(`## ${sheet.name} ${category.title.toLowerCase()}`, '', category.description, '');
    for (const entry of category.entries) {
      const parts = [entry.keys?.length ? `\`${keyText(sheet, entry.keys)}\`` : '', ...(entry.commands ?? []).map((c) => `\`${c}\``)].filter(Boolean);
      out.push(`- ${entry.title}: ${parts.join(', ')}`);
    }
    out.push('');
  }
  return out.join('\n');
}

export function GET() {
  const body = [`# cheatsheets (by ${authorName})`, '', ...cheatsheets.map(sheetMarkdown)].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
