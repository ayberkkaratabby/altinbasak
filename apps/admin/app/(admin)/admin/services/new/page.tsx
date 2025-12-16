'use client';

import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '../../../components/AdminPageHeader';
import { EnhancedContentForm } from '../../../components/EnhancedContentForm';
import { BreadcrumbNav } from '../../../components/BreadcrumbNav';

export default function NewServicePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.details || error.error || 'Hizmet oluşturulamadı');
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/admin/services');
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: 'Hizmetler', href: '/admin/services' },
          { label: 'Yeni Hizmet' },
        ]}
      />
      
      <AdminPageHeader
        title="Yeni Hizmet"
        description="Yeni bir hizmet oluşturun"
      />

      <EnhancedContentForm
        entityType="service"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
