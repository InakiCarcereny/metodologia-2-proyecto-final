import './globals.css';
import type { Metadata, Viewport } from 'next';
import type { NextFont } from 'next/dist/compiled/@next/font';
import { IBM_Plex_Mono } from 'next/font/google';
import type { JSX } from 'react';
import { Toaster } from 'sileo';

const ibmPlexMono: NextFont = IBM_Plex_Mono({
  display: 'swap',
  subsets: ['latin'],
  weight: '400',
});

const APP_NAME = 'DevHub';
const APP_DESCRIPTION =
  'DevHub es una red social para desarrolladores: perfiles integrados con GitHub, repositorios y lenguajes destacados, y publicaciones con syntax highlighting.';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  authors: [{ name: 'Iñaki Carcereny' }, { name: 'Valentín De Pascale' }],
  description: APP_DESCRIPTION,
  keywords: [
    'DevHub',
    'red social para desarrolladores',
    'GitHub',
    'syntax highlighting',
    'Next.js',
    'comunidad de programadores',
  ],
  manifest: '/site.webmanifest',
  metadataBase: new URL(APP_URL),
  openGraph: {
    description: APP_DESCRIPTION,
    locale: 'es_AR',
    siteName: APP_NAME,
    title: APP_NAME,
    type: 'website',
    url: APP_URL,
  },
  title: {
    default: `${APP_NAME} — Red social exclusiva para desarrolladores`,
    template: `%s · ${APP_NAME}`,
  },
  twitter: {
    card: 'summary_large_image',
    description: APP_DESCRIPTION,
    title: APP_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: '#171b22',
};

export default function RootLayout({
  children,
}: LayoutProps<'/'>): JSX.Element {
  return (
    <html className={`${ibmPlexMono.className} h-full antialiased`} lang="en">
      <body className="flex min-h-full flex-col">
        <Toaster
          options={{ fill: '#171b22' }}
          position="bottom-right"
          theme="light"
        />

        {children}
      </body>
    </html>
  );
}
