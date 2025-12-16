'use client';

import React from 'react';
import { Textarea } from '@/components/ui/Input';

interface RichTextEditorWrapperProps {
  value?: string | null;
  content?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  locale?: string;
}

export function RichTextEditorWrapper({
  value,
  content,
  onChange,
  placeholder = 'İçerik girin...',
  locale,
}: RichTextEditorWrapperProps) {
  const textValue = value || content || '';

  return (
    <Textarea
      value={textValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={10}
      className="min-h-[200px]"
    />
  );
}
