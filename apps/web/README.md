# Patisserie Website

Lüks patisserie web sitesi - Tekirdağ merkezli çok şubeli pastane.

## Teknoloji Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Self-hosted fonts (Playfair Display + Inter)

## Geliştirme

```bash
npm install
npm run dev
```

Site `http://localhost:3000` adresinde çalışacak.

## Proje Yapısı

```
patisserie-website/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (SEO + fonts)
│   ├── page.tsx            # Home page
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── robots.ts           # Robots.txt
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── Header.tsx          # Site header/navigation
│   └── Footer.tsx           # Site footer
├── content/                 # Content layer (TypeScript)
│   ├── branches.ts         # Branch data (3 branches)
│   └── products.ts         # Product data (12 products)
└── lib/                     # Utilities
    ├── metadata.ts         # Metadata helpers
    └── jsonld.ts           # JSON-LD schema helpers
```

## İçerik

- **3 Şube**: Tekirdağ, İstanbul Beşiktaş, Ankara Kızılay
- **12 Ürün**: Kategorize edilmiş ürünler (cake, pastry, dessert, bread, special)

## SEO Özellikleri

- ✅ Metadata (title, description, OG, Twitter)
- ✅ Sitemap.xml (dynamic)
- ✅ Robots.txt
- ✅ JSON-LD Organization schema
- ✅ Semantic HTML
- ✅ Proper heading hierarchy

## Sonraki Adımlar

1. Logo entegrasyonu
2. Home page görselleri
3. Product detail pages
4. Branch detail pages
5. Contact page
