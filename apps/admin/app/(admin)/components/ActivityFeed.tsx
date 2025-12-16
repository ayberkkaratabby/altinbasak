'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/admin/Icon';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete' | 'publish';
  entityType: 'page' | 'project' | 'blog' | 'service';
  entityTitle: string;
  entityId: string;
  user: string;
  timestamp: Date;
  icon: string;
  color: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // TODO: Fetch from API or use WebSocket for real-time updates
    // Mock data for now
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'create',
        entityType: 'page',
        entityTitle: 'Yeni Sayfa',
        entityId: '1',
        user: 'Admin',
        timestamp: new Date(),
        icon: 'pages',
        color: 'bg-blue-100 text-blue-700',
      },
      {
        id: '2',
        type: 'update',
        entityType: 'project',
        entityTitle: 'Proje Güncellendi',
        entityId: '2',
        user: 'Admin',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        icon: 'projects',
        color: 'bg-purple-100 text-purple-700',
      },
    ];
    setActivities(mockActivities);
  }, []);

  const getActivityLabel = (activity: Activity) => {
    const actions: Record<string, string> = {
      create: 'oluşturuldu',
      update: 'güncellendi',
      delete: 'silindi',
      publish: 'yayınlandı',
    };
    return actions[activity.type] || 'değiştirildi';
  };

  const getEntityRoute = (entityType: string, entityId: string) => {
    const routes: Record<string, string> = {
      page: `/admin/pages/${entityId}/edit`,
      project: `/admin/projects/${entityId}/edit`,
      blog: `/admin/blog/${entityId}/edit`,
      service: `/admin/services/${entityId}/edit`,
    };
    return routes[entityType] || '#';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    return `${days} gün önce`;
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-24 bg-white rounded-l-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <Icon name="chevronDown" size={20} className="rotate-[-90deg] text-gray-600" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl z-40 flex flex-col"
      data-tour="activity-feed"
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Son Aktiviteler</h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Icon name="chevronDown" size={20} className="rotate-90 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icon name="empty" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Henüz aktivite yok</p>
            </div>
          ) : (
            activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Link href={getEntityRoute(activity.entityType, activity.entityId)}>
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-lg', activity.color)}>
                      <Icon name={activity.icon as any} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.entityTitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {getActivityLabel(activity)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

