export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: {
    '@type': string;
    addressCountry: string;
    addressLocality: string;
    addressRegion?: string;
    streetAddress: string;
  };
  contactPoint?: {
    '@type': string;
    telephone: string;
    contactType: string;
  };
}

export interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  image?: string;
  '@id': string;
  url: string;
  telephone: string;
  address: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: {
    '@type': string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
  priceRange?: string;
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: {
    '@type': string;
    position: number;
    name: string;
    item: string;
  }[];
}

export function createOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Patisserie',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://patisserie.com',
    description: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
      addressLocality: 'Tekirdağ',
      streetAddress: 'Rüstem Paşa Mahallesi, Hükümet Caddesi No: 45',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-282-123-45-67',
      contactType: 'customer service',
    },
  };
}

export function createBreadcrumbSchema(items: { name: string; url: string }[]): BreadcrumbSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patisserie.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

export function createLocalBusinessSchema(branch: {
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: { weekdays: string; weekend?: string };
  coordinates?: { lat: number; lng: number };
  slug: string;
}): LocalBusinessSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patisserie.com';
  const url = `${baseUrl}/subeler/${branch.slug}`;
  
  // Parse address to extract postal code
  const postalCodeMatch = branch.address.match(/\d{5}/);
  const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
  
  // Parse address to extract street address (remove postal code and city)
  const streetAddress = branch.address
    .replace(/,?\s*\d{5}.*$/, '')
    .replace(new RegExp(`,\\s*${branch.city}.*$`, 'i'), '')
    .trim();

  const openingHours: LocalBusinessSchema['openingHoursSpecification'] = [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: branch.hours.weekdays.split(' - ')[0],
      closes: branch.hours.weekdays.split(' - ')[1],
    },
  ];

  if (branch.hours.weekend) {
    openingHours.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: branch.hours.weekend.split(' - ')[0],
      closes: branch.hours.weekend.split(' - ')[1],
    });
  }

  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: branch.name,
    '@id': url,
    url,
    telephone: branch.phone.replace(/\s/g, '-'),
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: branch.city,
      addressRegion: branch.city === 'İstanbul' ? 'İstanbul' : branch.city === 'Ankara' ? 'Ankara' : 'Tekirdağ',
      postalCode,
      addressCountry: 'TR',
    },
    openingHoursSpecification: openingHours,
    priceRange: '$$',
  };

  if (branch.coordinates) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: branch.coordinates.lat,
      longitude: branch.coordinates.lng,
    };
  }

  return schema;
}

