import Link from 'next/link';
import { products } from '@/content/products';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Ürünler',
  description: 'Lüks patisserie ürünlerimizi keşfedin. Her biri özenle hazırlanmış, geleneksel lezzetler modern yaklaşımla.',
  path: '/urunler',
});

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-black/5 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-balance">
            Ürünlerimiz
          </h1>
          <p className="text-lg md:text-xl text-black/60 max-w-2xl leading-relaxed">
            Her biri özenle hazırlanmış, geleneksel lezzetler modern yaklaşımla.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/urunler/${product.slug}`}
                className="group block"
              >
                <article className="h-full flex flex-col">
                  {/* Image Placeholder - Fixed aspect ratio for zero CLS */}
                  <div className="relative aspect-[4/5] bg-black/5 mb-6 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-black/20 text-sm">Görsel</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h2 className="font-serif text-2xl md:text-3xl font-normal mb-2 group-hover:text-black/80 transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-sm md:text-base text-black/60 mb-4 leading-relaxed line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="mt-auto pt-4 border-t border-black/5">
                      <span className="text-xs text-black/40 uppercase tracking-wider">
                        {product.category === 'cake' && 'Kek'}
                        {product.category === 'pastry' && 'Hamur İşi'}
                        {product.category === 'dessert' && 'Tatlı'}
                        {product.category === 'bread' && 'Ekmek'}
                        {product.category === 'special' && 'Özel'}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
