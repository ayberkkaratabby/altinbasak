import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-xl mb-4">Patisserie</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Tekirdağ'dan dünyaya açılan lüks patisserie deneyimi.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/hikayemiz" className="hover:text-white transition-colors">
                  Hikayemiz
                </Link>
              </li>
              <li>
                <Link href="/urunler" className="hover:text-white transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/subeler" className="hover:text-white transition-colors">
                  Şubeler
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">İletişim</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Tekirdağ Merkez</li>
              <li>Rüstem Paşa Mahallesi</li>
              <li>Hükümet Caddesi No: 45</li>
              <li className="pt-2">
                <a href="tel:+902821234567" className="hover:text-white transition-colors">
                  +90 282 123 45 67
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/40">
          <p>&copy; {currentYear} Patisserie. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}

