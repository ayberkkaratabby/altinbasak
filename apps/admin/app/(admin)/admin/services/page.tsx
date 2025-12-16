'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { PremiumTable } from '../../components/PremiumTable';
import { Icon } from '@/components/admin/Icon';
import { BreadcrumbNav } from '../../components/BreadcrumbNav';
import { useToastContext } from '../../components/ToastProvider';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  price?: string;
  status: 'active' | 'inactive';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesPage() {
  const { toast } = useToastContext();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/admin/services', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const transformedServices = data.map((service: any) => ({
            id: service.id,
            title: service.translations?.find((t: any) => t.locale === 'tr')?.title || service.slug || 'Başlıksız',
            slug: service.slug,
            description: service.translations?.find((t: any) => t.locale === 'tr')?.description || '',
            price: service.price,
            status: service.status || 'inactive',
            featured: service.featured || false,
            createdAt: service.createdAt || new Date().toISOString(),
            updatedAt: service.updatedAt || new Date().toISOString(),
          }));
          setServices(transformedServices);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to fetch services:', errorData);
          toast.error('Hizmetler yüklenemedi', { 
            description: errorData.details || errorData.error || 'Bilinmeyen hata' 
          });
        }
      } catch (error: any) {
        console.error('Error fetching services:', error);
        toast.error('Hizmetler yüklenirken bir hata oluştu', { 
          description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  const columns = [
    {
      key: 'title',
      label: 'Hizmet Adı',
      sortable: true,
      filterable: true,
      render: (service: Service) => (
        <div className="flex items-center gap-3">
          <Icon name="services" size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="font-medium text-gray-900">{service.title}</div>
            {service.description && (
              <div className="text-sm text-gray-500 mt-1 line-clamp-1">{service.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Fiyat',
      sortable: true,
      render: (service: Service) => service.price || '-',
    },
    {
      key: 'featured',
      label: 'Öne Çıkan',
      render: (service: Service) => (
        service.featured ? (
          <Icon name="star" size={20} className="text-yellow-500" />
        ) : null
      ),
    },
    {
      key: 'status',
      label: 'Durum',
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Pasif' },
      ],
      render: (service: Service) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-gray-100 text-gray-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[service.status]}`}>
            {service.status === 'active' ? 'Aktif' : 'Pasif'}
          </span>
        );
      },
    },
    {
      key: 'updatedAt',
      label: 'Son Güncelleme',
      sortable: true,
      render: (service: Service) => new Date(service.updatedAt).toLocaleDateString('tr-TR'),
    },
  ];

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: 'Hizmetler' },
        ]}
      />
      
      <AdminPageHeader
        title="Hizmetler"
        description="Hizmetlerinizi yönetin"
        action={{
          label: 'Yeni Hizmet',
          href: '/admin/services/new',
        }}
      />

      <PremiumTable
        columns={columns}
        data={services}
        onEdit={(service) => `/admin/services/${service.id}/edit`}
        onDelete={async (service) => {
          if (!confirm(`"${service.title}" hizmetini silmek istediğinize emin misiniz?`)) {
            return;
          }
          
          try {
            const response = await fetch(`/api/admin/services/${service.id}`, {
              method: 'DELETE',
              credentials: 'include',
            });
            
            if (response.ok) {
              setServices(services.filter(s => s.id !== service.id));
              toast.success('Hizmet başarıyla silindi');
            } else {
              const error = await response.json().catch(() => ({ error: 'Unknown error' }));
              throw new Error(error.details || error.error || 'Hizmet silinemedi');
            }
          } catch (error: any) {
            console.error('Error deleting service:', error);
            toast.error('Hizmet silinirken bir hata oluştu', { 
              description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
            });
          }
        }}
        emptyMessage="Henüz hizmet eklenmemiş."
        searchable
        selectable
        exportable
      />
    </div>
  );
}

