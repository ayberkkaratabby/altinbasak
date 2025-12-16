'use client';

import { useState } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { PremiumTable } from '../../components/PremiumTable';
import { Icon } from '@/components/admin/Icon';

interface HeroSection {
  id: string;
  title: string;
  page: string;
  status: 'active' | 'inactive';
  updatedAt: string;
}

export default function HeroSectionsPage() {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);

  const columns = [
    {
      key: 'title',
      label: 'Başlık',
      sortable: true,
      filterable: true,
      render: (hero: HeroSection) => (
        <div className="flex items-center gap-3">
          <Icon name="hero" size={20} className="text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">{hero.title}</div>
            <div className="text-sm text-gray-500">{hero.page}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Durum',
      sortable: true,
      filterable: true,
      render: (hero: HeroSection) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          hero.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {hero.status === 'active' ? 'Aktif' : 'Pasif'}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Son Güncelleme',
      sortable: true,
      render: (hero: HeroSection) => new Date(hero.updatedAt).toLocaleDateString('tr-TR'),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Hero Bölümleri"
        description="Ana sayfa ve sayfa hero bölümlerini yönetin"
        action={{
          label: 'Yeni Hero Bölümü',
          href: '/admin/hero-sections/new',
        }}
      />

      <PremiumTable
        columns={columns}
        data={heroSections}
        onEdit={(hero) => `/admin/hero-sections/${hero.id}/edit`}
        emptyMessage="Henüz hero bölümü eklenmemiş."
        searchable
      />
    </div>
  );
}

