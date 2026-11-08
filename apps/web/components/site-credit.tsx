import { authorName, authorUrl } from '@/lib/site';

/** "Made by" line shared by every page footer. */
export function SiteCredit() {
  return (
    <p>
      Made by <a href={authorUrl}>{authorName}</a>. Free, no ads, no tracking. Spotted a mistake?{' '}
      <a href="mailto:lucasgdbittencourt@gmail.com">Tell me</a>.
    </p>
  );
}
