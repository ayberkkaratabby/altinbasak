import Link from 'next/link';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Ana Sayfa',
  description: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi. Geleneksel lezzetler, modern yaklaşım.',
  path: '/',
});

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal mb-6 text-balance">
            Lezzetin
            <br />
            Zarif Hikayesi
          </h1>
          <p className="text-lg md:text-xl text-black/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            Tekirdağ'dan dünyaya açılan lüks patisserie deneyimi.
            <br />
            Geleneksel lezzetler, modern yaklaşım.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/urunler"
              className="inline-block px-8 py-4 bg-black text-white hover:bg-black/90 transition-colors text-sm font-medium"
            >
              Ürünleri Keşfet
            </Link>
            <Link
              href="/subeler"
              className="inline-block px-8 py-4 border border-black text-black hover:bg-black/5 transition-colors text-sm font-medium"
            >
              Şubelerimiz
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section - Placeholder */}
      <section className="py-24 border-t border-black/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl mb-12 text-center">
            Öne Çıkanlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Placeholder cards - will be populated in next slice */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] bg-black/5 flex items-center justify-center">
                <span className="text-black/20 text-sm">Görsel {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
