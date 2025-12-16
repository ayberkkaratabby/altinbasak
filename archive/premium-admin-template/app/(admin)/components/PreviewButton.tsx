'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface PreviewButtonProps {
  entityType: 'page' | 'project' | 'blog';
  entityId: string;
}

export function PreviewButton({ entityType, entityId }: PreviewButtonProps) {
  const handlePreview = async () => {
    try {
      const response = await fetch(`/api/admin/preview/${entityType}/${entityId}`);
      const data = await response.json();
      
      if (data.token) {
        window.open(`/preview/${entityType}/${entityId}?token=${data.token}`, '_blank');
      }
    } catch (error) {
      alert('Failed to generate preview');
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handlePreview}>
      Preview
    </Button>
  );
}

