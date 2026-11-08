'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from './cn';

/**
 * Sticky, blurred site header. Rendered once in the root layout so it persists across
 * navigations; `site-nav` gives it its own view-transition layer (see styles.css).
 */
export function Nav({ brand, children, className, ...props }: ComponentProps<'header'> & { brand: ReactNode }) {
  return (
    <header
      className={cn(
        'site-nav sticky top-[env(safe-area-inset-top,0px)] z-50 h-nav border-b border-line/80 bg-nav/70 backdrop-blur-md backdrop-saturate-150',
        className,
      )}
      {...props}
    >
      <div className="gutter mx-auto flex h-full max-w-[1240px] items-center gap-5">
        {brand}
        <nav aria-label="Cheatsheets" className="flex min-w-0 gap-0.5 overflow-x-auto [scrollbar-width:none]">
          {children}
        </nav>
      </div>
    </header>
  );
}

export function NavBrand({ render, className, ...props }: useRender.ComponentProps<'a'>) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        className: cn('flex items-center gap-2 text-[13px] font-bold whitespace-nowrap text-hi pointer-coarse:py-3', className),
        children: (
          <>
            <span className="text-accent">&gt;_</span>cheatsheets
          </>
        ),
      },
      props,
    ),
  });
}

/** A nav tab. Pass `render={<Link href="…" />}` to use a router link. */
export function NavLink({
  render,
  current,
  className,
  ...props
}: useRender.ComponentProps<'a'> & { current?: boolean }) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        'aria-current': current ? 'page' : undefined,
        className: cn(
          'rounded px-2.5 py-1.5 transition-colors text-[13px] whitespace-nowrap pointer-coarse:py-3 text-muted-2 hover:text-hi aria-[current=page]:bg-ctl-on aria-[current=page]:text-accent',
          className,
        ),
      },
      props,
    ),
  });
}

export type NavLinkProps = ComponentProps<typeof NavLink>;
