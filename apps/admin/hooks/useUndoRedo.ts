import { useState, useCallback } from 'react';

interface UseUndoRedoOptions<T> {
  initialValue: T;
  maxHistory?: number;
}

export function useUndoRedo<T>({ initialValue, maxHistory = 50 }: UseUndoRedoOptions<T>) {
  const [history, setHistory] = useState<T[]>([initialValue]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = history[currentIndex];

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const setState = useCallback((newState: T) => {
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      newHistory.push(newState);
      // Limit history size
      if (newHistory.length > maxHistory) {
        return newHistory.slice(-maxHistory);
      }
      return newHistory;
    });
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex >= maxHistory ? maxHistory - 1 : newIndex;
    });
  }, [currentIndex, maxHistory]);

  return {
    current,
    undo,
    redo,
    setState,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}
