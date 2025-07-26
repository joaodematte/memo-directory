import { type Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { cn } from '@/lib/utils';
import { TRPCReactProvider } from '@/trpc/react';

import '@/styles/globals.css';

import { Providers } from '@/app/providers';

export const metadata: Metadata = {
  title: {
    template: '%s — memo.directory',
    default: 'memo.directory'
  },
  description:
    'Create smart bookmarks with custom tags and colors. Find any saved link instantly with powerful search, filtering and keyboard-first navigation.',
  keywords: '',
  authors: [{ name: 'João Dematte', url: 'https://joaodematte.com' }],
  creator: 'João Dematte',
  openGraph: {
    title: {
      template: '%s — memo.directory',
      default: 'memo.directory'
    },
    description:
      'Create smart bookmarks with custom tags and colors. Find any saved link instantly with powerful search, filtering and keyboard-first navigation.',
    url: 'https://memo.directory/',
    siteName: 'memo.directory',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'memo.directory',
    description:
      'Create smart bookmarks with custom tags and colors. Find any saved link instantly with powerful search, filtering and keyboard-first navigation.',
    site: 'https://memo.directory/',
    creator: '@joaodematte'
  }
};

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        fontSans.variable,
        fontMono.variable,
        'isolate font-sans antialiased'
      )}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
