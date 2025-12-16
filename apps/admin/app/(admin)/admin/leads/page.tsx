'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { PremiumTable } from '../../components/PremiumTable';
import { Icon } from '@/components/admin/Icon';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // TODO: Create /api/admin/leads endpoint
        // For now, return empty array
        setLeads([]);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'İsim',
      sortable: true,
      filterable: true,
      render: (lead: Lead) => (
        <div className="flex items-center gap-3">
          <Icon name="leads" size={20} className="text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">{lead.name}</div>
            <div className="text-sm text-gray-500">{lead.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Telefon',
      render: (lead: Lead) => lead.phone || '-',
    },
    {
      key: 'source',
      label: 'Kaynak',
      sortable: true,
      filterable: true,
    },
    {
      key: 'status',
      label: 'Durum',
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'new', label: 'Yeni' },
        { value: 'contacted', label: 'İletişime Geçildi' },
        { value: 'qualified', label: 'Nitelikli' },
        { value: 'converted', label: 'Dönüştürüldü' },
        { value: 'lost', label: 'Kayıp' },
      ],
      render: (lead: Lead) => {
        const statusColors = {
          new: 'bg-blue-100 text-blue-800',
          contacted: 'bg-yellow-100 text-yellow-800',
          qualified: 'bg-purple-100 text-purple-800',
          converted: 'bg-green-100 text-green-800',
          lost: 'bg-red-100 text-red-800',
        };
        const statusLabels = {
          new: 'Yeni',
          contacted: 'İletişime Geçildi',
          qualified: 'Nitelikli',
          converted: 'Dönüştürüldü',
          lost: 'Kayıp',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
            {statusLabels[lead.status]}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Tarih',
      sortable: true,
      render: (lead: Lead) => new Date(lead.createdAt).toLocaleDateString('tr-TR'),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Leads"
        description="Müşteri adaylarını ve iletişim formlarını yönetin"
      />

      <PremiumTable
        columns={columns}
        data={leads}
        onEdit={(lead) => `/admin/leads/${lead.id}`}
        onDelete={async (lead) => {
          // TODO: Implement delete
          console.log('Delete lead:', lead.id);
        }}
        emptyMessage="Henüz lead kaydı bulunmuyor."
        searchable
        selectable
        exportable
      />
    </div>
  );
}

