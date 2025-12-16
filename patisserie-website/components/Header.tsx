import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            {/* Logo placeholder - will be replaced with actual logo */}
            <div className="w-32 h-8 bg-black/10 flex items-center justify-center text-xs text-black/40">
              LOGO
            </div>
          </Link>
          
          <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <li>
              <Link href="/" className="hover:text-black/60 transition-colors">
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link href="/hikayemiz" className="hover:text-black/60 transition-colors">
                Hikayemiz
              </Link>
            </li>
            <li>
              <Link href="/urunler" className="hover:text-black/60 transition-colors">
                Ürünler
              </Link>
            </li>
            <li>
              <Link href="/subeler" className="hover:text-black/60 transition-colors">
                Şubeler
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-black/60 transition-colors">
                İletişim
              </Link>
            </li>
          </ul>

          {/* Mobile menu button - will be implemented in next slice */}
          <button className="md:hidden" aria-label="Menu">
            <span className="block w-6 h-0.5 bg-black mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-black mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </button>
        </div>
      </nav>
    </header>
  );
}

