import { cheatsheets } from '@cheatsheets/content';

export const dynamic = 'force-static';

/**
 * The service worker, generated at build time so it knows every cheat sheet route and
 * changes with each build (a new version replaces the old caches on activate).
 *
 * - Pages: network first, falling back to the cache, then to the home page.
 * - /_next/static: cache first (file names are content hashed).
 * - Everything else same-origin (fonts, icons, PDFs, OG images): stale while revalidate.
 *
 * On install it caches every page plus the static assets those pages reference,
 * so all cheat sheets open offline right after the first visit.
 */
const version = process.env.APP_VERSION ?? Date.now().toString(36);
const pages = ['/', ...cheatsheets.map((sheet) => `/${sheet.slug}`)];

const source = `
const VERSION = ${JSON.stringify(version)};
const PAGES = ${JSON.stringify(pages)};
const PAGE_CACHE = 'pages-' + VERSION;
const ASSET_CACHE = 'assets-' + VERSION;
const STATIC_ASSET = /\\/_next\\/static\\/[^"'\\s)\\\\]+/g;

async function precache() {
  const pages = await caches.open(PAGE_CACHE);
  const assets = await caches.open(ASSET_CACHE);
  const referenced = new Set();
  await Promise.all(PAGES.map(async (path) => {
    const response = await fetch(path, { cache: 'reload' });
    if (!response.ok) return;
    const html = await response.clone().text();
    for (const match of html.matchAll(STATIC_ASSET)) referenced.add(match[0]);
    await pages.put(path, response);
  }));
  await Promise.all([...referenced].map((url) => assets.add(url).catch(() => {})));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([PAGE_CACHE, ASSET_CACHE]);
    for (const key of await caches.keys()) if (!keep.has(key)) await caches.delete(key);
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

async function networkFirst(event) {
  const cache = await caches.open(PAGE_CACHE);
  const url = new URL(event.request.url);
  const key = url.pathname;
  try {
    const response = (await event.preloadResponse) || (await fetch(event.request));
    if (response.ok && !url.search) cache.put(key, response.clone());
    return response;
  } catch {
    return (await cache.match(key)) || (await cache.match('/')) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(event) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(event.request);
  const fresh = fetch(event.request).then((response) => {
    if (response.ok && response.status !== 206) cache.put(event.request, response.clone());
    return response;
  });
  if (cached) {
    event.waitUntil(fresh.catch(() => {}));
    return cached;
  }
  return fresh;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.headers.has('range')) return;
  // React Server Component payloads of client navigations: let the network (and HTTP cache) handle them.
  if (request.headers.get('rsc') || url.searchParams.has('_rsc')) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(event));
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
  } else if (url.pathname !== '/sw.js') {
    event.respondWith(staleWhileRevalidate(event));
  }
});
`;

export function GET() {
  return new Response(source.trimStart(), {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
