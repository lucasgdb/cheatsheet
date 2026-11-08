import { cheatsheets } from '@cheatsheets/content';
import { ogSize, renderOgImage } from '@/lib/og';

export const alt = 'cheatsheets: searchable command line cheat sheets';
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'cheatsheets',
    suffix: '',
    command: 'ls',
    summary: `Searchable ${cheatsheets.map((sheet) => sheet.name).join(' and ')} cheat sheets, adapted to your setup. Free, no ads.`,
    status: `[cheat]  ${cheatsheets.map((sheet, index) => `${index}:${sheet.slug}`).join('  ')}`,
  });
}
