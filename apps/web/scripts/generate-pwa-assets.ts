/**
 * Renders the install assets of the PWA: app icons (any + maskable), the Apple touch icon,
 * one shortcut icon per cheat sheet in its accent colour, and the install-dialog screenshots
 * taken from the built site.
 *
 *   pnpm build && pnpm pwa:assets
 *
 * Needs a Chromium for playwright-core (see generate-pdfs.ts), or CHROMIUM_PATH.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium, type Browser } from 'playwright-core';
import { cheatsheets } from '@cheatsheets/content';
import { defaultTheme, groundColor, sheetThemes } from '../lib/themes';

const root = path.resolve(import.meta.dirname, '..');
const iconsDir = path.join(root, 'public', 'icons');
const shotsDir = path.join(root, 'public', 'screenshots');
const port = Number(process.env.PWA_PORT ?? 4320);
const base = `http://localhost:${port}`;

const ground = groundColor;
const text = '#eef1f5';
const defaultAccent = defaultTheme.accent;

/**
 * The prompt glyph of app/icon.svg ("> _") on a 32-unit grid. `inset` is the share of the
 * canvas left as margin around the 32×32 drawing: maskable icons keep the glyph inside the
 * 80% safe zone, so they get more room around it and a full-bleed square.
 */
function iconSvg({ size, accent, maskable }: { size: number; accent: string; maskable: boolean }) {
  const inset = maskable ? 0.2 : 0;
  const radius = maskable ? 0 : 6;
  const scale = (1 - inset * 2) * (size / 32);
  const offset = inset * size;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${radius * (size / 32)}" fill="${ground}"/>
    <g transform="translate(${offset} ${offset}) scale(${scale})">
      <path d="M8 11l5 5-5 5" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 22h9" stroke="${text}" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  </svg>`;
}

async function renderIcon(browser: Browser, file: string, options: Parameters<typeof iconSvg>[0]) {
  const page = await browser.newPage({ viewport: { width: options.size, height: options.size } });
  await page.setContent(`<html><body style="margin:0;background:transparent">${iconSvg(options)}</body></html>`);
  await page.screenshot({ path: file, omitBackground: true, clip: { x: 0, y: 0, width: options.size, height: options.size } });
  await page.close();
  console.log(`✓ ${path.relative(root, file)}`);
}

function startServer() {
  if (!existsSync(path.join(root, '.next', 'BUILD_ID'))) {
    throw new Error('No production build found. Run `pnpm build` first.');
  }
  return spawn('pnpm', ['exec', 'next', 'start', '-p', String(port)], { cwd: root, stdio: 'ignore' });
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server did not start on ${base}`);
}

/** Screenshots listed in the manifest; sizes must match what the manifest declares (app/manifest.ts). */
const shots = [
  { file: 'home-wide.png', route: '/', viewport: { width: 1280, height: 720 }, scale: 1 },
  { file: 'tmux-wide.png', route: '/tmux', viewport: { width: 1280, height: 720 }, scale: 1 },
  { file: 'home-narrow.png', route: '/', viewport: { width: 390, height: 844 }, scale: 2 },
  { file: 'kubectl-narrow.png', route: '/kubectl', viewport: { width: 390, height: 844 }, scale: 2 },
];

async function renderScreenshots(browser: Browser) {
  const server = startServer();
  try {
    await waitForServer();
    for (const shot of shots) {
      // No service worker in screenshots: it would only add a registration race.
      const context = await browser.newContext({
        viewport: shot.viewport,
        deviceScaleFactor: shot.scale,
        serviceWorkers: 'block',
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      await page.goto(`${base}${shot.route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(shotsDir, shot.file) });
      console.log(`✓ public/screenshots/${shot.file}`);
      await context.close();
    }
  } finally {
    server.kill();
  }
}

async function main() {
  mkdirSync(iconsDir, { recursive: true });
  mkdirSync(shotsDir, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const size of [192, 512]) {
      await renderIcon(browser, path.join(iconsDir, `icon-${size}.png`), { size, accent: defaultAccent, maskable: false });
      await renderIcon(browser, path.join(iconsDir, `maskable-${size}.png`), { size, accent: defaultAccent, maskable: true });
    }
    // iOS rounds the corners itself and shows transparency as black: full-bleed, like maskable.
    await renderIcon(browser, path.join(root, 'app', 'apple-icon.png'), { size: 180, accent: defaultAccent, maskable: true });
    for (const sheet of cheatsheets) {
      const accent = sheetThemes[sheet.slug]?.accent ?? defaultAccent;
      await renderIcon(browser, path.join(iconsDir, `shortcut-${sheet.slug}.png`), { size: 96, accent, maskable: false });
    }
    if (!process.argv.includes('--icons-only')) await renderScreenshots(browser);
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
