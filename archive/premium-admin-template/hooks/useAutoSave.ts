import { useState, useEffect, useCallback, useRef } from 'react';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
  onStatusChange?: (status: AutoSaveStatus) => void;
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
  onStatusChange,
}: UseAutoSaveOptions<T>) {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);
  const isInitialMount = useRef(true);

  // Update status and notify
  const updateStatus = useCallback((newStatus: AutoSaveStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  // Check if data has changed
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousDataRef.current = data;
      return;
    }

    const hasChanged = JSON.stringify(previousDataRef.current) !== JSON.stringify(data);
    
    if (hasChanged) {
      setHasUnsavedChanges(true);
      previousDataRef.current = data;
    }
  }, [data]);

  // Auto-save function
  const save = useCallback(async () => {
    if (!enabled || !hasUnsavedChanges || status === 'saving') return;

    updateStatus('saving');
    
    try {
      await onSave(data);
      updateStatus('saved');
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      // Reset to idle after 2 seconds
      setTimeout(() => {
        updateStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      updateStatus('error');
      
      // Reset to idle after 3 seconds on error
      setTimeout(() => {
        updateStatus('idle');
      }, 3000);
    }
  }, [data, enabled, hasUnsavedChanges, status, onSave, updateStatus]);

  // Debounced auto-save
  useEffect(() => {
    if (!enabled || !hasUnsavedChanges) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, hasUnsavedChanges, debounceMs, save]);

  // Manual save function
  const manualSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
  }, [save]);

  return {
    status,
    lastSaved,
    hasUnsavedChanges,
    save: manualSave,
  };
}

