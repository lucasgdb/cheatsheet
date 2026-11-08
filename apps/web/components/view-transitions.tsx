'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { cheatsheets } from '@cheatsheets/content';

/** Navigation order: home first, then cheat sheets as listed in the nav. Decides the slide direction. */
const ORDER = ['/', ...cheatsheets.map((sheet) => `/${sheet.slug}`)];

/**
 * next/link tagged with the slide direction for React's <ViewTransition>
 * (see PageTransition in the design system): forward when moving right in the nav order.
 */
export function TransitionLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  const direction = ORDER.indexOf(href) >= ORDER.indexOf(pathname) ? 'sheet-forward' : 'sheet-back';
  return <Link href={href} transitionTypes={href === pathname ? undefined : [direction]} {...props} />;
}
