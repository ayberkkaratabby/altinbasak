import { useEffect, useRef, useState } from 'react';

interface UseAutoSaveOptions {
  data: any;
  onSave: (data: any) => Promise<void>;
  debounceMs?: number;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave({
  data,
  onSave,
  debounceMs = 2000,
  delay,
  enabled = true,
}: UseAutoSaveOptions) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const delayMs = delay || debounceMs;

  useEffect(() => {
    if (!enabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setHasUnsavedChanges(true);
    setStatus('idle');

    timeoutRef.current = setTimeout(async () => {
      try {
        setStatus('saving');
        await onSave(data);
        setStatus('saved');
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        setStatus('error');
        console.error('Auto-save error:', error);
      }
    }, delayMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delayMs, enabled]);

  const save = async () => {
    try {
      setStatus('saving');
      await onSave(data);
      setStatus('saved');
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      setStatus('error');
      console.error('Manual save error:', error);
    }
  };

  return {
    status,
    lastSaved,
    hasUnsavedChanges,
    save,
  };
}
