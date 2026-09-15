import { useEffect, useCallback } from 'react';
import type { Direction } from '../types';

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
  w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
  W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
};

export const useKeyboard = (
  onDir: (d: Direction) => void,
  onPause: () => void,
  onAction?: () => void,
) => {
  const handler = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
    const d = KEY_MAP[e.key];
    if (d) { onDir(d); return; }
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') { onPause(); return; }
    if (e.key === ' ' || e.key === 'Enter') { onAction?.(); }
  }, [onDir, onPause, onAction]);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
};
