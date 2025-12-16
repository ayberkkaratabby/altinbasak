'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface ContentSchedulerProps {
  scheduledAt?: string | null;
  publishedAt?: string | null;
  status?: string;
  onSchedule?: (date: string) => Promise<void>;
  onPublish?: (date: string) => Promise<void>;
  onUnschedule?: () => Promise<void>;
}

export function ContentScheduler({
  scheduledAt,
  publishedAt,
  status,
  onSchedule,
  onPublish,
  onUnschedule,
}: ContentSchedulerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>İçerik Zamanlayıcı</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Yayın Tarihi</label>
          <Input
            type="datetime-local"
            value={publishedAt ? new Date(publishedAt).toISOString().slice(0, 16) : ''}
            onChange={(e) => onPublish?.(e.target.value)}
          />
        </div>
        {status === 'SCHEDULED' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zamanlanmış Tarih</label>
            <Input
              type="datetime-local"
              value={scheduledAt ? new Date(scheduledAt).toISOString().slice(0, 16) : ''}
              onChange={(e) => onSchedule?.(e.target.value)}
            />
          </div>
        )}
        <p className="text-sm text-gray-500">İçeriği belirli bir tarihte otomatik olarak yayınlayın.</p>
      </CardContent>
    </Card>
  );
}
