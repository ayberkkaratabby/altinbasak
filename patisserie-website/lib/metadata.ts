import { Metadata } from 'next';

const siteName = 'Patisserie';
const siteDescription = 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patisserie.com';

export function createMetadata({
  title,
  description,
  path = '',
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  const url = `${siteUrl}${path}`;
  const ogImage = image ? `${siteUrl}${image}` : `${siteUrl}/og-image.jpg`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export const defaultMetadata: Metadata = createMetadata({
  title: 'Ana Sayfa',
  description: siteDescription,
  path: '/',
});

