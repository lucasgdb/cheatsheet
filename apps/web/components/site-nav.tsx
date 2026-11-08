'use client';

import { usePathname } from 'next/navigation';
import { cheatsheets } from '@cheatsheets/content';
import { Nav, NavBrand, NavLink } from '@cheatsheets/ui';
import { TransitionLink } from './view-transitions';

/**
 * Site header, rendered once in the root layout so it never remounts. Each tab carries
 * its sheet's design tokens (data-sheet), so only the selected tab's colour changes.
 */
export function SiteNav() {
  const pathname = usePathname();
  const current = cheatsheets.find((sheet) => pathname === `/${sheet.slug}`);
  return (
    // The brand's prompt takes the current sheet's accent, like its tab icon.
    <Nav brand={<NavBrand data-sheet={current?.slug} render={<TransitionLink href="/" />} />}>
      {cheatsheets.map((sheet) => (
        <NavLink
          key={sheet.slug}
          data-sheet={sheet.slug}
          current={pathname === `/${sheet.slug}`}
          render={<TransitionLink href={`/${sheet.slug}`} />}
        >
          {sheet.name}
        </NavLink>
      ))}
    </Nav>
  );
}
