import { createMetadata } from '@/lib/metadata';
import { branches } from '@/content/branches';

export const metadata = createMetadata({
  title: 'İletişim',
  description: 'Bize ulaşın. Sorularınız ve önerileriniz için buradayız.',
  path: '/iletisim',
});

export default function ContactPage() {
  const mainBranch = branches[0]; // Tekirdağ Merkez

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-black/5 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-balance">
            İletişim
          </h1>
          <p className="text-lg md:text-xl text-black/60 max-w-2xl leading-relaxed">
            Bize ulaşın. Sorularınız ve önerileriniz için buradayız.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                Genel İletişim
              </h2>
              <div className="space-y-6 text-black/80">
                <div>
                  <p className="text-sm text-black/40 mb-1">Adres</p>
                  <p className="leading-relaxed">{mainBranch.address}</p>
                </div>
                <div>
                  <p className="text-sm text-black/40 mb-1">Telefon</p>
                  <a
                    href={`tel:${mainBranch.phone.replace(/\s/g, '')}`}
                    className="hover:text-black/60 transition-colors"
                  >
                    {mainBranch.phone}
                  </a>
                </div>
                {mainBranch.email && (
                  <div>
                    <p className="text-sm text-black/40 mb-1">E-posta</p>
                    <a
                      href={`mailto:${mainBranch.email}`}
                      className="hover:text-black/60 transition-colors"
                    >
                      {mainBranch.email}
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
                  <span>{mainBranch.hours.weekdays}</span>
                </div>
                {mainBranch.hours.weekend && (
                  <div className="flex justify-between">
                    <span>Cumartesi - Pazar</span>
                    <span>{mainBranch.hours.weekend}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-black/5">
            <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
              Tüm Şubelerimiz
            </h2>
            <div className="space-y-6">
              {branches.map((branch) => (
                <div key={branch.slug} className="pb-6 border-b border-black/5 last:border-0">
                  <h3 className="font-medium text-lg mb-2">{branch.name}</h3>
                  <p className="text-sm text-black/60 mb-2">{branch.address}</p>
                  <a
                    href={`tel:${branch.phone.replace(/\s/g, '')}`}
                    className="text-sm text-black/80 hover:text-black/60 transition-colors"
                  >
                    {branch.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
