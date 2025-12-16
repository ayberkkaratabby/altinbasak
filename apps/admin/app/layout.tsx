import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Premium Admin Panel',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  icons: {
    icon: '/logo-icon.svg',
    shortcut: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}

