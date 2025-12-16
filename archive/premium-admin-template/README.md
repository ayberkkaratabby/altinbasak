# Premium Admin Panel Template

Modern, kullanıcı dostu ve geliştirici dostu admin panel template'i. Tasarımcılar ve içerik yöneticileri için kod bilgisi gerektirmeden kullanılabilir.

## ✨ Özellikler

### 🎯 Core Features
- **Auto-save**: Otomatik kaydetme (debounced)
- **Undo/Redo**: Geri alma/İleri alma desteği
- **Keyboard Shortcuts**: Klavye kısayolları (Cmd/Ctrl+K, Cmd/Ctrl+S, vb.)
- **Command Palette**: Hızlı komut paleti (Cmd/Ctrl+K)

### 📚 Media Library
- **Image Editor**: Görsel düzenleme (brightness, contrast, saturation, rotation)
- **Smart Organization**: Tagging, folders, favorites
- **Bulk Operations**: Toplu işlemler (optimize, alt text, delete)
- **Media Detail Modal**: Detaylı medya görüntüleme ve düzenleme

### 🎨 Visual Page Builder
- **Drag & Drop Editor**: Sürükle-bırak sayfa editörü
- **Real-time Preview**: Gerçek zamanlı önizleme
- **Responsive Preview**: Responsive önizleme
- **Section Library**: Hazır bölüm şablonları

### ✍️ Rich Content Editor
- **TipTap Integration**: WYSIWYG editör
- **Markdown Support**: Markdown desteği
- **Media Embed**: Medya gömme
- **Code Blocks**: Kod blokları
- **AI Assistant**: AI asistanı (SEO, içerik, alt text önerileri)
- **Content Blocks**: Yeniden kullanılabilir içerik blokları

### 📊 Advanced Features
- **Revision History**: Revizyon geçmişi (versioning, comparison, restore)
- **Content Scheduling**: İçerik zamanlama (zamanlı yayınlama, takvim görünümü)
- **Analytics Dashboard**: Analitik dashboard (sayfa görüntülemeleri, lead takibi, performans metrikleri)
- **Collaboration**: İşbirliği (yorumlar, onay akışı, kullanıcı rolleri)

### 🎭 Polish & Micro-interactions
- **Animations**: Framer Motion ile animasyonlar
- **Empty States**: Boş durumlar
- **Loading States**: Yükleme durumları
- **Tooltips**: Tooltip'ler
- **Accessibility**: Erişilebilirlik (ARIA, klavye navigasyonu, ekran okuyucu desteği)

## 🚀 Hızlı Başlangıç

### 1. Template'i Projenize Kopyalayın

```bash
# Template klasörünü projenize kopyalayın
cp -r premium-admin-template/* your-project/
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Variables Ayarlayın

`.env.local` dosyası oluşturun:

```env
# Database
DATABASE_URL="file:./dev.db"

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

### 4. Database'i Hazırlayın

```bash
# Prisma generate
npm run db:generate

# Database push
npm run db:push
```

### 5. Admin Panel'i Özelleştirin

`admin.config.ts` dosyasını düzenleyerek:
- Menü öğelerini ekleyin
- Dashboard istatistiklerini yapılandırın
- Entity tiplerini tanımlayın

Detaylı kurulum için [SETUP.md](./SETUP.md) dosyasına bakın.

## 📁 Klasör Yapısı

```
premium-admin-template/
├── app/
│   └── (admin)/
│       ├── layout.tsx          # Admin layout
│       ├── admin/
│       │   ├── login/          # Login sayfası
│       │   ├── media/          # Medya kütüphanesi
│       │   └── settings/       # Ayarlar
│       └── components/         # Admin bileşenleri
├── components/
│   ├── admin/                  # Admin bileşenleri
│   └── ui/                     # UI bileşenleri
├── hooks/                      # Custom hooks
├── lib/                        # Utility fonksiyonları
├── prisma/                     # Database schema
├── admin.config.ts             # Admin panel konfigürasyonu
└── README.md                   # Bu dosya
```

## 🎨 Özelleştirme

### Menü Öğeleri Ekleme

`admin.config.ts` dosyasında:

```typescript
menuItems: [
  {
    id: 'products',
    label: 'Ürünler',
    icon: 'products',
    href: '/admin/products',
    description: 'Ürün yönetimi',
  },
]
```

### Yeni Entity Type Ekleme

```typescript
entityTypes: [
  {
    id: 'product',
    label: 'Ürün',
    labelPlural: 'Ürünler',
    icon: 'products',
    apiRoute: '/api/admin/products',
    adminRoute: '/admin/products',
  },
]
```

Detaylı özelleştirme için [TEMPLATE_CONFIG.md](./TEMPLATE_CONFIG.md) dosyasına bakın.

## 📚 Dokümantasyon

- [SETUP.md](./SETUP.md) - Detaylı kurulum rehberi
- [TEMPLATE_CONFIG.md](./TEMPLATE_CONFIG.md) - Konfigürasyon rehberi
- [CUSTOMIZATION.md](./CUSTOMIZATION.md) - Özelleştirme rehberi

## 🛠️ Teknolojiler

- **Next.js 14** - React framework
- **Prisma** - Database ORM
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **TipTap** - Rich text editor
- **@dnd-kit** - Drag & drop
- **Lucide React** - Icons

## 📝 Lisans

Bu template özel projelerinizde kullanmak için hazırlanmıştır.

## 🤝 Destek

Sorularınız için issue açabilir veya dokümantasyonu inceleyebilirsiniz.

