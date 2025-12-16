'use client';

import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '../../../components/AdminPageHeader';
import { EnhancedContentForm } from '../../../components/EnhancedContentForm';
import { BreadcrumbNav } from '../../../components/BreadcrumbNav';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.details || error.error || 'Proje oluşturulamadı');
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/admin/projects');
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: 'Projeler', href: '/admin/projects' },
          { label: 'Yeni Proje' },
        ]}
      />
      
      <AdminPageHeader
        title="Yeni Proje"
        description="Yeni bir proje oluşturun"
      />

      <EnhancedContentForm
        entityType="project"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
