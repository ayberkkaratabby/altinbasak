import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="font-serif text-6xl md:text-8xl font-normal mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl mb-6 text-black/60">Sayfa Bulunamadı</h2>
        <p className="text-lg mb-8 text-black/40 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 transition-all duration-300 text-sm font-medium"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-background)',
          }}
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}

