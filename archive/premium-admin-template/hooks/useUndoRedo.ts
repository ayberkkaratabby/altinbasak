import { useState, useCallback, useRef } from 'react';

interface UseUndoRedoOptions<T> {
  initialValue: T;
  maxHistory?: number;
  onStateChange?: (state: T) => void;
}

export function useUndoRedo<T>({
  initialValue,
  maxHistory = 50,
  onStateChange,
}: UseUndoRedoOptions<T>) {
  const [currentState, setCurrentState] = useState<T>(initialValue);
  const historyRef = useRef<T[]>([initialValue]);
  const currentIndexRef = useRef(0);
  const isUndoingRef = useRef(false);

  // Deep clone helper
  const clone = useCallback((state: T): T => {
    return JSON.parse(JSON.stringify(state));
  }, []);

  // Update state and add to history
  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    const state = typeof newState === 'function' 
      ? (newState as (prev: T) => T)(currentState)
      : newState;

    // If we're in the middle of history (not at the end), remove future states
    if (currentIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);
    }

    // Add new state to history
    const clonedState = clone(state);
    historyRef.current.push(clonedState);

    // Limit history size
    if (historyRef.current.length > maxHistory) {
      historyRef.current.shift();
    } else {
      currentIndexRef.current++;
    }

    setCurrentState(clonedState);
    onStateChange?.(clonedState);
  }, [currentState, maxHistory, clone, onStateChange]);

  // Undo
  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      isUndoingRef.current = true;
      currentIndexRef.current--;
      const previousState = clone(historyRef.current[currentIndexRef.current]);
      setCurrentState(previousState);
      onStateChange?.(previousState);
      
      setTimeout(() => {
        isUndoingRef.current = false;
      }, 0);
    }
  }, [clone, onStateChange]);

  // Redo
  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      isUndoingRef.current = true;
      currentIndexRef.current++;
      const nextState = clone(historyRef.current[currentIndexRef.current]);
      setCurrentState(nextState);
      onStateChange?.(nextState);
      
      setTimeout(() => {
        isUndoingRef.current = false;
      }, 0);
    }
  }, [clone, onStateChange]);

  // Check if undo/redo is available
  const canUndo = currentIndexRef.current > 0;
  const canRedo = currentIndexRef.current < historyRef.current.length - 1;

  // Reset history
  const reset = useCallback((newInitialValue?: T) => {
    const value = newInitialValue ?? initialValue;
    historyRef.current = [clone(value)];
    currentIndexRef.current = 0;
    setCurrentState(clone(value));
    onStateChange?.(clone(value));
  }, [initialValue, clone, onStateChange]);

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historyLength: historyRef.current.length,
    currentIndex: currentIndexRef.current,
  };
}

