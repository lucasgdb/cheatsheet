import type { MetadataRoute } from 'next';
import { cheatsheets } from '@cheatsheets/content';
import { groundColor } from '@/lib/themes';
import { siteDescription, siteName } from '@/lib/site';

/** Icons and screenshots are rendered by `pnpm pwa:assets` (scripts/generate-pwa-assets.ts). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: `${siteName}: command line cheat sheets`,
    short_name: siteName,
    description: siteDescription,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone'],
    orientation: 'any',
    background_color: groundColor,
    theme_color: '#0a0c10',
    lang: 'en',
    dir: 'ltr',
    categories: ['developer', 'productivity', 'utilities', 'education'],
    prefer_related_applications: false,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
    shortcuts: cheatsheets.map((sheet) => ({
      name: `${sheet.name} cheat sheet`,
      short_name: sheet.name,
      url: `/${sheet.slug}`,
      icons: [{ src: `/icons/shortcut-${sheet.slug}.png`, sizes: '96x96', type: 'image/png' }],
    })),
    screenshots: [
      { src: '/screenshots/home-wide.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'All cheat sheets' },
      { src: '/screenshots/tmux-wide.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'tmux cheat sheet' },
      { src: '/screenshots/home-narrow.png', sizes: '780x1688', type: 'image/png', form_factor: 'narrow', label: 'All cheat sheets' },
      { src: '/screenshots/kubectl-narrow.png', sizes: '780x1688', type: 'image/png', form_factor: 'narrow', label: 'kubectl cheat sheet' },
    ],
  };
}
