'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, use, useCallback, useEffect, useRef, type ComponentProps, type MouseEvent } from 'react';
import { cheatsheets } from '@cheatsheets/content';

type Direction = 'forward' | 'back';

/** Navigation order: home first, then cheat sheets as listed in the nav. Decides the slide direction. */
const ORDER = ['/', ...cheatsheets.map((sheet) => `/${sheet.slug}`)];

const NavigateContext = createContext<(href: string) => void>(() => {});

/**
 * Swaps pages inside a view transition when the browser supports it, so the old
 * cheat sheet slides out and the new one in (mirrored when going back in the nav order).
 * The transition waits until the new route has rendered. Without support, or with
 * reduced motion, it navigates at once.
 */
export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    pathnameRef.current = pathname;
    pending.current?.();
    pending.current = null;
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!document.startViewTransition || reduce) {
        router.push(href);
        return;
      }

      const direction: Direction = ORDER.indexOf(href) >= ORDER.indexOf(pathnameRef.current) ? 'forward' : 'back';
      document.documentElement.dataset.direction = direction;

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pending.current = resolve;
            router.push(href);
            // Never keep the page frozen if the route takes too long.
            window.setTimeout(resolve, 1500);
          }),
      );
      void transition.finished.finally(() => {
        delete document.documentElement.dataset.direction;
      });
    },
    [router],
  );

  return <NavigateContext value={navigate}>{children}</NavigateContext>;
}

/** next/link that navigates inside a view transition. Modified clicks (new tab, etc.) behave normally. */
export function TransitionLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const navigate = use(NavigateContext);
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (href === pathname) return;
    event.preventDefault();
    navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
