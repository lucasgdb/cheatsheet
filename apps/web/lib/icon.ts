import { defaultTheme, groundColor, sheetThemes } from './themes';

/** The accent the icon glyph takes for a cheat sheet (the default for the site itself). */
export function iconAccent(slug?: string): string {
  return (slug && sheetThemes[slug]?.accent) || defaultTheme.accent;
}

/**
 * The app icon: the "> _" prompt glyph of app/icon.svg on a 32-unit grid, the chevron in
 * the sheet's accent. Maskable icons keep the glyph inside the 80% safe zone of a
 * full-bleed square; the others are a rounded square filled by the glyph.
 */
export function iconSvg({ size = 32, accent = defaultTheme.accent, maskable = false }: { size?: number; accent?: string; maskable?: boolean }) {
  const inset = maskable ? 0.2 : 0;
  const radius = maskable ? 0 : 6;
  const scale = (1 - inset * 2) * (size / 32);
  const offset = inset * size;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius * (size / 32)}" fill="${groundColor}"/><g transform="translate(${offset} ${offset}) scale(${scale})"><path d="M8 11l5 5-5 5" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 22h9" stroke="#eef1f5" stroke-width="2.5" stroke-linecap="round"/></g></svg>`;
}
