import Link from 'next/link';
import { cheatsheets } from '@cheatsheets/content';
import { Nav, NavBrand, NavLink } from '@cheatsheets/ui';

export function SiteNav({ current }: { current?: string }) {
  return (
    <Nav brand={<NavBrand render={<Link href="/" />} />}>
      {cheatsheets.map((sheet) => (
        <NavLink key={sheet.slug} current={sheet.slug === current} render={<Link href={`/${sheet.slug}`} />}>
          {sheet.name}
        </NavLink>
      ))}
    </Nav>
  );
}
