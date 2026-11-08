import { cheatsheets } from '@cheatsheets/content';
import { iconAccent, iconSvg } from '@/lib/icon';

export const dynamicParams = false;

export function generateStaticParams() {
  return cheatsheets.map((sheet) => ({ slug: sheet.slug }));
}

/** Tab icon of a cheat sheet: the site icon with the chevron in the sheet's accent. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return new Response(iconSvg({ accent: iconAccent(slug) }), {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
  });
}
