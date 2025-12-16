'use client';

import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '../../../components/AdminPageHeader';
import { EnhancedContentForm } from '../../../components/EnhancedContentForm';
import { BreadcrumbNav } from '../../../components/BreadcrumbNav';

export default function NewBlogPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.details || error.error || 'Blog yazısı oluşturulamadı');
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

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: 'Blog', href: '/admin/blog' },
          { label: 'Yeni Yazı' },
        ]}
      />
      
      <AdminPageHeader
        title="Yeni Blog Yazısı"
        description="Yeni bir blog yazısı oluşturun"
      />

      <EnhancedContentForm
        entityType="blog"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
