/**
 * Renders the ready-made PDFs in public/pdf from the built site, one per cheat sheet and
 * per setting of its control (tmux prefix, kubectl alias, …), in the sheet's own design.
 *
 *   pnpm build && pnpm pdf
 *
 * Needs a Chromium for playwright-core: `pnpm exec playwright-core install chromium`,
 * or point CHROMIUM_PATH at an existing binary.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { cheatsheets, pdfFileName, type Cheatsheet } from '@cheatsheets/content';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public', 'pdf');
const port = Number(process.env.PDF_PORT ?? 4319);
const base = `http://localhost:${port}`;
const siteHost = 'cheatsheet.lucasbittencourt.dev';

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

const escapeHtml = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);

// Margins (mm). The templates below fill them exactly; Chromium's default template padding is removed.
const marginTop = 5;
const marginBottom = 9;

/** Page footer drawn by Chromium in the bottom margin: the sheet's status bar. */
function footerTemplate(sheet: Cheatsheet, settingLabel: string, colors: { bar: string; barFg: string; font: string }) {
  // The font list carries double quotes; inside a style="" attribute they'd end it early.
  const font = colors.font.replaceAll('"', "'");
  return `
    <style>#footer { padding: 0 !important; }</style>
    <div style="-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box;width:100%;height:${marginBottom}mm;
      margin:0;padding:0 32px;display:flex;align-items:center;justify-content:space-between;
      background:${colors.bar};color:${colors.barFg};font-family:${font};font-size:9px;">
      <span>${escapeHtml(sheet.status.left)}&nbsp;&nbsp;${escapeHtml(sheet.name)} cheat sheet&nbsp;&nbsp;·&nbsp;&nbsp;${escapeHtml(`${sheet.control.label} ${settingLabel}`)}</span>
      <span>${siteHost}/${sheet.slug}&nbsp;&nbsp;·&nbsp;&nbsp;<span class="pageNumber"></span>/<span class="totalPages"></span></span>
    </div>`;
}

/** Page header in the top margin: the page colour, so every page starts on the dark ground. */
function headerTemplate(bg: string) {
  return `<style>#header { padding: 0 !important; }</style><div style="-webkit-print-color-adjust:exact;print-color-adjust:exact;width:100%;height:${marginTop}mm;margin:0;background:${bg};"></div>`;
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const server = startServer();
  try {
    await waitForServer();
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
    try {
      for (const sheet of cheatsheets) {
        for (const option of sheet.control.options) {
          const context = await browser.newContext({ viewport: { width: 794, height: 1123 } });
          const storageKey = `${sheet.slug}:${sheet.control.kind}`;
          await context.addInitScript(
            ([key, value]) => window.localStorage.setItem(key, value),
            [storageKey, option.value] as const,
          );
          const page = await context.newPage();
          await page.goto(`${base}/${sheet.slug}`, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.documentElement.setAttribute('data-pdf', ''));
          await page.emulateMedia({ media: 'print' });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(300); // let the restored setting re-render

          // No helper functions inside evaluate: tsx would inject a __name() the page doesn't have.
          const [bg, bar, barFg, font] = await page.evaluate((names) => {
            const style = getComputedStyle(document.querySelector('div[data-sheet]') ?? document.body);
            return names.map((name) => style.getPropertyValue(name).trim());
          }, ['--sheet-bg', '--sheet-bar', '--sheet-bar-fg', '--sheet-font-body']);
          const colors = { bg: bg ?? '#0d1015', bar: bar ?? '#a8d38a', barFg: barFg ?? '#0d1015', font: font ?? 'monospace' };

          const file = pdfFileName(sheet, option.value);
          await page.pdf({
            path: path.join(outDir, file),
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: headerTemplate(colors.bg),
            footerTemplate: footerTemplate(sheet, option.label, colors),
            margin: { top: `${marginTop}mm`, bottom: `${marginBottom}mm`, left: '0', right: '0' },
          });
          console.log(`✓ ${file}`);
          await context.close();
        }
      }
    } finally {
      await browser.close();
    }
  } finally {
    server.kill();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
