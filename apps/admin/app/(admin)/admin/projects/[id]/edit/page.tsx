'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../../../components/AdminPageHeader';
import { EnhancedContentForm } from '../../../../components/EnhancedContentForm';
import { BreadcrumbNav } from '../../../../components/BreadcrumbNav';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/admin/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInitialData(data);
        } else {
          console.error('Failed to fetch project');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Proje güncellenemedi');
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
          { label: 'Projeler', href: '/admin/projects' },
          { label: initialData?.translations?.[0]?.title || 'Proje Düzenle' },
        ]}
      />
      
      <AdminPageHeader
        title="Proje Düzenle"
        description="Proje bilgilerini düzenleyin"
      />

      <EnhancedContentForm
        entityType="project"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
