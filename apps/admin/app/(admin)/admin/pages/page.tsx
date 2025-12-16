'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { PremiumTable } from '../../components/PremiumTable';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/admin/Icon';
import { BreadcrumbNav } from '../../components/BreadcrumbNav';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { useToastContext } from '../../components/ToastProvider';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  author: string;
}

export default function PagesPage() {
  const { toast } = useToastContext();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch('/api/admin/pages', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          // Transform API data to Page format
          const transformedPages = data.map((page: any) => ({
            id: page.id,
            title: page.translations?.find((t: any) => t.locale === 'tr')?.title || page.slug || 'Başlıksız',
            slug: page.slug,
            status: page.status || 'draft',
            createdAt: page.createdAt || new Date().toISOString(),
            updatedAt: page.updatedAt || new Date().toISOString(),
            author: 'Admin',
          }));
          setPages(transformedPages);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to fetch pages:', errorData);
          toast.error('Sayfalar yüklenemedi', { 
            description: errorData.details || errorData.error || 'Bilinmeyen hata' 
          });
        }
      } catch (error: any) {
        console.error('Error fetching pages:', error);
        toast.error('Sayfalar yüklenirken bir hata oluştu', { 
          description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [toast]);

  const handleDelete = async (page: Page) => {
    if (!confirm(`"${page.title}" sayfasını silmek istediğinize emin misiniz?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        setPages(pages.filter(p => p.id !== page.id));
        toast.success('Sayfa başarıyla silindi');
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.details || error.error || 'Sayfa silinemedi');
      }
    } catch (error: any) {
      console.error('Error deleting page:', error);
      toast.error('Sayfa silinirken bir hata oluştu', { 
        description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
      });
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Başlık',
      sortable: true,
      filterable: true,
      render: (page: Page) => (
        <div className="flex items-center gap-3">
          <Thumbnail
            src={(page as any).thumbnail}
            fallbackIcon="pages"
            size="sm"
          />
          <div>
            <div className="font-medium text-gray-900">{page.title}</div>
            <div className="text-sm text-gray-500">/{page.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Durum',
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'published', label: 'Yayında' },
        { value: 'draft', label: 'Taslak' },
        { value: 'archived', label: 'Arşiv' },
      ],
      render: (page: Page) => {
        const statusColors = {
          published: 'bg-green-100 text-green-800',
          draft: 'bg-yellow-100 text-yellow-800',
          archived: 'bg-gray-100 text-gray-800',
        };
        const statusLabels = {
          published: 'Yayında',
          draft: 'Taslak',
          archived: 'Arşiv',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[page.status]}`}>
            {statusLabels[page.status]}
          </span>
        );
      },
    },
    {
      key: 'author',
      label: 'Yazar',
      sortable: true,
    },
    {
      key: 'updatedAt',
      label: 'Son Güncelleme',
      sortable: true,
      render: (page: Page) => new Date(page.updatedAt).toLocaleDateString('tr-TR'),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: 'Sayfalar' },
        ]}
      />
      
      <AdminPageHeader
        title="Sayfalar"
        description="Site sayfalarını yönetin"
        action={{
          label: 'Yeni Sayfa',
          href: '/admin/pages/new',
        }}
      />

      <PremiumTable
        columns={columns}
        data={pages}
        onEdit={(page) => `/admin/pages/${page.id}/edit`}
        onDelete={handleDelete}
        emptyMessage="Henüz sayfa eklenmemiş."
        searchable
        selectable
        exportable
      />
    </div>
  );
}
