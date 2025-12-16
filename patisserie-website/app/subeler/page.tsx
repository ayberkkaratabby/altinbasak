import Link from 'next/link';
import { branches } from '@/content/branches';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Şubeler',
  description: 'Tekirdağ, İstanbul ve Ankara\'da hizmet veren şubelerimizi keşfedin.',
  path: '/subeler',
});

export default function BranchesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-black/5 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-balance">
            Şubelerimiz
          </h1>
          <p className="text-lg md:text-xl text-black/60 max-w-2xl leading-relaxed">
            Tekirdağ, İstanbul ve Ankara&apos;da hizmet veren şubelerimizi keşfedin.
          </p>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {branches.map((branch) => (
              <Link
                key={branch.slug}
                href={`/subeler/${branch.slug}`}
                className="group block"
              >
                <article className="h-full flex flex-col">
                  {/* Image Placeholder - Fixed aspect ratio */}
                  <div className="relative aspect-[4/3] bg-black/5 mb-6 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-black/20 text-sm">Şube Görseli</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h2 className="font-serif text-2xl md:text-3xl font-normal mb-2 group-hover:text-black/80 transition-colors">
                      {branch.name}
                    </h2>
                    <p className="text-sm text-black/40 mb-4 uppercase tracking-wider">
                      {branch.city}
                    </p>
                    {branch.description && (
                      <p className="text-sm md:text-base text-black/60 mb-4 leading-relaxed line-clamp-2">
                        {branch.description}
                      </p>
                    )}
                    <div className="mt-auto pt-4 border-t border-black/5">
                      <p className="text-xs text-black/40">
                        {branch.hours.weekdays}
                      </p>
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
