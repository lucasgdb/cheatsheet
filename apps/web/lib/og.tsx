import { ImageResponse } from 'next/og';
import { defaultTheme, sheetThemes } from './themes';

export const ogSize = { width: 1200, height: 630 };

/** Terminal-style social image: prompt line, big title, summary and a status bar. */
export function renderOgImage({
  slug,
  title,
  suffix = 'cheatsheet',
  command,
  summary,
  status,
}: {
  slug?: string;
  title: string;
  /** Text after the accent underscore ("tmux_cheatsheet"); empty for the site itself. */
  suffix?: string;
  command: string;
  summary: string;
  status: string;
}) {
  const theme = (slug && sheetThemes[slug]) || defaultTheme;
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#0d1015', fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '72px 80px', gap: 28 }}>
          <div style={{ display: 'flex', fontSize: 28, color: '#7d8696' }}>
            ~/cheatsheets&nbsp;<span style={{ color: theme.accent }}>(main)</span>&nbsp;$ {command}
          </div>
          <div style={{ display: 'flex', fontSize: 104, fontWeight: 800, color: '#eef1f5', letterSpacing: -4, lineHeight: 1 }}>
            {title}
            <span style={{ color: theme.accent }}>_</span>
            {suffix}
          </div>
          <div style={{ display: 'flex', fontSize: 34, color: '#8f98a8', lineHeight: 1.4, maxWidth: 980 }}>{summary}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', height: 64, padding: '0 80px', background: theme.bar, color: theme.barFg, fontSize: 26 }}>
          {/* ASCII only: other glyphs would make the image renderer fetch fonts at build time. */}
          {status.replace(/[^\x20-\x7E]/g, '').trim()}
        </div>
      </div>
    ),
    ogSize,
  );
}
