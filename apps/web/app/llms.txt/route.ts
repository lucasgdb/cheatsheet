import { cheatsheets } from '@cheatsheets/content';
import { authorName, authorUrl, siteDescription, siteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const lines = [
    '# cheatsheets',
    '',
    `> ${siteDescription} Made by ${authorName} (${authorUrl}).`,
    '',
    'Each cheat sheet lists the shortcuts and commands of one command line tool, grouped by task, checked against the official documentation.',
    '',
    '## Cheat sheets',
    '',
    ...cheatsheets.map((sheet) => `- [${sheet.name} cheat sheet](${siteUrl}/${sheet.slug}): ${sheet.summary}`),
    '',
    '## Optional',
    '',
    `- [Full text of every cheat sheet](${siteUrl}/llms-full.txt): all entries as Markdown.`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
