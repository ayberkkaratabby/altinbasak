export interface Branch {
  slug: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  hours: {
    weekdays: string;
    weekend?: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  description?: string;
  featuredProducts?: string[]; // Product slugs
}

export const branches: Branch[] = [
  {
    slug: 'tekirdag-merkez',
    name: 'Tekirdağ Merkez',
    city: 'Tekirdağ',
    address: 'Rüstem Paşa Mahallesi, Hükümet Caddesi No: 45, 59100 Tekirdağ',
    phone: '+90 282 123 45 67',
    email: 'tekirdag@patisserie.com',
    hours: {
      weekdays: '08:00 - 20:00',
      weekend: '09:00 - 21:00',
    },
    coordinates: {
      lat: 40.9833,
      lng: 27.5167,
    },
    description: 'Ana şubemiz, Tekirdağ\'ın kalbinde geleneksel lezzetleri modern bir yaklaşımla sunuyor.',
    featuredProducts: ['cikolatali-mousse-kek', 'ekmek'],
  },
  {
    slug: 'istanbul-besiktas',
    name: 'İstanbul Beşiktaş',
    city: 'İstanbul',
    address: 'Vişnezade Mahallesi, Acıbadem Caddesi No: 12, 34357 Beşiktaş/İstanbul',
    phone: '+90 212 234 56 78',
    email: 'besiktas@patisserie.com',
    hours: {
      weekdays: '08:00 - 21:00',
      weekend: '09:00 - 22:00',
    },
    coordinates: {
      lat: 41.0422,
      lng: 29.0081,
    },
    description: 'Boğaz manzaralı şubemiz, İstanbul\'un en seçkin mahallelerinden birinde hizmet veriyor.',
    featuredProducts: ['frambuazli-cheesecake', 'croissant'],
  },
  {
    slug: 'ankara-kizilay',
    name: 'Ankara Kızılay',
    city: 'Ankara',
    address: 'Kızılay Mahallesi, Atatürk Bulvarı No: 78, 06420 Çankaya/Ankara',
    phone: '+90 312 345 67 89',
    email: 'ankara@patisserie.com',
    hours: {
      weekdays: '08:00 - 20:00',
      weekend: '09:00 - 21:00',
    },
    coordinates: {
      lat: 39.9208,
      lng: 32.8541,
    },
    description: 'Başkent\'in merkezinde, modern ve şık bir atmosferde lezzetlerimizi keşfedin.',
    featuredProducts: ['tiramisu', 'opera-kek'],
  },
];

