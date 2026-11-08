import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Martian_Mono, Red_Hat_Display, Red_Hat_Mono } from 'next/font/google';
import { ToastProvider } from '@cheatsheets/ui';
import { SiteNav } from '@/components/site-nav';
import { siteDescription, siteName, siteUrl } from '@/lib/site';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono-src', display: 'swap' });
const martianMono = Martian_Mono({ subsets: ['latin'], weight: ['800'], variable: '--font-martian-mono-src', display: 'swap' });
const redHatDisplay = Red_Hat_Display({ subsets: ['latin'], weight: ['900'], variable: '--font-red-hat-display-src', display: 'swap' });
const redHatMono = Red_Hat_Mono({ subsets: ['latin'], variable: '--font-red-hat-mono-src', display: 'swap' });

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
  const fonts = [jetbrainsMono, martianMono, redHatDisplay, redHatMono].map((font) => font.variable).join(' ');
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
