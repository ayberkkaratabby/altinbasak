import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  target?: HTMLElement | null;
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
  target,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable ||
      (target.tagName === 'DIV' && target.getAttribute('contenteditable') === 'true')
    ) {
      // Allow Cmd/Ctrl+S and Cmd/Ctrl+K even in inputs
      const isSave = (event.metaKey || event.ctrlKey) && event.key === 's';
      const isCommandPalette = (event.metaKey || event.ctrlKey) && event.key === 'k';
      
      if (!isSave && !isCommandPalette) {
        return;
      }
    }

    for (const shortcut of shortcuts) {
      const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
      
      // Handle ctrl/meta: if ctrl is true, either ctrl or meta should be pressed (for cross-platform)
      // If ctrl is false/undefined, neither should be pressed
      const ctrlMatches = shortcut.ctrl !== undefined
        ? (shortcut.ctrl ? (event.ctrlKey || event.metaKey) : (!event.ctrlKey && !event.metaKey))
        : true;
      
      // Handle shift
      const shiftMatches = shortcut.shift !== undefined
        ? (shortcut.shift ? event.shiftKey : !event.shiftKey)
        : true;
      
      // Handle alt
      const altMatches = shortcut.alt !== undefined
        ? (shortcut.alt ? event.altKey : !event.altKey)
        : true;
      
      // Meta is handled by ctrl (cross-platform compatibility)
      // If meta is explicitly set, check it separately
      const metaMatches = shortcut.meta !== undefined && shortcut.ctrl === undefined
        ? (shortcut.meta ? event.metaKey : !event.metaKey)
        : true;

      if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.action();
        break;
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    const element = target || window;
    
    element.addEventListener('keydown', handleKeyDown as EventListener);
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [handleKeyDown, target]);
}

// Common keyboard shortcuts helper
export const createShortcut = (
  key: string,
  action: () => void,
  options?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    description?: string;
    preventDefault?: boolean;
  }
): KeyboardShortcut => ({
  key,
  action,
  ctrl: options?.ctrl,
  shift: options?.shift,
  alt: options?.alt,
  meta: options?.meta,
  description: options?.description,
  preventDefault: options?.preventDefault,
});

