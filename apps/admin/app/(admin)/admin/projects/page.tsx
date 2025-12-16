'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { PremiumTable } from '../../components/PremiumTable';
import { Icon } from '@/components/admin/Icon';
import { BreadcrumbNav } from '../../components/BreadcrumbNav';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { useToastContext } from '../../components/ToastProvider';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'published' | 'draft';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const { toast } = useToastContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/admin/projects', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const transformedProjects = data.map((project: any) => ({
            id: project.id,
            title: project.translations?.find((t: any) => t.locale === 'tr')?.title || project.slug || 'Başlıksız',
            slug: project.slug,
            category: project.category || '',
            status: project.status || 'draft',
            featured: project.featured || false,
            updatedAt: project.updatedAt || new Date().toISOString(),
          }));
          setProjects(transformedProjects);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to fetch projects:', errorData);
          toast.error('Projeler yüklenemedi', { 
            description: errorData.details || errorData.error || 'Bilinmeyen hata' 
          });
        }
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast.error('Projeler yüklenirken bir hata oluştu', { 
          description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const columns = [
    {
      key: 'title',
      label: 'Proje Adı',
      sortable: true,
      filterable: true,
      render: (project: Project) => (
        <div className="flex items-center gap-3">
          <Thumbnail
            src={(project as any).thumbnail}
            fallbackIcon="projects"
            size="sm"
          />
          <div>
            <div className="font-medium text-gray-900">{project.title}</div>
            <div className="text-sm text-gray-500">{project.category}</div>
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
      key: 'featured',
      label: 'Öne Çıkan',
      render: (project: Project) => (
        project.featured ? (
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
        { value: 'published', label: 'Yayında' },
        { value: 'draft', label: 'Taslak' },
      ],
      render: (project: Project) => {
        const statusColors = {
          published: 'bg-green-100 text-green-800',
          draft: 'bg-yellow-100 text-yellow-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
            {project.status === 'published' ? 'Yayında' : 'Taslak'}
          </span>
        );
      },
    },
    {
      key: 'updatedAt',
      label: 'Son Güncelleme',
      sortable: true,
      render: (project: Project) => new Date(project.updatedAt).toLocaleDateString('tr-TR'),
    },
  ];

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: 'Projeler' },
        ]}
      />
      
      <AdminPageHeader
        title="Projeler"
        description="Projelerinizi yönetin"
        action={{
          label: 'Yeni Proje',
          href: '/admin/projects/new',
        }}
      />

      <PremiumTable
        columns={columns}
        data={projects}
        onEdit={(project) => `/admin/projects/${project.id}/edit`}
        onDelete={async (project) => {
          if (!confirm(`"${project.title}" projesini silmek istediğinize emin misiniz?`)) {
            return;
          }
          
          try {
            const response = await fetch(`/api/admin/projects/${project.id}`, {
              method: 'DELETE',
              credentials: 'include',
            });
            
            if (response.ok) {
              setProjects(projects.filter(p => p.id !== project.id));
              toast.success('Proje başarıyla silindi');
            } else {
              const error = await response.json().catch(() => ({ error: 'Unknown error' }));
              throw new Error(error.details || error.error || 'Proje silinemedi');
            }
          } catch (error: any) {
            console.error('Error deleting project:', error);
            toast.error('Proje silinirken bir hata oluştu', { 
              description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
            });
          }
        }}
        emptyMessage="Henüz proje eklenmemiş."
        searchable
        selectable
        exportable
      />
    </div>
  );
}

