'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { BreadcrumbNav } from '../../components/BreadcrumbNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/admin/Icon';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ContentNode {
  id: string;
  type: 'page' | 'project' | 'blog' | 'service';
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  children?: ContentNode[];
  parent?: string;
}

export default function ContentMapPage() {
  const [selectedNode, setSelectedNode] = useState<ContentNode | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'list'>('tree');

  // Mock data - TODO: Fetch from API
  const contentTree: ContentNode[] = [
    {
      id: '1',
      type: 'page',
      title: 'Ana Sayfa',
      slug: 'ana-sayfa',
      status: 'published',
      children: [
        {
          id: '2',
          type: 'page',
          title: 'Hakkımızda',
          slug: 'hakkimizda',
          status: 'published',
        },
        {
          id: '3',
          type: 'page',
          title: 'Hizmetler',
          slug: 'hizmetler',
          status: 'published',
          children: [
            {
              id: '4',
              type: 'service',
              title: 'Web Tasarım',
              slug: 'web-tasarim',
              status: 'published',
            },
          ],
        },
      ],
    },
    {
      id: '5',
      type: 'project',
      title: 'Portfolio',
      slug: 'portfolio',
      status: 'published',
      children: [
        {
          id: '6',
          type: 'project',
          title: 'Proje 1',
          slug: 'proje-1',
          status: 'published',
        },
      ],
    },
  ];

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      page: 'pages',
      project: 'projects',
      blog: 'blog',
      service: 'services',
    };
    return icons[type] || 'pages';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      page: 'bg-blue-100 text-blue-700 border-blue-200',
      project: 'bg-purple-100 text-purple-700 border-purple-200',
      blog: 'bg-green-100 text-green-700 border-green-200',
      service: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderTreeNode = (node: ContentNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: level * 0.1 }}
          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
            selectedNode?.id === node.id
              ? 'border-gray-900 bg-gray-50'
              : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setSelectedNode(node)}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {/* Connector Line */}
          {level > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-6 border-l-2 border-gray-200" />
          )}

          {/* Type Badge */}
          <div className={`px-2 py-1 rounded-md text-xs font-semibold border ${getTypeColor(node.type)}`}>
            <Icon name={getTypeIcon(node.type) as any} size={14} className="inline mr-1" />
            {node.type}
          </div>

          {/* Content Info */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{node.title}</div>
            <div className="text-sm text-gray-500">/{node.slug}</div>
          </div>

          {/* Status Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
            {node.status === 'published' ? 'Yayında' : node.status === 'draft' ? 'Taslak' : 'Arşiv'}
          </span>

          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <Icon name="chevronDown" size={16} className="text-gray-400" />
          )}
        </motion.div>

        {/* Children */}
        {hasChildren && (
          <div className="mt-2">
            {node.children?.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: 'İçerik Haritası' },
        ]}
      />

      <AdminPageHeader
        title="İçerik Haritası"
        description="Sitenizdeki tüm içeriklerin görsel haritası ve ilişkileri"
      />

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'tree' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setViewMode('tree')}
        >
          <Icon name="pages" size={16} className="mr-2" />
          Ağaç Görünümü
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setViewMode('grid')}
        >
          <Icon name="media" size={16} className="mr-2" />
          Grid Görünümü
        </Button>
        <Button
          variant={viewMode === 'list' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <Icon name="pages" size={16} className="mr-2" />
          Liste Görünümü
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Tree */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>İçerik Yapısı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {contentTree.map((node) => renderTreeNode(node))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div>
          <Card className="border-0 shadow-lg sticky top-6">
            <CardHeader>
              <CardTitle>Detaylar</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Başlık</label>
                    <p className="text-lg font-bold text-gray-900 mt-1">{selectedNode.title}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">URL</label>
                    <p className="text-sm text-gray-700 mt-1 font-mono">/{selectedNode.slug}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Tip</label>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${getTypeColor(selectedNode.type)}`}>
                        {selectedNode.type}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Durum</label>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedNode.status)}`}>
                        {selectedNode.status === 'published' ? 'Yayında' : selectedNode.status === 'draft' ? 'Taslak' : 'Arşiv'}
                      </span>
                    </div>
                  </div>

                  {selectedNode.children && selectedNode.children.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Alt İçerikler</label>
                      <p className="text-sm text-gray-700 mt-1">{selectedNode.children.length} içerik</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 flex gap-2">
                    <Link href={`/admin/${selectedNode.type === 'page' ? 'pages' : selectedNode.type === 'blog' ? 'blog' : selectedNode.type + 's'}/${selectedNode.id}/edit`}>
                      <Button
                        variant="primary"
                        size="sm"
                      >
                        <Icon name="edit" size={16} className="mr-2" />
                        Düzenle
                      </Button>
                    </Link>
                    <Link href={`http://localhost:3000/${selectedNode.slug}`} target="_blank">
                      <Button
                        variant="secondary"
                        size="sm"
                      >
                        <Icon name="view" size={16} className="mr-2" />
                        Görüntüle
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Icon name="pages" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Bir içerik seçin</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

