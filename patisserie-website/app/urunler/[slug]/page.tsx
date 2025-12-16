import { notFound } from 'next/navigation';
import Link from 'next/link';
import { products } from '@/content/products';
import { createMetadata } from '@/lib/metadata';
import { createBreadcrumbSchema } from '@/lib/jsonld';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {};
  }

  return createMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/urunler/${slug}`,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Ürünler', url: '/urunler' },
    { name: product.name, url: `/urunler/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen">
        {/* Hero Image - Fixed aspect ratio for zero CLS */}
        <section className="relative aspect-[16/9] md:aspect-[21/9] bg-black/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-black/20 text-sm md:text-base">Hero Görsel</span>
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
                  <Link href="/urunler" className="hover:text-black/60 transition-colors">
                    Ürünler
                  </Link>
                </li>
                <li>/</li>
                <li className="text-black/60">{product.name}</li>
              </ol>
            </nav>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-balance">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-lg md:text-xl text-black/60 mb-12 leading-relaxed max-w-2xl">
              {product.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Left Column */}
              <div className="space-y-12">
                {/* Ingredients */}
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                    Malzemeler
                  </h2>
                  <ul className="space-y-3">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 text-black/40">•</span>
                        <span className="text-black/80 leading-relaxed">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Craft Notes */}
                {product.craftNotes && (
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                      Yapım Notları
                    </h2>
                    <p className="text-black/80 leading-relaxed whitespace-pre-line">
                      {product.craftNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-12">
                {/* Pairing Suggestions */}
                {product.pairingSuggestions && product.pairingSuggestions.length > 0 && (
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                      Eşleştirme Önerileri
                    </h2>
                    <ul className="space-y-3">
                      {product.pairingSuggestions.map((pairing, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-3 text-black/40">•</span>
                          <span className="text-black/80 leading-relaxed">{pairing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Allergens */}
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                    Alerjen Bilgisi
                  </h2>
                  <ul className="space-y-3">
                    {product.allergens.map((allergen, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 text-black/40">•</span>
                        <span className="text-black/80 leading-relaxed">{allergen}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 pt-12 border-t border-black/5">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-black/60 text-sm md:text-base">
                  Bu ürünü şubelerimizde keşfedebilirsiniz.
                </p>
                <Link
                  href="/subeler"
                  className="inline-block px-8 py-4 bg-black text-white hover:bg-black/90 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Şubede Keşfet
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
