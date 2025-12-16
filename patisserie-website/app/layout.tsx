import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { createOrganizationSchema } from '@/lib/jsonld';

const playfairDisplay = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const inter = Inter({
  variable: '--font-text',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://patisserie.com'),
  title: {
    default: 'Patisserie | Tekirdağ',
    template: '%s | Patisserie',
  },
  description: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.',
  keywords: ['patisserie', 'pastane', 'tekirdağ', 'lüks', 'pasta', 'tatlı'],
  authors: [{ name: 'Patisserie' }],
  creator: 'Patisserie',
  publisher: 'Patisserie',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://patisserie.com',
    siteName: 'Patisserie',
    title: 'Patisserie | Tekirdağ',
    description: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patisserie | Tekirdağ',
    description: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.',
  },
  verification: {
    // Add verification codes when available
  },
};

const organizationSchema = createOrganizationSchema();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
