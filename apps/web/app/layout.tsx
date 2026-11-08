import type { Metadata, Viewport } from 'next';
import {
  Fira_Code,
  IBM_Plex_Mono,
  JetBrains_Mono,
  Manrope,
  Martian_Mono,
  Red_Hat_Display,
  Red_Hat_Mono,
  Rubik,
  Source_Code_Pro,
  Victor_Mono,
} from 'next/font/google';
import { ToastProvider } from '@cheatsheets/ui';
import { SiteNav } from '@/components/site-nav';
import { siteDescription, siteName, siteUrl } from '@/lib/site';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono-src', display: 'swap' });
const martianMono = Martian_Mono({ subsets: ['latin'], weight: ['800'], variable: '--font-martian-mono-src', display: 'swap' });
const redHatDisplay = Red_Hat_Display({ subsets: ['latin'], weight: ['900'], variable: '--font-red-hat-display-src', display: 'swap' });
const redHatMono = Red_Hat_Mono({ subsets: ['latin'], variable: '--font-red-hat-mono-src', display: 'swap' });
// Only the active sheet's faces are used on a page, so the others are not preloaded.
const rubik = Rubik({ subsets: ['latin'], weight: ['800'], variable: '--font-rubik-src', display: 'swap', preload: false });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-ibm-plex-mono-src', display: 'swap', preload: false });
const manrope = Manrope({ subsets: ['latin'], weight: ['800'], variable: '--font-manrope-src', display: 'swap', preload: false });
const victorMono = Victor_Mono({ subsets: ['latin'], weight: ['700'], style: ['italic'], variable: '--font-victor-mono-src', display: 'swap', preload: false });
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], variable: '--font-source-code-pro-src', display: 'swap', preload: false });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code-src', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName}: command line cheat sheets`, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  openGraph: { type: 'website', siteName, url: '/' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0c10',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [jetbrainsMono, martianMono, redHatDisplay, redHatMono, rubik, ibmPlexMono, manrope, firaCode, victorMono, sourceCodePro].map((font) => font.variable).join(' ');
  return (
    <html lang="en" className={fonts}>
      <body>
        <ToastProvider>
          <SiteNav />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
