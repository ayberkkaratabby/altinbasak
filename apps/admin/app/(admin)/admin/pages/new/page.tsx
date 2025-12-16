'use client';

import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '../../../components/AdminPageHeader';
import { EnhancedContentForm } from '../../../components/EnhancedContentForm';
import { BreadcrumbNav } from '../../../components/BreadcrumbNav';

export default function NewPagePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Include cookies for session
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.details || errorData.error || 'Sayfa oluşturulamadı';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      // Re-throw with better error message
      if (error.message) {
        throw error;
      }
      throw new Error('Sayfa oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleCancel = () => {
    router.push('/admin/pages');
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: 'Sayfalar', href: '/admin/pages' },
          { label: 'Yeni Sayfa' },
        ]}
      />
      
      <AdminPageHeader
        title="Yeni Sayfa"
        description="Yeni bir sayfa oluşturun"
      />

      <EnhancedContentForm
        entityType="page"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

