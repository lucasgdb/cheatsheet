import { cheatsheets } from '@cheatsheets/content';
import { Nav, NavBrand, NavLink } from '@cheatsheets/ui';
import { TransitionLink } from './view-transitions';

export function SiteNav({ current }: { current?: string }) {
  return (
    <Nav brand={<NavBrand render={<TransitionLink href="/" />} />}>
      {cheatsheets.map((sheet) => (
        <NavLink key={sheet.slug} current={sheet.slug === current} render={<TransitionLink href={`/${sheet.slug}`} />}>
          {sheet.name}
        </NavLink>
      ))}
    </Nav>
  );
}
