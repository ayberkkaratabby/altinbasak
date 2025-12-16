'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../../../components/AdminPageHeader';
import { EnhancedContentForm } from '../../../../components/EnhancedContentForm';
import { BreadcrumbNav } from '../../../../components/BreadcrumbNav';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/blog/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInitialData(data);
        } else {
          console.error('Failed to fetch blog post');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Blog yazısı güncellenemedi');
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/admin/blog');
  };

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
          { label: 'Blog', href: '/admin/blog' },
          { label: initialData?.translations?.[0]?.title || 'Yazı Düzenle' },
        ]}
      />
      
      <AdminPageHeader
        title="Blog Yazısı Düzenle"
        description="Blog yazısı bilgilerini düzenleyin"
      />

      <EnhancedContentForm
        entityType="blog"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
