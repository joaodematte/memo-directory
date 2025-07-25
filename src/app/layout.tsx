/* eslint-disable @next/next/no-sync-scripts */
import { type Metadata } from 'next';
import {
  Geist_Mono,
  IBM_Plex_Mono,
  Inter,
  JetBrains_Mono
} from 'next/font/google';

import { cn } from '@/lib/utils';
import { TRPCReactProvider } from '@/trpc/react';

import '@/styles/globals.css';

import { Providers } from '@/app/providers';

export const metadata: Metadata = {
  title: 'memo.directory',
  description:
    'Create smart bookmarks with custom tags and colors. Find any saved link instantly with powerful search, filtering and keyboard-first navigation.'
};

const fontSans = Inter({
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
      <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head>
      <body>
        <TRPCReactProvider>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
