import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100dvh-var(--spacing-nav))] bg-bg font-mono text-fg">
      <main className="gutter mx-auto grid max-w-[1240px] gap-4 py-16">
        <p className="text-xs text-muted">~/cheatsheets $ cd ./missing</p>
        <h1 className="font-display text-4xl font-extrabold text-hi">no such cheat sheet</h1>
        <Link href="/" className="text-accent hover:underline">
          ← back to all cheat sheets
        </Link>
      </main>
    </div>
  );
}
