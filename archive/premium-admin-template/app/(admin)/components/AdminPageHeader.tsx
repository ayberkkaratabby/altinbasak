import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>
        {action && (
          <Button variant="primary" asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

