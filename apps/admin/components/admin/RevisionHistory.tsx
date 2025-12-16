'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface RevisionHistoryProps {
  entityType?: string;
  entityId?: string;
  onRestore?: (revision: any) => Promise<void>;
}

export function RevisionHistory({
  entityType,
  entityId,
  onRestore,
}: RevisionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revizyon Geçmişi</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Revizyon geçmişi henüz mevcut değil.</p>
      </CardContent>
    </Card>
  );
}
