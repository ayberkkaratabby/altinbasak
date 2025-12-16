'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface AnalyticsDashboardProps {
  entityType?: string;
  entityId?: string;
}

export function AnalyticsDashboard({
  entityType,
  entityId,
}: AnalyticsDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analitik</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Analitik verileri henüz mevcut değil.</p>
      </CardContent>
    </Card>
  );
}
