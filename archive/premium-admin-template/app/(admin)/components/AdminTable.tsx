'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    DRAFT: { label: 'Taslak', className: 'bg-gray-100 text-gray-800' },
    IN_REVIEW: { label: 'İncelemede', className: 'bg-yellow-100 text-yellow-800' },
    PUBLISHED: { label: 'Yayınlandı', className: 'bg-green-100 text-green-800' },
    SCHEDULED: { label: 'Zamanlanmış', className: 'bg-blue-100 text-blue-800' },
  };

  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

interface LocaleBadgeProps {
  locales: string[];
}

export function LocaleBadge({ locales }: LocaleBadgeProps) {
  return (
    <div className="flex gap-1">
      {locales.includes('tr') && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          TR
        </span>
      )}
      {locales.includes('en') && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          EN
        </span>
      )}
    </div>
  );
}

interface AdminTableProps {
  columns: Array<{
    key: string;
    label: string;
    render?: (item: any) => React.ReactNode;
  }>;
  data: any[];
  onEdit?: (item: any) => string;
  onDelete?: (item: any) => Promise<void>;
  emptyMessage?: string;
}

export function AdminTable({ columns, data, onEdit, onDelete, emptyMessage = 'Öğe bulunamadı.' }: AdminTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <Link href={onEdit(item)}>
                        <Button variant="primary" size="sm">
                          Düzenle
                        </Button>
                      </Link>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
                            await onDelete(item);
                          }
                        }}
                      >
                        Sil
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

