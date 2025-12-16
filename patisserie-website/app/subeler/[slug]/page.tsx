import { notFound } from 'next/navigation';
import Link from 'next/link';
import { branches } from '@/content/branches';
import { products } from '@/content/products';
import { createMetadata } from '@/lib/metadata';
import { createBreadcrumbSchema, createLocalBusinessSchema } from '@/lib/jsonld';

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return branches.map((branch) => ({
    slug: branch.slug,
  }));
}

export async function generateMetadata({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = branches.find((b) => b.slug === slug);

  if (!branch) {
    return {};
  }

  return createMetadata({
    title: branch.name,
    description: branch.description || `${branch.city} şubemizde hizmet veriyoruz.`,
    path: `/subeler/${slug}`,
  });
}

export default async function BranchPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = branches.find((b) => b.slug === slug);

  if (!branch) {
    notFound();
  }

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Şubeler', url: '/subeler' },
    { name: branch.name, url: `/subeler/${slug}` },
  ]);

  const localBusinessSchema = createLocalBusinessSchema(branch);

  // Google Maps link
  const mapsUrl = branch.coordinates
    ? `https://www.google.com/maps?q=${branch.coordinates.lat},${branch.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`;

  // WhatsApp link
  const whatsappNumber = branch.phone.replace(/\s/g, '').replace('+', '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  // Featured products - get actual product data
  const featuredProducts = branch.featuredProducts
    ? branch.featuredProducts
        .map((slug) => products.find((p) => p.slug === slug))
        .filter((p): p is NonNullable<typeof p> => p !== undefined)
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <div className="min-h-screen">
        {/* Hero Image - Fixed aspect ratio */}
        <section className="relative aspect-[16/9] md:aspect-[21/9] bg-black/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-black/20 text-sm md:text-base">Şube Görseli</span>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm text-black/40" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:text-black/60 transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/subeler" className="hover:text-black/60 transition-colors">
                    Şubeler
                  </Link>
                </li>
                <li>/</li>
                <li className="text-black/60">{branch.name}</li>
              </ol>
            </nav>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-balance">
              {branch.name}
            </h1>

            {/* Description */}
            {branch.description && (
              <p className="text-lg md:text-xl text-black/60 mb-12 leading-relaxed max-w-2xl">
                {branch.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Left Column - Key Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                    İletişim Bilgileri
                  </h2>
                  <div className="space-y-4 text-black/80">
                    <div>
                      <p className="text-sm text-black/40 mb-1">Adres</p>
                      <p className="leading-relaxed">{branch.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-black/40 mb-1">Telefon</p>
                      <a
                        href={`tel:${branch.phone.replace(/\s/g, '')}`}
                        className="hover:text-black/60 transition-colors"
                      >
                        {branch.phone}
                      </a>
                    </div>
                    {branch.email && (
                      <div>
                        <p className="text-sm text-black/40 mb-1">E-posta</p>
                        <a
                          href={`mailto:${branch.email}`}
                          className="hover:text-black/60 transition-colors"
                        >
                          {branch.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                    Çalışma Saatleri
                  </h2>
                  <div className="space-y-2 text-black/80">
                    <div className="flex justify-between">
                      <span>Pazartesi - Cuma</span>
                      <span>{branch.hours.weekdays}</span>
                    </div>
                    {branch.hours.weekend && (
                      <div className="flex justify-between">
                        <span>Cumartesi - Pazar</span>
                        <span>{branch.hours.weekend}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors text-sm font-medium text-center"
                  >
                    Yol Tarifi
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-black text-white hover:bg-black/90 transition-colors text-sm font-medium text-center"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Right Column - Featured & Gallery */}
              <div className="space-y-12">
                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                      Bu Şubede Öne Çıkanlar
                    </h2>
                    <ul className="space-y-3">
                      {featuredProducts.map((product) => (
                        <li key={product.slug} className="flex items-start">
                          <span className="mr-3 text-black/40">•</span>
                          <Link
                            href={`/urunler/${product.slug}`}
                            className="text-black/80 hover:text-black transition-colors leading-relaxed"
                          >
                            {product.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gallery Placeholder */}
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                    Galeri
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-black/5 flex items-center justify-center"
                      >
                        <span className="text-black/20 text-xs">Görsel {i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16 pt-12 border-t border-black/5">
              <h2 className="font-serif text-2xl md:text-3xl font-normal mb-8">
                Sık Sorulan Sorular
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-lg mb-2">
                    Şubede rezervasyon yapabilir miyim?
                  </h3>
                  <p className="text-black/60 leading-relaxed">
                    Evet, telefon veya WhatsApp üzerinden rezervasyon yapabilirsiniz.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">
                    Özel sipariş alıyor musunuz?
                  </h3>
                  <p className="text-black/60 leading-relaxed">
                    Evet, özel tasarım pasta ve tatlı siparişleri için lütfen önceden iletişime geçin.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">
                    Hangi ödeme yöntemlerini kabul ediyorsunuz?
                  </h3>
                  <p className="text-black/60 leading-relaxed">
                    Nakit, kredi kartı ve banka kartı ile ödeme yapabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
