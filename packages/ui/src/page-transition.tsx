'use client';

import { ViewTransition, type ReactNode } from 'react';

/** Transition types set by navigation links; anything else (browser back/forward, refresh) does not animate. */
const SLIDE = { 'sheet-forward': 'sheet-forward', 'sheet-back': 'sheet-back', default: 'none' } as const;

/**
 * Wraps a page's content so it slides in and out on navigation, in the direction
 * given by the link's transition type. The header and status bar have their own
 * view-transition names, so they stay out of the slide.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={SLIDE} exit={SLIDE} default="none">
      {children}
    </ViewTransition>
  );
}
