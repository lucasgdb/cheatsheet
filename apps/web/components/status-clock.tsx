'use client';

import { useEffect, useState } from 'react';

function format(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const month = date.toLocaleString('en', { month: 'short' });
  return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}-${month}-${String(date.getFullYear()).slice(2)}`;
}

/** tmux's default status-right clock. Renders after mount to avoid a hydration mismatch. */
export function StatusClock({ className }: { className?: string }) {
  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const tick = () => setNow(format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className={className}>{now}</span>;
}
