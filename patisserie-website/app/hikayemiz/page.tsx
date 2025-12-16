import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Hikayemiz',
  description: 'Tekirdağ\'dan başlayan lezzet yolculuğumuz. Geleneksel değerler, modern yaklaşım.',
  path: '/hikayemiz',
});

export default function StoryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-black/5 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-balance">
            Hikayemiz
          </h1>
          <p className="text-lg md:text-xl text-black/60 max-w-2xl leading-relaxed">
            Tekirdağ'dan başlayan lezzet yolculuğumuz.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-black/80 leading-relaxed text-lg">
              Her lezzet bir hikaye anlatır. Bizim hikayemiz, Tekirdağ'ın kalbinde başladı.
            </p>
            <p className="text-black/80 leading-relaxed">
              Geleneksel değerlerle modern yaklaşımı bir araya getirerek, her ürünümüzde
              mükemmelliği hedefliyoruz. Her katman, her dokunuş, özenle ve sevgiyle hazırlanır.
            </p>
            <p className="text-black/80 leading-relaxed">
              Şubelerimizde, misafirlerimize unutulmaz bir deneyim sunmak için çalışıyoruz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
