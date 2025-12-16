'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../../../components/AdminPageHeader';
import { EnhancedContentForm } from '../../../../components/EnhancedContentForm';
import { BreadcrumbNav } from '../../../../components/BreadcrumbNav';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/admin/services/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInitialData(data);
        } else {
          console.error('Failed to fetch service');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Hizmet güncellenemedi');
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
          { label: 'Hizmetler', href: '/admin/services' },
          { label: initialData?.translations?.[0]?.title || 'Hizmet Düzenle' },
        ]}
      />
      
      <AdminPageHeader
        title="Hizmet Düzenle"
        description="Hizmet bilgilerini düzenleyin"
      />

      <EnhancedContentForm
        entityType="service"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
