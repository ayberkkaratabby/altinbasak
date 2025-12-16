'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { PremiumTable } from '../../components/PremiumTable';
import { Icon } from '@/components/admin/Icon';
import { BreadcrumbNav } from '../../components/BreadcrumbNav';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { useToastContext } from '../../components/ToastProvider';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: 'published' | 'draft';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export default function BlogPage() {
  const { toast } = useToastContext();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/admin/blog', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const transformedPosts = data.map((post: any) => ({
            id: post.id,
            title: post.translations?.find((t: any) => t.locale === 'tr')?.title || post.slug || 'Başlıksız',
            slug: post.slug,
            excerpt: post.translations?.find((t: any) => t.locale === 'tr')?.excerpt || '',
            category: post.category || '',
            status: post.status || 'draft',
            publishedAt: post.publishedAt,
            createdAt: post.createdAt || new Date().toISOString(),
            updatedAt: post.updatedAt || new Date().toISOString(),
            author: 'Admin',
          }));
          setPosts(transformedPosts);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to fetch blog posts:', errorData);
          toast.error('Blog yazıları yüklenemedi', { 
            description: errorData.details || errorData.error || 'Bilinmeyen hata' 
          });
        }
      } catch (error: any) {
        console.error('Error fetching blog posts:', error);
        toast.error('Blog yazıları yüklenirken bir hata oluştu', { 
          description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  const columns = [
    {
      key: 'title',
      label: 'Başlık',
      sortable: true,
      filterable: true,
      render: (post: BlogPost) => (
        <div className="flex items-start gap-3">
          <Thumbnail
            src={(post as any).thumbnail}
            fallbackIcon="blog"
            size="sm"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900">{post.title}</div>
            {post.excerpt && (
              <div className="text-sm text-gray-500 mt-1 line-clamp-1">{post.excerpt}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      sortable: true,
      filterable: true,
    },
    {
      key: 'author',
      label: 'Yazar',
      sortable: true,
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
      ],
      render: (post: BlogPost) => {
        const statusColors = {
          published: 'bg-green-100 text-green-800',
          draft: 'bg-yellow-100 text-yellow-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
            {post.status === 'published' ? 'Yayında' : 'Taslak'}
          </span>
        );
      },
    },
    {
      key: 'publishedAt',
      label: 'Yayın Tarihi',
      sortable: true,
      render: (post: BlogPost) => post.publishedAt 
        ? new Date(post.publishedAt).toLocaleDateString('tr-TR')
        : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: 'Blog' },
        ]}
      />
      
      <AdminPageHeader
        title="Blog Yazıları"
        description="Blog yazılarınızı yönetin"
        action={{
          label: 'Yeni Yazı',
          href: '/admin/blog/new',
        }}
      />

      <PremiumTable
        columns={columns}
        data={posts}
        onEdit={(post) => `/admin/blog/${post.id}/edit`}
        onDelete={async (post) => {
          if (!confirm(`"${post.title}" blog yazısını silmek istediğinize emin misiniz?`)) {
            return;
          }
          
          try {
            const response = await fetch(`/api/admin/blog/${post.id}`, {
              method: 'DELETE',
              credentials: 'include',
            });
            
            if (response.ok) {
              setPosts(posts.filter(p => p.id !== post.id));
              toast.success('Blog yazısı başarıyla silindi');
            } else {
              const error = await response.json().catch(() => ({ error: 'Unknown error' }));
              throw new Error(error.details || error.error || 'Blog yazısı silinemedi');
            }
          } catch (error: any) {
            console.error('Error deleting blog post:', error);
            toast.error('Blog yazısı silinirken bir hata oluştu', { 
              description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
            });
          }
        }}
        emptyMessage="Henüz blog yazısı eklenmemiş."
        searchable
        selectable
        exportable
      />
    </div>
  );
}

