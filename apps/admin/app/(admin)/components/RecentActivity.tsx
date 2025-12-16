'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/admin/Icon';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';

interface RecentActivityProps {
  recentPages: any[];
  recentProjects: any[];
  recentPosts: any[];
  recentLeads: any[];
}

export function RecentActivity({
  recentPages,
  recentProjects,
  recentPosts,
  recentLeads,
}: RecentActivityProps) {
  const activities: Array<{
    id: string;
    type: 'page' | 'project' | 'post' | 'lead';
    title: string;
    date: Date;
    icon: string;
    href: string;
    color: string;
  }> = [
    ...recentPages.slice(0, 3).map((page: any) => ({
      id: page.id,
      type: 'page' as const,
      title: page.translations.find((t: any) => t.locale === 'tr')?.title || page.slug,
      date: page.updatedAt,
      icon: 'pages',
      href: `/admin/pages/${page.id}`,
      color: 'bg-blue-100 text-blue-700',
    })),
    ...recentProjects.slice(0, 2).map((project: any) => ({
      id: project.id,
      type: 'project' as const,
      title: project.translations.find((t: any) => t.locale === 'tr')?.title || project.slug,
      date: project.updatedAt,
      icon: 'projects',
      href: `/admin/projects/${project.id}`,
      color: 'bg-purple-100 text-purple-700',
    })),
    ...recentPosts.slice(0, 2).map((post: any) => ({
      id: post.id,
      type: 'post' as const,
      title: post.translations.find((t: any) => t.locale === 'tr')?.title || post.slug,
      date: post.updatedAt,
      icon: 'blog',
      href: `/admin/blog/${post.id}`,
      color: 'bg-green-100 text-green-700',
    })),
    ...recentLeads.slice(0, 2).map((lead: any) => ({
      id: lead.id,
      type: 'lead' as const,
      title: lead.name,
      date: lead.createdAt,
      icon: 'leads',
      href: `/admin/leads/${lead.id}`,
      color: 'bg-red-100 text-red-700',
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Icon name="clock" size={20} />
          Son Aktiviteler
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Icon name="alert" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Henüz aktivite yok</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <Link key={activity.id} href={activity.href}>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className={`w-8 h-8 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={activity.icon as any} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-black transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(activity.date), 'd MMM yyyy, HH:mm', { locale: tr })}
                    </p>
                  </div>
                  <Icon
                    name="chevronDown"
                    size={16}
                    className="text-gray-400 group-hover:text-gray-600 transition-colors rotate-[-90deg] flex-shrink-0"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

