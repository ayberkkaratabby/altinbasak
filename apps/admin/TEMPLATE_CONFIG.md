# Konfigürasyon Rehberi

Bu rehber, `admin.config.ts` dosyasını kullanarak admin panelini nasıl özelleştireceğinizi açıklar.

## 📋 Dosya Yapısı

`admin.config.ts` dosyası admin panelinin tüm konfigürasyonunu içerir:

```typescript
export const adminConfig = {
  title: 'Admin Panel',
  menuItems: [],
  dashboardStats: [],
  entityTypes: [],
  customCommands: [],
};
```

## 🎯 Menü Öğeleri (menuItems)

Sidebar'da görünecek menü öğelerini tanımlar.

### Temel Kullanım

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

### Özellikler

- `id`: Benzersiz tanımlayıcı
- `label`: Menüde görünecek metin
- `icon`: Icon adı (icons.tsx dosyasındaki icon'lardan biri)
- `href`: Sayfa URL'i
- `description`: Opsiyonel açıklama

### Örnek

```typescript
menuItems: [
  {
    id: 'dashboard',
    label: 'Kontrol Paneli',
    icon: 'dashboard',
    href: '/admin',
  },
  {
    id: 'products',
    label: 'Ürünler',
    icon: 'products',
    href: '/admin/products',
    description: 'Ürün yönetimi',
  },
  {
    id: 'orders',
    label: 'Siparişler',
    icon: 'orders',
    href: '/admin/orders',
  },
  {
    id: 'media',
    label: 'Medya Kütüphanesi',
    icon: 'media',
    href: '/admin/media',
  },
]
```

## 📊 Dashboard İstatistikleri (dashboardStats)

Dashboard sayfasında görünecek istatistik kartlarını tanımlar.

### Temel Kullanım

```typescript
dashboardStats: [
  {
    id: 'products',
    title: 'Ürünler',
    icon: 'products',
    color: 'from-blue-500 to-blue-600',
    href: '/admin/products',
  },
]
```

### Özellikler

- `id`: Benzersiz tanımlayıcı
- `title`: Kart başlığı
- `icon`: Icon adı
- `color`: Tailwind gradient sınıfları
- `href`: Tıklanınca gidilecek URL
- `getCount`: Opsiyonel, dinamik sayı fonksiyonu

### Örnek

```typescript
dashboardStats: [
  {
    id: 'products',
    title: 'Ürünler',
    icon: 'products',
    color: 'from-blue-500 to-blue-600',
    href: '/admin/products',
    getCount: async () => {
      const { prisma } = await import('@/lib/db');
      return await prisma.product.count();
    },
  },
  {
    id: 'orders',
    title: 'Siparişler',
    icon: 'orders',
    color: 'from-green-500 to-green-600',
    href: '/admin/orders',
    getCount: async () => {
      const { prisma } = await import('@/lib/db');
      return await prisma.order.count();
    },
  },
]
```

## 📝 Entity Tipleri (entityTypes)

Content management için entity tiplerini tanımlar.

### Temel Kullanım

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

### Özellikler

- `id`: Entity tipi ID'si
- `label`: Tekil etiket
- `labelPlural`: Çoğul etiket
- `icon`: Icon adı
- `apiRoute`: API endpoint'i
- `adminRoute`: Admin sayfası route'u

### Örnek

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
  {
    id: 'category',
    label: 'Kategori',
    labelPlural: 'Kategoriler',
    icon: 'categories',
    apiRoute: '/api/admin/categories',
    adminRoute: '/admin/categories',
  },
]
```

## ⌨️ Özel Komutlar (customCommands)

Command Palette'e özel komutlar ekler.

### Temel Kullanım

```typescript
customCommands: [
  {
    id: 'export-data',
    label: 'Veri Dışa Aktar',
    description: 'Tüm verileri CSV olarak dışa aktar',
    icon: 'download',
    category: 'İşlemler',
    keywords: ['export', 'dışa aktar', 'csv'],
    action: () => {
      // Export logic
    },
  },
]
```

### Özellikler

- `id`: Benzersiz tanımlayıcı
- `label`: Komut etiketi
- `description`: Opsiyonel açıklama
- `icon`: Icon adı
- `category`: Kategori (Command Palette'te gruplama için)
- `keywords`: Arama anahtar kelimeleri
- `action`: Komut çalıştırıldığında yapılacak işlem

## 🎨 Icon Ekleme

Yeni icon'lar eklemek için `components/admin/icons.tsx` dosyasını düzenleyin:

```typescript
import { Package } from 'lucide-react';

export const AdminIcons = {
  // ... mevcut icon'lar
  products: Package,
};
```

## 📚 Tam Örnek

```typescript
export const adminConfig = {
  title: 'E-Ticaret Admin Panel',
  
  menuItems: [
    {
      id: 'dashboard',
      label: 'Kontrol Paneli',
      icon: 'dashboard',
      href: '/admin',
    },
    {
      id: 'products',
      label: 'Ürünler',
      icon: 'products',
      href: '/admin/products',
      description: 'Ürün yönetimi',
    },
    {
      id: 'orders',
      label: 'Siparişler',
      icon: 'orders',
      href: '/admin/orders',
    },
    {
      id: 'media',
      label: 'Medya',
      icon: 'media',
      href: '/admin/media',
    },
  ],
  
  dashboardStats: [
    {
      id: 'products',
      title: 'Ürünler',
      icon: 'products',
      color: 'from-blue-500 to-blue-600',
      href: '/admin/products',
      getCount: async () => {
        const { prisma } = await import('@/lib/db');
        return await prisma.product.count();
      },
    },
    {
      id: 'orders',
      title: 'Siparişler',
      icon: 'orders',
      color: 'from-green-500 to-green-600',
      href: '/admin/orders',
      getCount: async () => {
        const { prisma } = await import('@/lib/db');
        return await prisma.order.count();
      },
    },
  ],
  
  entityTypes: [
    {
      id: 'product',
      label: 'Ürün',
      labelPlural: 'Ürünler',
      icon: 'products',
      apiRoute: '/api/admin/products',
      adminRoute: '/admin/products',
    },
  ],
  
  customCommands: [
    {
      id: 'export-products',
      label: 'Ürünleri Dışa Aktar',
      description: 'Tüm ürünleri CSV olarak dışa aktar',
      icon: 'download',
      category: 'İşlemler',
      keywords: ['export', 'dışa aktar', 'csv', 'products'],
      action: () => {
        // Export logic
      },
    },
  ],
};
```

## 🔄 Değişiklikleri Uygulama

Konfigürasyon değişikliklerinden sonra:

1. Development server'ı yeniden başlatın
2. Tarayıcı cache'ini temizleyin
3. Değişikliklerin uygulandığını kontrol edin

## 💡 İpuçları

- Icon adlarını `components/admin/icons.tsx` dosyasından kontrol edin
- Color gradient'leri Tailwind CSS formatında kullanın
- `getCount` fonksiyonları async olabilir
- Command Palette komutları otomatik olarak menü öğelerinden oluşturulur

