'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../../../components/AdminPageHeader';
import { EnhancedContentForm } from '../../../../components/EnhancedContentForm';
import { BreadcrumbNav } from '../../../../components/BreadcrumbNav';

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/admin/pages/${id}`, {
          credentials: 'include', // Include cookies for session
        });
        
        if (response.ok) {
          const data = await response.json();
          setInitialData(data);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to fetch page:', errorData);
          // Show error to user
          alert(`Sayfa yüklenemedi: ${errorData.details || errorData.error || 'Bilinmeyen hata'}`);
          router.push('/admin/pages');
        }
      } catch (error: any) {
        console.error('Error fetching page:', error);
        alert(`Sayfa yüklenirken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
        router.push('/admin/pages');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPage();
    }
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Include cookies for session
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.details || errorData.error || 'Sayfa güncellenemedi';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      // Re-throw with better error message
      if (error.message) {
        throw error;
      }
      throw new Error('Sayfa güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleCancel = () => {
    router.push('/admin/pages');
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
          { label: 'Sayfalar', href: '/admin/pages' },
          { label: initialData?.translations?.[0]?.title || 'Sayfa Düzenle' },
        ]}
      />
      
      <AdminPageHeader
        title="Sayfa Düzenle"
        description="Sayfa bilgilerini düzenleyin"
      />

      <EnhancedContentForm
        entityType="page"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

