import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test pages
  const pages = [
    // Homepage Hero Section
    {
      slug: 'home-hero',
      status: 'published',
      featured: true,
      publishedAt: new Date(),
      focusKeyword: 'ana sayfa hero',
      translations: {
        create: [
          {
            locale: 'tr',
            title: 'Lezzetin Zarif Hikayesi',
            description: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi. Geleneksel lezzetler, modern yaklaşım.',
            excerpt: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.',
            content: JSON.stringify({
              title: 'Lezzetin Zarif Hikayesi',
              subtitle: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.',
              description: 'Geleneksel lezzetler, modern yaklaşım.',
              ctaPrimary: { text: 'Ürünleri Keşfet', link: '/urunler' },
              ctaSecondary: { text: 'Şubelerimiz', link: '/subeler' },
            }),
            seoTitle: 'Ana Sayfa | Altınbaşak Pastanesi',
            seoDesc: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.',
          },
        ],
      },
    },
    // Homepage Featured Products Section
    {
      slug: 'home-featured-products',
      status: 'published',
      featured: true,
      publishedAt: new Date(),
      focusKeyword: 'öne çıkan ürünler',
      translations: {
        create: [
          {
            locale: 'tr',
            title: 'Öne Çıkan Ürünler',
            description: 'Her biri özenle hazırlanmış, geleneksel lezzetler modern yaklaşımla',
            excerpt: 'Her biri özenle hazırlanmış, geleneksel lezzetler modern yaklaşımla',
            content: JSON.stringify({
              heading: 'Öne Çıkanlar',
              description: 'Her biri özenle hazırlanmış, geleneksel lezzetler modern yaklaşımla',
            }),
            seoTitle: 'Öne Çıkan Ürünler | Altınbaşak Pastanesi',
            seoDesc: 'Her biri özenle hazırlanmış, geleneksel lezzetler modern yaklaşımla',
          },
        ],
      },
    },
    // Homepage Story Section
    {
      slug: 'home-story',
      status: 'published',
      featured: true,
      publishedAt: new Date(),
      focusKeyword: 'hikayemiz',
      translations: {
        create: [
          {
            locale: 'tr',
            title: 'Hikayemiz',
            description: 'Tekirdağ\'da başlayan yolculuğumuz, geleneksel lezzetleri modern bir yaklaşımla buluşturarak dünyaya açıldı.',
            excerpt: 'Tekirdağ\'da başlayan yolculuğumuz, geleneksel lezzetleri modern bir yaklaşımla buluşturarak dünyaya açıldı.',
            content: JSON.stringify({
              heading: 'Hikayemiz',
              paragraph1: 'Tekirdağ\'da başlayan yolculuğumuz, geleneksel lezzetleri modern bir yaklaşımla buluşturarak dünyaya açıldı. Her ürünümüz, ustalık ve tutkuyla hazırlanır.',
              paragraph2: 'Yılların birikimi ve sürekli yenilik arayışımız, bizi bugünkü konumumuza getirdi. Müşterilerimize en iyi deneyimi sunmak için çalışmaya devam ediyoruz.',
              ctaText: 'Hikayemizi Keşfet',
              ctaLink: '/hikayemiz',
            }),
            seoTitle: 'Hikayemiz | Altınbaşak Pastanesi',
            seoDesc: 'Tekirdağ\'da başlayan yolculuğumuz, geleneksel lezzetleri modern bir yaklaşımla buluşturarak dünyaya açıldı.',
          },
        ],
      },
    },
    {
      slug: 'hakkimizda',
      status: 'published',
      featured: true,
      publishedAt: new Date(),
      focusKeyword: 'hakkımızda',
      translations: {
        create: [
          {
            locale: 'tr',
            title: 'Hakkımızda',
            description: 'Altınbaşak Pastanesi hakkında bilgiler',
            excerpt: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.',
            content: '<h2>Hikayemiz</h2><p>Altınbaşak Pastanesi, 2010 yılında Tekirdağ\'ın kalbinde küçük bir pastane olarak başladı. Geleneksel lezzetleri modern tekniklerle birleştirme hayalimiz vardı.</p><p>Yıllar içinde büyüdük, yenilikler yaptık ve müşterilerimize en iyi deneyimi sunmak için çalıştık. Bugün Tekirdağ, İstanbul ve Ankara\'da şubelerimizle hizmet veriyoruz.</p>',
            seoTitle: 'Hakkımızda | Altınbaşak Pastanesi',
            seoDesc: 'Altınbaşak Pastanesi hakkında bilgiler. Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.',
          },
          {
            locale: 'en',
            title: 'About Us',
            description: 'Information about Altınbaşak Pastry',
            excerpt: 'Luxury patisserie experience from Tekirdağ to the world.',
            content: '<h2>Our Story</h2><p>Altınbaşak Pastry started in 2010 as a small pastry shop in the heart of Tekirdağ. We had a dream of combining traditional flavors with modern techniques.</p>',
            seoTitle: 'About Us | Altınbaşak Pastry',
            seoDesc: 'Information about Altınbaşak Pastry. Luxury patisserie experience from Tekirdağ to the world.',
          },
        ],
      },
    },
    {
      slug: 'hizmetlerimiz',
      status: 'published',
      featured: false,
      publishedAt: new Date(),
      focusKeyword: 'hizmetler',
      translations: {
        create: [
          {
            locale: 'tr',
            title: 'Hizmetlerimiz',
            description: 'Altınbaşak Pastanesi hizmetleri',
            excerpt: 'Özel günleriniz için özel lezzetler',
            content: '<h2>Hizmetlerimiz</h2><ul><li>Doğum günü pastaları</li><li>Düğün pastaları</li><li>Özel tasarım pastalar</li><li>Kurumsal hizmetler</li><li>Online sipariş</li></ul>',
            seoTitle: 'Hizmetlerimiz | Altınbaşak Pastanesi',
            seoDesc: 'Altınbaşak Pastanesi hizmetleri. Özel günleriniz için özel lezzetler.',
          },
        ],
      },
    },
    {
      slug: 'iletisim',
      status: 'published',
      featured: false,
      publishedAt: new Date(),
      focusKeyword: 'iletişim',
      translations: {
        create: [
          {
            locale: 'tr',
            title: 'İletişim',
            description: 'Altınbaşak Pastanesi iletişim bilgileri',
            excerpt: 'Bize ulaşın',
            content: '<h2>İletişim Bilgileri</h2><p><strong>Adres:</strong> Tekirdağ Merkez</p><p><strong>Telefon:</strong> +90 282 123 45 67</p><p><strong>E-posta:</strong> info@altinbasak.com</p>',
            seoTitle: 'İletişim | Altınbaşak Pastanesi',
            seoDesc: 'Altınbaşak Pastanesi iletişim bilgileri. Bize ulaşın.',
          },
        ],
      },
    },
  ];

  for (const pageData of pages) {
    const existingPage = await prisma.page.findUnique({
      where: { slug: pageData.slug },
    });

    if (!existingPage) {
      await prisma.page.create({
        data: pageData,
      });
      console.log(`✅ Created page: ${pageData.slug}`);
    } else {
      console.log(`⏭️  Page already exists: ${pageData.slug}`);
    }
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

