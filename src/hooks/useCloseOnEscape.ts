import { useEffect } from 'react';

export function useCloseOnEscape(callBack: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        callBack();
      }
    };

    addEventListener('keydown', handleKeyDown);

    return (): void => {
      removeEventListener('keydown', handleKeyDown);
    };
  }, [callBack, enabled]);
}
