'use client';

import React from 'react';
import { Icon } from './Icon';

interface AutoSaveIndicatorProps {
  status?: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date | null;
}

export function AutoSaveIndicator({ status = 'saved', lastSaved }: AutoSaveIndicatorProps) {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon name="clock" size={16} />
        <span>Kaydediliyor...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <Icon name="alert" size={16} />
        <span>Kaydetme hatası</span>
      </div>
    );
  }

  if (status === 'idle') {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-500">
      <Icon name="check" size={16} />
      <span>
        Kaydedildi
        {lastSaved && (
          <span className="ml-2 text-xs text-gray-400">
            {lastSaved.toLocaleTimeString('tr-TR')}
          </span>
        )}
      </span>
    </div>
  );
}
