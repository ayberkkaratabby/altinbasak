'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/admin/Icon';
import { EmptyState } from '@/components/admin/EmptyState';
import { Tooltip } from '@/components/admin/Tooltip';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type SortDirection = 'asc' | 'desc' | null;
type FilterType = 'text' | 'select' | 'date';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: FilterType;
  filterOptions?: { value: string; label: string }[];
  width?: string;
}

interface PremiumTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => string;
  onDelete?: (item: T) => Promise<void>;
  onBulkDelete?: (items: T[]) => Promise<void>;
  emptyMessage?: string;
  searchable?: boolean;
  selectable?: boolean;
  exportable?: boolean;
  defaultSort?: { key: string; direction: 'asc' | 'desc' };
}

export function PremiumTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  onBulkDelete,
  emptyMessage = 'Öğe bulunamadı.',
  searchable = true,
  selectable = true,
  exportable = false,
  defaultSort,
}: PremiumTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSort?.direction || null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (search) {
      result = result.filter((item) => {
        return columns.some((col) => {
          const value = col.render ? String(col.render(item)) : String(item[col.key as keyof T]);
          return value.toLowerCase().includes(search.toLowerCase());
        });
      });
    }

    // Column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => {
          const col = columns.find((c) => c.key === key);
          if (!col) return true;
          const itemValue = col.render ? String(col.render(item)) : String(item[col.key as keyof T]);
          return itemValue.toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Sort
    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const col = columns.find((c) => c.key === sortKey);
        if (!col) return 0;

        const aValue = col.render ? String(col.render(a)) : String(a[sortKey as keyof T]);
        const bValue = col.render ? String(col.render(b)) : String(b[sortKey as keyof T]);

        const comparison = aValue.localeCompare(bValue, 'tr', { numeric: true });
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, search, filters, sortKey, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortKey(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedData.map((item) => item.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedItems.size === 0) return;
    if (!confirm(`${selectedItems.size} öğeyi silmek istediğinizden emin misiniz?`)) return;

    const itemsToDelete = data.filter((item) => selectedItems.has(item.id));
    await onBulkDelete(itemsToDelete);
    setSelectedItems(new Set());
  };

  const handleExport = () => {
    const csv = [
      columns.map((col) => col.label).join(','),
      ...filteredData.map((item) =>
        columns
          .map((col) => {
            const value = col.render ? String(col.render(item)) : String(item[col.key as keyof T]);
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
        <Icon name="alert" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {searchable && (
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Ara..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                  floatingLabel={false}
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Icon name="filter" size={18} />
              Filtrele
              {Object.values(filters).some((v) => v) && (
                <span className="ml-1 px-2 py-0.5 bg-black text-white text-xs rounded-full">
                  {Object.values(filters).filter((v) => v).length}
                </span>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {selectable && selectedItems.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600 hover:bg-red-50"
              >
                <Icon name="delete" size={18} className="mr-2" />
                {selectedItems.size} Öğeyi Sil
              </Button>
            )}
            {exportable && (
              <Button variant="ghost" size="sm" onClick={handleExport}>
                <Icon name="download" size={18} className="mr-2" />
                Dışa Aktar
              </Button>
            )}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value={10}>10 / sayfa</option>
              <option value={25}>25 / sayfa</option>
              <option value={50}>50 / sayfa</option>
              <option value={100}>100 / sayfa</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {columns
                  .filter((col) => col.filterable)
                  .map((col) => (
                    <div key={col.key}>
                      {col.filterType === 'select' && col.filterOptions ? (
                        <select
                          value={filters[col.key] || ''}
                          onChange={(e) =>
                            setFilters({ ...filters, [col.key]: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                        >
                          <option value="">Tümü</option>
                          {col.filterOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          placeholder={`${col.label} ara...`}
                          value={filters[col.key] || ''}
                          onChange={(e) =>
                            setFilters({ ...filters, [col.key]: e.target.value })
                          }
                          floatingLabel={false}
                          className="text-sm"
                        />
                      )}
                    </div>
                  ))}
              </div>
              {Object.values(filters).some((v) => v) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({})}
                  className="mt-3 text-xs"
                >
                  Filtreleri Temizle
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <EmptyState
          icon="pages"
          title={search || Object.values(filters).some(v => v) ? "Sonuç bulunamadı" : "Henüz öğe yok"}
          description={search || Object.values(filters).some(v => v) 
            ? "Arama kriterlerinizi değiştirip tekrar deneyin."
            : emptyMessage}
        />
      )}

      {/* Table */}
      {paginatedData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black/20"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-gray-100 transition-colors',
                    column.width
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <Icon
                          name={sortKey === column.key && sortDirection === 'asc' ? 'sortUp' : 'sort'}
                          size={14}
                          className={cn(
                            'text-gray-400',
                            sortKey === column.key && sortDirection === 'asc' && 'text-black'
                          )}
                        />
                        <Icon
                          name={sortKey === column.key && sortDirection === 'desc' ? 'sortDown' : 'sort'}
                          size={14}
                          className={cn(
                            'text-gray-400 -mt-1',
                            sortKey === column.key && sortDirection === 'desc' && 'text-black'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => {
              const isSelected = selectedItems.has(item.id);
              return (
                <tr
                  key={item.id}
                  className={cn(
                    'hover:bg-gray-50 transition-colors',
                    isSelected && 'bg-blue-50/50'
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black/20"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render ? column.render(item) : String(item[column.key as keyof T])}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <Link href={onEdit(item)}>
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                            <Icon name="edit" size={16} className="mr-1" />
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
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Icon name="delete" size={16} className="mr-1" />
                          Sil
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Toplam <span className="font-semibold">{filteredData.length}</span> öğe
              {filteredData.length !== data.length && (
                <span className="text-gray-500">
                  {' '}
                  ({data.length} öğeden filtrelendi)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <Icon name="chevronUp" size={16} className="rotate-90" />
                Önceki
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        'px-3 py-1.5 text-sm rounded-lg transition-colors',
                        currentPage === pageNum
                          ? 'bg-black text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Sonraki
                <Icon name="chevronDown" size={16} className="rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

