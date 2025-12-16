'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardChartsProps {
  pagesCount: number;
  projectsCount: number;
  postsCount: number;
  leadsCount: number;
}

export function DashboardCharts({
  pagesCount,
  projectsCount,
  postsCount,
  leadsCount,
}: DashboardChartsProps) {
  // Mock data for charts (in production, this would come from analytics)
  const contentData = [
    { name: 'Ocak', pages: 2, projects: 1, posts: 3 },
    { name: 'Şubat', pages: 3, projects: 2, posts: 5 },
    { name: 'Mart', pages: 4, projects: 3, posts: 7 },
    { name: 'Nisan', pages: 5, projects: 4, posts: 9 },
    { name: 'Mayıs', pages: 6, projects: 5, posts: 11 },
    { name: 'Haziran', pages: pagesCount, projects: projectsCount, posts: postsCount },
  ];

  const leadsData = [
    { name: 'Ocak', leads: 12 },
    { name: 'Şubat', leads: 19 },
    { name: 'Mart', leads: 15 },
    { name: 'Nisan', leads: 22 },
    { name: 'Mayıs', leads: 18 },
    { name: 'Haziran', leads: leadsCount },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Content Growth Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            İçerik Büyümesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={contentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="pages"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Sayfalar"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Projeler"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#10b981"
                strokeWidth={2}
                name="Blog Yazıları"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Leads Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Lead Trendi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="leads" fill="#ef4444" radius={[8, 8, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

