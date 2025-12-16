import { useEffect } from 'react';

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description?: string;
  action: () => void;
}

export function createShortcut(
  key: string,
  action: () => void,
  options?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    description?: string;
  }
): Shortcut {
  return {
    key,
    action,
    ...options,
  };
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
}: {
  shortcuts: Shortcut[];
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keyMatch = shortcut.key.toLowerCase() === e.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}
