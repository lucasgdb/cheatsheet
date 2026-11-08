# cheatsheets

Searchable, ad-free cheat sheets for command line tools. Each cheat sheet has its own design system.

## Stack

Next.js 16 (App Router, static generation) · React 19 · TypeScript 7 · Tailwind CSS 4 · Base UI · pnpm workspaces · Docker Compose

## Layout

```
apps/web            Next.js site (routes, SEO, page composition)
packages/ui         Design system: components, Tailwind theme, per-sheet tokens (all CSS lives here)
packages/content    Typed cheat sheet data (tmux, kubectl)
```

## Run

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm typecheck
pnpm build
```

With Docker:

```bash
docker compose up -d --build   # canonical URL: https://cheatsheet.lucasbittencourt.dev
```

## Printable PDFs

The `print` button opens a ready-made PDF from `apps/web/public/pdf`, one per cheat sheet and per setting (`tmux-ctrl-a.pdf`, `kubectl-k.pdf`, …), drawn in each sheet's design system. Regenerate them after changing content or styles:

```bash
pnpm build
pnpm pdf            # needs Chromium: pnpm --filter @cheatsheets/web exec playwright-core install chromium
```

Set `CHROMIUM_PATH` to use an existing Chromium binary instead.

## Installable app (PWA)

The site installs as an app (`app/manifest.ts`) and works offline: the service worker (`app/sw.js/route.ts`, registered in production only) caches every cheat sheet on the first visit. The manifest carries per-sheet shortcuts and install-dialog screenshots. Icons and screenshots are rendered by a script; regenerate them after changing the icon, colours or layout:

```bash
pnpm build
pnpm pwa:assets     # public/icons, public/screenshots, app/apple-icon.png (same Chromium setup as pnpm pdf)
```

## Add a cheat sheet

1. Create `packages/content/src/<slug>.ts` exporting a `Cheatsheet` and add it to `cheatsheets` in `index.ts`.
2. Add a `[data-sheet='<slug>']` token block in `packages/ui/src/styles.css` (override only what differs from the base).
3. If it needs new fonts, load them in `apps/web/app/layout.tsx` and point `--sheet-font-*` at them.
4. Add its colours to `apps/web/lib/themes.ts`, then run `pnpm build && pnpm pdf && pnpm pwa:assets`.
