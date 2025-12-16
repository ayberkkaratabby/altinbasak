'use client';

import React, { useState } from 'react';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';

interface HelpTooltipProps {
  content: string;
  example?: string;
  videoUrl?: string;
  className?: string;
}

export function HelpTooltip({
  content,
  example,
  videoUrl,
  className,
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={className}
        aria-label="Yardım"
      >
        <Icon
          name="alert"
          size={16}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        />
      </button>

      {isOpen && (
        <Tooltip
          content={
            <div className="max-w-xs space-y-2">
              <p className="text-sm text-gray-900">{content}</p>
              {example && (
                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Örnek:
                  </p>
                  <p className="text-xs font-mono text-gray-900">{example}</p>
                </div>
              )}
              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
                >
                  Video rehberi izle →
                </a>
              )}
            </div>
          }
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

